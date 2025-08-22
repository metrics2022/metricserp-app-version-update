import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { useDispatch, useSelector } from 'react-redux';
import { customerInfoAction } from '../../Redux/Actions/SalesQuoteAction';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const BillingShippingAddress = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const SalesOrderCartState = useSelector(state => state.SalesOrderCartReducer);
    const state = useSelector((state) => state.AllSalesQuote);
    const dispatch = useDispatch();

    const { module, currency, currencyId, orgId } = route.params; // Destructure module from route.params

    const [shippingAddressId, setShippingAddressId] = useState('');
    const [billingAddressId, setBillingAddressId] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [menuAccess, setMenuAccess] = useState('');
    const [activeTab, setActiveTab] = useState('shipping'); // 'shipping' or 'billing'

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
            dispatch(customerInfoAction({ "value": customerId }));
        }
    }, [dispatch, customerId]);

    useEffect(() => {
        if (state?.sqCustomerSearchResult?.shipData?.length > 0) {
            const primaryShipping = state?.sqCustomerSearchResult?.shipData?.find((item) => item.customer_site_primary == 1);
            setShippingAddressId(primaryShipping?.customer_site_id || '');
        }
        
        if (module === 'salesOrder' && state?.sqCustomerSearchResult?.billData?.length > 0) {
            const primaryBilling = state?.sqCustomerSearchResult?.billData?.find((item) => item.customer_site_primary == 1);
            setBillingAddressId(primaryBilling?.customer_site_id || '');
        }
    }, [state?.sqCustomerSearchResult, module]);

    const getmoduleData = async () => {
        try {
            const jsonValue1 = await AsyncStorage.getItem('moduleData');
            return jsonValue1 != null ? JSON.parse(jsonValue1) : null;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getmoduleData().then((e) => { setMenuAccess(e) });
    }, []);

    const handleShippingSelection = (id) => {
        setShippingAddressId(id);
    };

    const handleBillingSelection = (id) => {
        setBillingAddressId(id);
    };

    const handleSameAsShipping = () => {
        if (shippingAddressId) {
            setBillingAddressId(shippingAddressId);
        }
    };

    // Make billing address optional for salesQuote
    const isSubmitDisabled = module === 'salesQuote' ? !shippingAddressId : !shippingAddressId || !billingAddressId;

    const goBack = () => {
        navigation.goBack();
    };

    const handleSubmit = () => {
        if (menuAccess?.menu_name === "Sales Order") {
            navigation.navigate('SalesOrderRemarks', {
                billToId: billingAddressId,
                shipToId: shippingAddressId,
                currency,
                currencyId,
                orgId
            });
        } else if (menuAccess?.menu_name === "QUOTE") {
            navigation.navigate('Contact', {
                billToId: billingAddressId || null, // Pass null if billing address is not set
                shipToId: shippingAddressId,
                currency,
                currencyId,
                orgId
            });
        }
    };

    const renderAddressCard = (address, type, isSelected, onSelect) => (
        <TouchableOpacity 
            onPress={() => onSelect(address.customer_site_id)} 
            style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
        >
            {address.customer_site_primary == 1 && (
                <Icon 
                    size={20} 
                    name="star" 
                    color="#1788F0" 
                    style={styles.bookmarkIcon} 
                />
            )}
            
            <View style={styles.radioContainer}>
                <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioChecked} />}
                </View>
            </View>

            <View style={styles.addressContent}>
                <Text style={styles.cityText}>{address.customer_site_city}</Text>
                <Text style={styles.addressText}>
                    {address.customer_site_addr1}, {address.customer_site_postcode}
                </Text>
                <Text style={styles.phoneText}>
                    Phone: {address.customer_site_mobno}
                </Text>
            </View>

            {isSelected && (
                <MaterialIcons name="check-circle" size={24} color="#27AE60" style={styles.checkIcon} />
            )}
        </TouchableOpacity>
    );

    const renderTabContent = () => {
        const addresses = activeTab === 'shipping' 
            ? state?.sqCustomerSearchResult?.shipData 
            : state?.sqCustomerSearchResult?.billData;
        
        const selectedId = activeTab === 'shipping' ? shippingAddressId : billingAddressId;
        const onSelect = activeTab === 'shipping' ? handleShippingSelection : handleBillingSelection;

        if (!addresses || addresses.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Icon name="enviromento" size={60} color="#E0E6ED" />
                    <Text style={styles.emptyStateText}>No addresses found</Text>
                </View>
            );
        }

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {addresses.map((address, index) => (
                    <View key={index} style={styles.addressItem}>
                        {renderAddressCard(address, activeTab, selectedId === address.customer_site_id, onSelect)}
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {state?.isLoading && (
                <LogoOverlay />
            )}

            <View style={styles.header}>
                <HeaderTextLeft 
                    title="Select Addresses"
                    subTitle={module === 'salesQuote' ? "Choose your shipping address" : "Choose your shipping and billing addresses"}
                    goBack={goBack} 
                    fontSize={20} 
                />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'shipping' && styles.activeTab]}
                    onPress={() => setActiveTab('shipping')}
                >
                    <View style={styles.tabContent}>
                        <Icon 
                            name="car" 
                            size={18} 
                            color={activeTab === 'shipping' ? '#1788F0' : '#7F8C8D'} 
                            style={styles.tabIcon}
                        />
                        <Text style={[styles.tabText, activeTab === 'shipping' && styles.activeTabText]}>
                            Shipping Address
                        </Text>
                    </View>
                    
                    {shippingAddressId && (
                        <View style={styles.selectionBadge}>
                            <Icon name="check" size={14} color="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
                
                {module === 'salesOrder' && (
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'billing' && styles.activeTab]}
                        onPress={() => setActiveTab('billing')}
                    >
                        <View style={styles.tabContent}>
                            <Icon 
                                name="creditcard" 
                                size={18} 
                                color={activeTab === 'billing' ? '#1788F0' : '#7F8C8D'} 
                                style={styles.tabIcon}
                            />
                            <Text style={[styles.tabText, activeTab === 'billing' && styles.activeTabText]}>
                                Billing Address
                            </Text>
                        </View>
                        
                        {billingAddressId && (
                            <View style={styles.selectionBadge}>
                                <Icon name="check" size={14} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {renderTabContent()}
            </View>

            {activeTab === 'billing' && module === 'salesOrder' && shippingAddressId && billingAddressId !== shippingAddressId && (
                <TouchableOpacity style={styles.sameAsShippingButton} onPress={handleSameAsShipping}>
                    <Text style={styles.sameAsShippingText}>Use same as shipping address</Text>
                </TouchableOpacity>
            )}

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total (ex. tax)</Text>
                    <Text style={styles.totalAmount}>
                        {currency} {Number(
                            menuAccess?.menu_name === "Sales Order" 
                                ? SalesOrderCartState.totalAmout.totalAmout 
                                : cartState.totalAmout.totalAmout
                        ).toFixed(2)}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                >
                    <Text style={styles.submitButtonText}>
                        {menuAccess?.menu_name === "Sales Order" ? "Continue to Remarks" : "Continue to Contact"}
                    </Text>
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
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E6ED',
        backgroundColor: '#F8F9FA',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#1788F0',
        backgroundColor: '#FFFFFF',
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tabIcon: {
        marginLeft: 8,
    },
    tabText: {
        color: '#7F8C8D',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5
    },
    activeTabText: {
        color: '#1788F0',
        fontWeight: '700',
    },
    selectionBadge: {
        width: 18,
        height: 18,
        borderRadius: 10,
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    addressItem: {
        marginBottom: 15,
    },
    addressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
    },
    selectedAddressCard: {
        borderColor: '#1788F0',
        backgroundColor: '#F0F8FF',
        shadowColor: '#1788F0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    radioContainer: {
        marginRight: 15,
        paddingTop: 2,
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioChecked: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#1788F0',
    },
    addressContent: {
        flex: 1,
    },
    cityText: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },
    addressText: {
        color: '#7F8C8D',
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    phoneText: {
        color: '#7F8C8D',
        fontSize: 14,
    },
    bookmarkIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    checkIcon: {
        position: 'absolute',
        right: 15,
        bottom: 15,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        color: '#95A5A6',
        fontSize: 16,
        marginTop: 10,
    },
    sameAsShippingButton: {
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 12,
        backgroundColor: '#E8F5FF',
        borderRadius: 8,
        alignItems: 'center',
    },
    sameAsShippingText: {
        color: '#1788F0',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        color: '#7F8C8D',
        fontSize: 16,
    },
    totalAmount: {
        color: '#1788F0',
        fontSize: 20,
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BillingShippingAddress;