import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Keyboard,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { salesQuoteCustomerAction } from '../../Redux/Actions/SalesQuoteAction';
import Icon from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CustomerLeadSearchScreen = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesQuote);
    const { pageTitle, orgId } = route.params;

    const dispatch = useDispatch();
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showNoCustomerToast, setShowNoCustomerToast] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setIsVisible(false);
            setBtnDisabled(true);
            setInputVal('');
            setShowNoCustomerToast(false);
            setCustomerId('');
            setCustomerName('');
        }, [])
    );

    useEffect(() => {
        if (inputVal.length > 2) {
            setIsLoading(true);
            dispatch(salesQuoteCustomerAction({
                value: inputVal
            }));
        } else {
            setIsVisible(false);
            setBtnDisabled(true);
            setFilteredResults([]);
        }
    }, [inputVal, dispatch]);

    useEffect(() => {
    if (Array.isArray(state.sqCustomerSearchResult)) {
        setIsLoading(false);
        setIsVisible(inputVal.length > 2);
        const filtered = state.sqCustomerSearchResult.filter(
            item => item.customer_id.toString() !== customerId.toString()
        );
        setFilteredResults(filtered);
    } else {
        setFilteredResults([]);
    }
}, [state.sqCustomerSearchResult, customerId]);

    useEffect(() => {
        if (inputVal.length > 4 && filteredResults.length === 0 && !isLoading && !customerId) {
            setShowNoCustomerToast(true);
            const timer = setTimeout(() => {
                setShowNoCustomerToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowNoCustomerToast(false);
        }
    }, [filteredResults, inputVal, isLoading, customerId]);

    const removeLocalStore = async () => {
        try {
            await AsyncStorage.removeItem('customer_id');
        } catch (e) {
            // remove error
        }
    };

    const setCustomerData = async (item) => {
        setInputVal(item.customer_name);
        setCustomerName(item.customer_name);
        setCustomerId(item.customer_id);
        setIsVisible(false);
        setBtnDisabled(false);
        await removeLocalStore();
        try {
            await AsyncStorage.setItem('customer_id', item.customer_id.toString());
        } catch (error) {
            console.error('Error saving customer_id to AsyncStorage:', error);
        }
        Keyboard.dismiss();
    };

    const goBack = () => {
        navigation.goBack();
    };

    const renderCustomerItem = (item) => (
        <TouchableOpacity
            key={item.customer_id.toString()}
            onPress={() => setCustomerData(item)}
            style={styles.customerItem}
        >
            <View style={styles.customerIcon}>
                <Icon name="user" size={20} color="#1788F0" />
            </View>
            <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.customer_name}</Text>
                <Text style={styles.customerId}>ID: {item.customer_id}</Text>
            </View>
            <Icon name="right" size={16} color="#7F8C8D" />
        </TouchableOpacity>
    );

    // const renderEmptyState = () => (
    //     <View style={styles.emptyState}>
    //         <Icon name="search1" size={50} color="#BDC3C7" />
    //         <Text style={styles.emptyStateText}>No customers found</Text>
    //         <Text style={styles.emptyStateSubtext}>
    //             Try searching with different keywords
    //         </Text>
    //     </View>
    // );

    const renderLoadingState = () => (
        <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#1788F0" />
            <Text style={styles.loadingText}>Searching customers...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {showNoCustomerToast && (
                <View style={styles.toastContainer}>
                    <Text style={styles.toastText}>No customer found</Text>
                </View>
            )}
            
            <View style={styles.headerContainer}>
                <HeaderTextLeft title={pageTitle} goBack={goBack} fontSize={20} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSection}>
                    {/* <Icon name="search1" size={32} color="#1788F0" style={styles.headerIcon} /> */}
                    <Text style={styles.title}>Find Your {pageTitle}</Text>
                    <Text style={styles.subtitle}>
                        Type at least 3 characters to search for {pageTitle.toLowerCase()}s
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    {/* <Text style={styles.inputLabel}>Search {pageTitle}</Text> */}
                    <View style={styles.inputContainer}>
                        <Icon name="search1" size={20} color="#7F8C8D" style={styles.searchIcon} />
                        <TextInput
                            placeholder={`Type ${pageTitle.toLowerCase()} name...`}
                            placeholderTextColor="#95A5A6"
                            value={inputVal}
                            onChangeText={(e) => {
                                setInputVal(e);
                                setIsVisible(e.length > 2);
                            }}
                            style={styles.searchInput}
                            autoCapitalize="words"
                        />
                        {inputVal.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setInputVal('');
                                    setIsVisible(false);
                                    setBtnDisabled(true);
                                    setCustomerId('');
                                    setCustomerName('');
                                    setFilteredResults([]);
                                }}
                                style={styles.clearButton}
                            >
                                <Icon name="close" size={18} color="#7F8C8D" />
                            </TouchableOpacity>
                        )}
                    </View>

                        {isVisible && (
                        <View style={styles.resultsContainer}>
                            {isLoading ? (
                            renderLoadingState()
                            ) : (
                            filteredResults &&
                            filteredResults.length > 0 && (
                                <View>
                                {filteredResults.map(item => renderCustomerItem(item))}
                                </View>
                            )
                            )}
                        </View>
                        )}

                </View>

                {/* <View style={styles.selectedCustomer}>
                    {customerName && (
                        <View style={styles.selectedCustomerCard}>
                            <Icon name="checkcircle" size={20} color="#27AE60" />
                            <View style={styles.selectedCustomerInfo}>
                                <Text style={styles.selectedLabel}>Selected {pageTitle}</Text>
                                <Text style={styles.selectedName}>{customerName}</Text>
                            </View>
                        </View>
                    )}
                </View> */}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={btnDisabled}
                    style={[styles.nextButton, btnDisabled && styles.nextButtonDisabled]}
                    onPress={() => {
                        dispatch({ type: "RESET_CART_DATA" });
                        dispatch({ type: "SEARCH_RESET" });
                        navigation.navigate('Products', {
                            vendorId: customerId,
                            customerName: customerName,
                            orgId: orgId
                        });
                    }}
                >
                    <Text style={styles.nextButtonText}>Continue to Products</Text>
                    <Icon name="arrowright" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerIcon: {
        marginBottom: 16,
    },
    title: {
        color: '#2C3E50',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#7F8C8D',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    searchContainer: {
        marginBottom: 30,
    },
    inputLabel: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        paddingHorizontal: 16,
        height: 56,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#2C3E50',
        fontSize: 16,
        height: '100%',
    },
    clearButton: {
        padding: 4,
    },
    resultsContainer: {
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        maxHeight: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'scroll',
    },
    customerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
    },
    customerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    customerId: {
        color: '#7F8C8D',
        fontSize: 14,
    },
    loadingState: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#7F8C8D',
        fontSize: 14,
        marginLeft: 12,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        color: '#7F8C8D',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedCustomer: {
        marginBottom: 20,
    },
    selectedCustomerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BDE0FE',
    },
    selectedCustomerInfo: {
        marginLeft: 12,
    },
    selectedLabel: {
        color: '#7F8C8D',
        fontSize: 14,
        marginBottom: 4,
    },
    selectedName: {
        color: '#1788F0',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
    },
    nextButton: {
        backgroundColor: '#1788F0',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    toastContainer: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        zIndex: 1000,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CustomerLeadSearchScreen;