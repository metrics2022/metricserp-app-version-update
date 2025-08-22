import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Alert,
    FlatList,
    Animated
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { useDispatch, useSelector } from 'react-redux';
import { customerInfoAction, getDefaultSQTermsTemplateAction } from '../../Redux/Actions/SalesQuoteAction';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/AntDesign';
import LogoOverlay from '../../Component/LoaderComponent';

const Contact = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const state = useSelector((state) => state.AllSalesQuote);
    const [customerContactId, setCustomerContactId] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpacity] = useState(new Animated.Value(0));

    const dispatch = useDispatch();

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        
        Animated.sequence([
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowToast(false);
        });
    };

    useEffect(() => {
        const getCustomerId = async () => {
            try {
                const id = await AsyncStorage.getItem('customer_id');
                if (id !== null) {
                    setCustomerId(parseInt(id, 10));
                }
            } catch (error) {
                console.error('Error retrieving customer_id from AsyncStorage:', error);
            }
        };

        getCustomerId();
    }, []);

    useEffect(() => {
        if (customerId != null) {
            dispatch(customerInfoAction({
                "value": customerId
            }));
        }
    }, [dispatch, customerId]);

    const storeCustomerContactId = async (id) => {
        try {
            await AsyncStorage.setItem('customer_contact_id', JSON.stringify(id));
        } catch (error) {
            console.error('Error saving customer_contact_id to AsyncStorage:', error);
        }
    };

    useEffect(() => {
        if (state?.sqCustomerSearchResult?.contactData?.length > 0) {
            const isPrimaryAddess = state?.sqCustomerSearchResult?.contactData?.find((item) => item.customer_contact_primary == 1);
            setCustomerContactId(isPrimaryAddess?.customer_contact_id);
            storeCustomerContactId(isPrimaryAddess?.customer_contact_id);
            setCustomerEmail(isPrimaryAddess?.contact_email);
        }
    }, [state?.sqCustomerSearchResult?.contactData]);

    const handleContactSelection = (id, email) => {
        setCustomerContactId(id);
        storeCustomerContactId(id);
        setCustomerEmail(email);
        showToastMessage('Contact selected successfully!');
    };

    const goBack = () => {
        navigation.goBack();
    }

    const handleNext = async () => {
        if (!customerContactId) {
            showToastMessage('Please select a contact to continue');
            return;
        }
        
        const res = await dispatch(getDefaultSQTermsTemplateAction());
        if (res?.status == "Success") {
            navigation.navigate('QuoteDescription', {
                contactId: customerContactId,
                currency: route.params.currency,
                currencyId: route.params.currencyId,
                orgId: route.params?.orgId,
                customerEmail: customerEmail
            });
        }
    }

    const renderContactItem = ({ item, index }) => {
        return (
            <TouchableOpacity 
                onPress={() => handleContactSelection(item.customer_contact_id, item?.contact_email)} 
                style={[
                    styles.contactCard,
                    customerContactId == item.customer_contact_id && styles.selectedContactCard
                ]}
            >
                {item.customer_contact_primary == 1 && (
                    <View style={styles.primaryBadge}>
                       <Icon size={20} name="star" color="#1788F0" style={styles.bookmarkIcon} />
                        {/* <Text style={styles.primaryBadgeText}>Primary</Text> */}
                    </View>
                )}
                
                <View style={styles.radioContainer}>
                    <View style={styles.circle}>
                        {customerContactId == item.customer_contact_id && (<View style={styles.checkedCircle} />)}
                    </View>
                </View>

                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                        {item.contact_fname} {item.contact_lname}
                    </Text>
                    
                    <View style={styles.contactDetail}>
                        <Icon name="mail" size={16} color="#7F8C8D" style={styles.contactIcon} />
                        <Text style={styles.contactText}>{item.contact_email}</Text>
                    </View>
                    
                    <View style={styles.contactDetail}>
                        <Icon name="phone" size={16} color="#7F8C8D" style={styles.contactIcon} />
                        <Text style={styles.contactText}>{item.contact_phone || 'No phone number'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {state?.isLoading && <LogoOverlay />}
            
            {/* Toast Notification */}
            {showToast && (
                <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
            
            <View style={styles.container}>
                <HeaderTextLeft 
                    title={"Select Contact"} 
                    subTitle={"Select a contact for this quotation"}
                    goBack={goBack} 
                    fontSize={20} 
                />
                
                
                {state?.sqCustomerSearchResult?.contactData?.length > 0 ? (
                    <FlatList
                        data={state.sqCustomerSearchResult.contactData}
                        renderItem={renderContactItem}
                        keyExtractor={(item, index) => `${item.customer_contact_id}-${index}`}
                        contentContainerStyle={styles.contactsList}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    !state?.isLoading && (
                        <View style={styles.emptyState}>
                            <Icon name="user" size={50} color="#BDC3C7" />
                            <Text style={styles.emptyStateText}>No Contacts Found</Text>
                            <Text style={styles.emptyStateSubText}>
                                There are no contacts available for this customer
                            </Text>
                        </View>
                    )
                )}
            </View>
            
            {cartState.cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total (ex. tax)</Text>
                            <Text style={styles.totalAmount}>
                                {route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[
                                styles.nextButton,
                                !customerContactId && styles.nextButtonDisabled
                            ]} 
                            onPress={handleNext}
                            disabled={!customerContactId}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Icon name="arrowright" size={18} color="#FFF" style={styles.nextButtonIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

export default Contact;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerInfo: {
        marginTop: 10,
        marginBottom: 15,
    },
    headerInfoText: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
    },
    contactsList: {
        paddingBottom: 20,
    },
    contactCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedContactCard: {
        borderColor: '#1788F0',
        shadowColor: '#1788F0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryBadge: {
        position: 'absolute',
        top: 4,
        right: 12,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    primaryBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 4,
    },
    radioContainer: {
        marginRight: 12,
        paddingTop: 2,
    },
    circle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#BDC3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#1788F0',
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    contactDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    contactIcon: {
        marginRight: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#7F8C8D',
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#95A5A6',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#BDC3C7',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    footer: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1788F0',
    },
    nextButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 100,
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#BDC3C7',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    nextButtonIcon: {
        marginLeft: 8,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(39, 174, 96, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        zIndex: 1000,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});