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
    TouchableWithoutFeedback,
    Image,
    FlatList,
    Modal,
    Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllOrganizationAction } from '../../Redux/Actions/AllOrganizationAction';
import { getCustOutstandingBalance, getCustPendingSalesInvoicesAction } from '../../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { salesQuoteCustomerAction } from '../../Redux/Actions/SalesQuoteAction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const OrganizationSearch = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesQuote);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const soState = useSelector((state) => state.AllSalesOrders);

    const dispatch = useDispatch();
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsvisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [orgId, setOrgId] = useState('');
    const isFocused = useIsFocused();
    const [isLoading, setisLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [showNoCustomerToast, setShowNoCustomerToast] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(globalReducerState?.getGlobalData?.data?.emp_org?.length > 1){
                setModalVisible(true);
            } else {
                const defaultOrg = globalReducerState?.getGlobalData?.data?.emp_org[0];
                setOrgId(defaultOrg?.org_id);
                setSelectedOrg(defaultOrg);
            }
            setIsvisible(false);
            setBtnDisabled(true);
            setInputVal('');
        }, [isFocused])
    );

    useEffect(() => {
        if (soState?.custOutstanding) {
            setisLoading(false);
        }
    }, [soState?.custOutstanding]);

    useEffect(() => {
        if (inputVal.length > 2) {
            dispatch(salesQuoteCustomerAction({ "value": inputVal }));
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [inputVal]);

    // Show toast if no customers found after search
    useEffect(() => {
        if (inputVal.length > 2 && state.sqCustomerSearchResult?.length === 0) {
            setShowNoCustomerToast(true);
            const timer = setTimeout(() => {
                setShowNoCustomerToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowNoCustomerToast(false);
        }
    }, [state.sqCustomerSearchResult, inputVal]);

    const removeLocalStore = async () => {
        try {
            await AsyncStorage.removeItem('customer_id');
        } catch (e) {
            //console.error('Error removing customer_id:', e);
        }
    };

    useEffect(() => {
        if (customerId !== "") {
            dispatch(AllOrganizationAction(customerId));
            dispatch(getCustOutstandingBalance({
                "customerId": customerId,
                "org_id": orgId,
            }));
        }
    }, [customerId, orgId]);

    const setCustomerData = async (item) => {
        setInputVal(item.customer_name);
        setCustomerName(item.customer_name);
        setCustomerId(item.customer_id);
        setIsvisible(false);
        setBtnDisabled(false);
        removeLocalStore();
        try {
            await AsyncStorage.setItem('customer_id', item.customer_id.toString());
        } catch (error) {
            console.error('Error saving customer_id:', error);
        }
        Keyboard.dismiss();
    };

    const goBack = () => navigation.goBack();

    const OutstandingHandlePress = () => {
        const totalUnpaid = soState?.custOutstanding?.total_unpaid ?? 0;
        if (totalUnpaid === 0) return;

        dispatch({ type: "CUST_OUTSTANDING_RESET" });
        setCustomerId('');
        dispatch(getCustPendingSalesInvoicesAction({
            customerId: customerId,
            org_id: orgId,
            page: 1
        }));

        navigation.navigate('CustPendingInvoices', {
            customerId: customerId,
            orgId: orgId,
        });
    };

    const handleOrgSelect = (org) => {
        setSelectedOrg(org);
        setOrgId(org.org_id);
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Loading Overlay */}
            {soState?.custOutstanding?.isLoading && (
                <LogoOverlay/>
            )}
            
            {/* No Customer Found Toast */}
            {showNoCustomerToast && (
                <View style={styles.toastContainer}>
                    <Text style={styles.toastText}>No customer found</Text>
                </View>
            )}
            
            {/* Main Content */}
            <View style={styles.container}>
                <HeaderTextLeft title={"Customer Search"} goBack={goBack} fontSize={20} />
                
                <View style={styles.content}>
                    <Text style={styles.title}>Let's Find Your Customer</Text>
                    
                    {/* Customer Search Input */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search customer by name..."
                            placeholderTextColor="#888"
                            value={inputVal}
                            onChangeText={(text) => {
                                setInputVal(text);
                                setIsvisible(text.length > 2);
                            }}
                            style={styles.searchInput}
                        />

                        {/* Search Results Dropdown */}
                        {isVisible && state.sqCustomerSearchResult?.length > 0 && (
                            <View style={styles.resultsContainer}>
                                <FlatList
                                    data={state.sqCustomerSearchResult}
                                    keyExtractor={(item) => item.customer_id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableWithoutFeedback onPress={() => setCustomerData(item)}>
                                            <View style={styles.resultItem}>
                                                <Text style={styles.resultText}>{item.customer_name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                    style={styles.resultsList}
                                    keyboardShouldPersistTaps="always"
                                />
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    {customerId && (
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.newOrderButton]}
                                onPress={() => {
                                    dispatch({ type: "CUST_OUTSTANDING_RESET" });
                                    navigation.navigate('SearchProducts', {
                                        vendorId: customerId,
                                        customerName: customerName,
                                        orgId: orgId
                                    });
                                    setCustomerId('');
                                }}
                            >
                                <Text style={styles.buttonText}>New Sales Order</Text>
                                <AntDesign name="pluscircleo" size={20} color="white" style={styles.buttonIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.actionButton, styles.outstandingButton]}
                                onPress={OutstandingHandlePress}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <View style={styles.outstandingContainer}>
                                        <Text style={styles.outstandingAmount}>
                                            {soState.custOutstanding.currency_code}{" "}
                                            {parseFloat(soState.custOutstanding.total_unpaid ?? 0).toFixed(2)}
                                        </Text>
                                        <Text 
                                            style={[
                                                styles.outstandingLabel,
                                                width < 400 ? styles.smallScreenLabel : styles.largeScreenLabel
                                            ]}
                                            numberOfLines={2}
                                            adjustsFontSizeToFit
                                        >
                                            Outstanding Balance
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Organization Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Organization</Text>
                        
                        {/* Picker Component */}
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedOrg?.org_id}
                                onValueChange={(itemValue, itemIndex) => {
                                    const selected = globalReducerState?.getGlobalData?.data?.emp_org.find(
                                        org => org.org_id === itemValue
                                    );
                                    handleOrgSelect(selected);
                                }}
                                style={styles.picker}
                                dropdownIconColor="#1788F0"
                            >
                                {globalReducerState?.getGlobalData?.data?.emp_org?.map((org) => (
                                    <Picker.Item 
                                        key={org.org_id} 
                                        label={org.org_name} 
                                        value={org.org_id} 
                                    />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                        <Text style={styles.modalButtonText}>Confirm Selection</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

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
    content: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 30,
        textAlign: 'left', // Changed to left as requested
    },
    searchContainer: {
        marginBottom: 20,
        zIndex: 1000,
    },
    searchInput: {
        backgroundColor: "#FFF",
        fontSize: 16,
        color: "#333",
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultsContainer: {
        marginTop: 8,
        backgroundColor: "#FFF",
        maxHeight: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    resultText: {
        fontSize: 16,
        color: '#333',
    },
    resultsList: {
        flexGrow: 0,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    actionButton: {
        width: '48%',
        height: 140,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    newOrderButton: {
        backgroundColor: '#1788F0',
    },
    outstandingButton: {
        backgroundColor: '#2ECC71',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    buttonIcon: {
        marginTop: 8,
    },
    outstandingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    outstandingAmount: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    outstandingLabel: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    smallScreenLabel: {
        fontSize: 12,
        lineHeight: 16,
    },
    largeScreenLabel: {
        fontSize: 14,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    loadingContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingLogo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 24,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 50,
    },
    modalButton: {
        backgroundColor: '#1788F0',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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

export default OrganizationSearch;