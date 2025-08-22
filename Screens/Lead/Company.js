import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator,
    Animated,
    Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SearchLeadCompanyAction } from '../../Redux/Actions/LeadSubmitAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';
import Icon from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LeadCompany = ({ navigation, route }) => {
    const SearchLeadState = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch()
    const [inputVal, setInputVal] = useState('');
    const [companyId, setCompanyId] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isVisible, setIsvisible] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpacity] = useState(new Animated.Value(0));

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

    // search Company
    useEffect(() => {
        if (inputVal.length > 2) {
            dispatch(SearchLeadCompanyAction(inputVal));
            setBtnDisabled(false);
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [inputVal]);

    const goBack = () => {
        navigation.goBack()
    }
    
    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };
    
    useEffect(() => {
        if (SearchLeadState?.errorMessage?.data == '2') {
            AlertComponent({
                title: SearchLeadState?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },
                ]
            });
        }
    }, [SearchLeadState?.errorMessage])

    const handleInputChange = (val) => {
        if (val == "") {
            setCompanyId("");
            dispatch({ type: "LEAD_DETAILS_RESET" });
        }
    }

    const handleCompanySelect = (company) => {
        Keyboard.dismiss();
        setInputVal(company?.company_name || '');
        setIsvisible(false);
        setCompanyId(company?.company_id || '');
        setBtnDisabled(false);
        showToastMessage('Company selected');
    }

    const handleNext = () => {
        if (!companyId && inputVal.length < 3) {
            showToastMessage('Please select or enter a valid company name');
            return;
        }
        
        console.log("companyId", companyId);
        console.log("inputVal", inputVal);
        navigation.navigate('Contact', {
            companyId: companyId || '',
            companyName: inputVal,
            phone_number: route?.params?.phone_number || '',
            email_address: route?.params?.email_address || ''
        });
    }

    const renderCompanyItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => handleCompanySelect(item)}>
            <View style={styles.companyItem}>
                <Icon name="building" size={18} color="#7F8C8D" style={styles.companyIcon} />
                <Text style={styles.companyName} numberOfLines={1}>
                    {item?.company_name || 'Unnamed Company'}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Toast Notification */}
            {showToast && (
                <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
            
            <View style={styles.container}>
                <HeaderTextLeft 
                    title={"Lead Company"} 
                    goBack={goBack} 
                    fontSize={20} 
                />
                
                <View style={styles.headerInfo}>
                    <Text style={styles.headerInfoText}>
                        Search for an existing company or enter a new one
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Icon name="search1" size={20} color="#7F8C8D" style={styles.searchIcon} />
                        <TextInput 
                            placeholder="Start typing company name..." 
                            placeholderTextColor="#95A5A6" 
                            value={inputVal} 
                            onChangeText={(e) => {
                                setInputVal(e);
                                setIsvisible(e.length > 2);
                                handleInputChange(e);
                            }} 
                            style={styles.searchInput}
                        />
                        {inputVal.length > 0 && (
                            <TouchableOpacity 
                                onPress={() => {
                                    setInputVal('');
                                    setIsvisible(false);
                                    setCompanyId('');
                                    setBtnDisabled(true);
                                }}
                                style={styles.clearButton}
                            >
                                <Icon name="closecircle" size={20} color="#E74C3C" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {SearchLeadState?.isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#1788F0" />
                            <Text style={styles.loadingText}>Searching companies...</Text>
                        </View>
                    )}

                    {isVisible && SearchLeadState?.leadList && SearchLeadState.leadList.length > 0 && (
                        <View style={styles.resultsContainer}>
                            <View style={styles.resultsHeader}>
                                <Text style={styles.resultsTitle}>
                                    Matching Companies ({SearchLeadState.leadList.length})
                                </Text>
                            </View>
                            <FlatList
                                data={SearchLeadState.leadList}
                                keyExtractor={(item) => item?.company_id?.toString() || Math.random().toString()}
                                renderItem={renderCompanyItem}
                                style={styles.resultsList}
                                keyboardShouldPersistTaps="always"
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            />
                        </View>
                    )}

                    {isVisible && SearchLeadState?.leadList && SearchLeadState.leadList.length === 0 && !SearchLeadState.isLoading && (
                        <View style={styles.noResultsContainer}>
                            <Icon name="infocirlceo" size={24} color="#95A5A6" />
                            <Text style={styles.noResultsText}>
                                No companies found. Continue typing to create a new company.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.nextButtonContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.nextButton,
                            btnDisabled && styles.nextButtonDisabled
                        ]} 
                        onPress={handleNext}
                        disabled={btnDisabled}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Icon name="arrowright" size={18} color="#FFF" style={styles.nextButtonIcon} />
                    </TouchableOpacity>
                    
                    {!btnDisabled && !companyId && (
                        <Text style={styles.newCompanyHint}>
                            This will create a new company: "{inputVal}"
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

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
        marginBottom: 20,
    },
    headerInfoText: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 20,
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
        paddingVertical: 12,
        paddingRight: 8,
    },
    clearButton: {
        padding: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F0F4F8',
        borderRadius: 8,
        marginBottom: 8,
    },
    loadingText: {
        fontSize: 14,
        color: '#7F8C8D',
        marginLeft: 8,
    },
    resultsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        maxHeight: 200,
        marginBottom: 8,
    },
    resultsHeader: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
    },
    resultsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
    },
    resultsList: {
        maxHeight: 150,
    },
    companyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
    },
    companyIcon: {
        marginRight: 12,
    },
    companyName: {
        fontSize: 15,
        color: '#2C3E50',
        flex: 1,
    },
    noResultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    noResultsText: {
        fontSize: 14,
        color: '#7F8C8D',
        marginLeft: 8,
        flex: 1,
    },
    nextButtonContainer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    nextButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 120,
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#BDC3C7',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    nextButtonIcon: {
        marginLeft: 8,
    },
    newCompanyHint: {
        fontSize: 12,
        color: '#7F8C8D',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
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

export default LeadCompany;