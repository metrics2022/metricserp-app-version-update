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
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { useDispatch, useSelector } from 'react-redux';
import { SalesOrderSubmitAction } from '../../Redux/Actions/SalesOrderSubmit';

const { width } = Dimensions.get('window');

const SalesOrderRemarksScreen = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const SalesOrderCartState = useSelector(state => state.SalesOrderCartReducer);
    const salesOrderSubmitState = useSelector(state => state.SalesOrderSubmitReducers);
    const dispatch = useDispatch();
    const [lines, setLines] = useState();
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [empId, setEmpId] = useState('');
    const [remarksText, setRemarksText] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [customerSiteId, setCustomerSiteId] = useState(null);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => setEmpId(e.emp_data.emp_id));

        const getCustomerSiteId = async () => {
            try {
                const id = await AsyncStorage.getItem('customer_site_id');
                if (id !== null) {
                    setCustomerSiteId(JSON.parse(id));
                }
            } catch (error) {
                console.error('Error retrieving customer_site_id from AsyncStorage:', error);
            }
        };

        getCustomerSiteId();

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
        const lines = SalesOrderCartState.cartItems.map(item => {
            return { item_id: item.productId, order_qty: item.product_qty, line_subtotal: item.totalPrice, uom: item.uom, unit_price: item.price, so_line_description: item.itemLineDesc };
        });
        setLines(lines);
    }, [SalesOrderCartState]);

    useEffect(() => {
        if (salesOrderSubmitState.salesOrderData.status === "Success") {
            dispatch({ type: "RESET_CART_DATA" });
            setIsSectionShow(false);
        }
    }, [salesOrderSubmitState]);

    const handleSubmit = () => {
        dispatch(SalesOrderSubmitAction({
            Lines: lines,
            billToId: route.params.billToId,
            shipToId: customerSiteId,
            so_amount: Number(SalesOrderCartState.totalAmout.totalAmout).toFixed(2),
            customer_id: customerId,
            org_id: route.params?.orgId,
            emp_id: empId,
            currency_id: route?.params?.currencyId,
            remarks: remarksText
        }));
    }

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {isSectionShow && (
                <View style={styles.headerContainer}>
                    <HeaderTextLeft title="Order Description" goBack={goBack} fontSize={20} />
                </View>
            )}

            {salesOrderSubmitState.isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1788F0" />
                        <Text style={styles.loadingText}>Creating Order...</Text>
                    </View>
                </View>
            )}
            
            {isSectionShow ? (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Got specific details? Enter them here!</Text>
                        <TextInput
                            placeholder="Type your order notes here..."
                            placeholderTextColor="#95A5A6"
                            editable
                            multiline
                            numberOfLines={5}
                            textAlignVertical='top'
                            style={styles.remarksInput}
                            value={remarksText}
                            onChangeText={(e) => setRemarksText(e)}
                        />
                        <Text style={styles.inputHint}>Optional: Add any special instructions or notes for this order</Text>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.successContainer}>
                    <View style={styles.successContent}>
                        <View style={styles.successIcon}>
                            <Image
                                source={require('../../assets/shopping-bag.png')}
                                resizeMode="cover"
                                style={{ width: 99, height: 115, color: '#1788F0' }}
                            />
                        </View>
                        <Text style={styles.successTitle}>Sales Order Created</Text>
                        <Text style={styles.orderNumber}>
                            #{salesOrderSubmitState.salesOrderData.data}
                        </Text>
                        <Text style={styles.successMessage}>
                            Your order has been successfully submitted and is being processed.
                        </Text>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => {
                                dispatch({ type: "SEARCH_LIST_RESET" });
                                navigation.navigate('Organization');
                                navigation.popToTop();
                                dispatch({ type: "SALES_ORDER_SUBMIT_RESET" });
                            }}
                        >
                            <Icon name="home" size={20} color="#FFF" style={styles.homeIcon} />
                            <Text style={styles.homeButtonText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {isSectionShow && SalesOrderCartState.cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>
                            {route.params.currency} {Number(SalesOrderCartState.totalAmout.totalAmout).toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                    >
                        
                        <Text style={styles.submitButtonText}>Submit Order</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        color: '#2C3E50',
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 30,
        marginTop: 20,
    },
    inputLabel: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        
    },
    remarksInput: {
        backgroundColor: '#F8F9FA',
        fontSize: 16,
        color: '#2C3E50',
        padding: 16,
        height: 150,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    inputHint: {
        color: '#95A5A6',
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 20,
    },
    successContent: {
        alignItems: 'center',
        width: '100%',
    },
    successIcon: {
        marginBottom: 25,
    },
    successTitle: {
        color: '#2C3E50',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    orderNumber: {
        color: '#1788F0',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
    },
    successMessage: {
        color: '#7F8C8D',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    homeIcon: {
        marginRight: 10,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
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
        fontWeight: '600',
    },
    totalAmount: {
        color: '#1788F0',
        fontSize: 20,
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: '#27AE60',
        borderRadius: 25,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitIcon: {
        marginRight: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SalesOrderRemarksScreen;