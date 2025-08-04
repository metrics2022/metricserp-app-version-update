import React, { useState, useEffect } from 'react'
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
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../Component/HeaderTextLeft';

import { useDispatch, useSelector } from 'react-redux';
import { SalesOrderSubmitAction } from '../Redux/Actions/SalesOrderSubmit';

const SalesOrderRemarksScreen = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const SalesOrderCartState = useSelector(state => state.SalesOrderCartReducer);
    const salesOrderSubmitState = useSelector(state => state.SalesOrderSubmitReducers);
    const dispatch = useDispatch();
    const [lines, setLines] = useState();
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [empId, setEmpId] = useState('');
    const [remarksText, setRemarksText] = useState('');
    const [orderNumber,setOrderNumber] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [customerSiteId, setCustomerSiteId] = useState(null);
    // console.log('Remarks Page', route.params);
    //console.log('Cart Reducers', salesOrderSubmitState);

    //console.log('sales-order', state);

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
            //console.log('asdasd',item);
            return { item_id: item.productId, order_qty: item.product_qty, line_subtotal: item.totalPrice, uom: item.uom, unit_price: item.price, so_line_description: item.itemLineDesc};
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
         //console.log('lines',lines);
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

    // console.log("salesOrderSubmitState.salesOrderData.data", salesOrderSubmitState.salesOrderData.data)


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                salesOrderSubmitState.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.4)" }}>
                        <View style={{
                            backgroundColor: "#FFF", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5, shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 4.65,
                            elevation: 6,
                        }}>
                            <ActivityIndicator size="large" color="#1788F0" />
                        </View>
                    </View>
                )
            }
            <ScrollView style={styles.mainWrapper}>
                {
                    isSectionShow && (
                        <>
                            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: "absolute", top: -10, left: -12, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                                <AntDesign name='arrowleft' size={24} color="#000" />
                            </TouchableOpacity>
                            <View style={{ position: "relative" }}>
                                <Text style={styles.Heading}>Order Description</Text>
                            </View>
                            <View style={styles.line}></View>
                            <Text style={[styles.Heading, { textAlign: 'left', fontSize: 18, marginBottom: 10 }]}>Got specific details? enter them here!</Text>
                        </>

                    )
                }
                {
                    isSectionShow ? (
                        <View>
                            <TextInput placeholder="Type here"
                                editable
                                multiline
                                numberOfLines={3}
                                textAlignVertical='top'
                                placeholderTextColor="#a1a1a1"
                                style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 150, borderRadius: 10 }}
                                value={remarksText}
                                onChangeText={(e) => setRemarksText(e)}
                            />
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 150 }}>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700",marginLeft: 10 }}>Sales Order Created
                                 <Text style={{ color: "#1788F0" }}>#{salesOrderSubmitState.salesOrderData.data}</Text>
                                </Text>
                            <TouchableOpacity style={styles.btnSubmit} onPress={() => { dispatch({ type: "SEARCH_LIST_RESET" }); navigation.navigate('Organization'), navigation.popToTop(), dispatch({ type: "SALES_ORDER_SUBMIT_RESET" });}}>
                                <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Home</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }


            </ScrollView>

            {
                SalesOrderCartState.cartItems.length > 0 && (
                    <View style={styles.checkOutBtn}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                            <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(SalesOrderCartState.totalAmout.totalAmout).toFixed(2)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.btnCheckout} onPress={handleSubmit}>
                                <Text style={{ color: "#FFF", fontSize: 16 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </SafeAreaView>
    )
}

export default SalesOrderRemarksScreen;

var styles = StyleSheet.create({
    mainWrapper: {
        paddingHorizontal: 30,
        paddingVertical: 40,
        backgroundColor: '#FFF',
    },
    Heading: {
        fontSize: 26,
        fontWeight: "500",
        color: "#252525",
        textAlign: "center"
    },
    RadioButtonRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    singleRadioBtn: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        position: "relative",
        paddingLeft: 20
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aeaeae',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        position: "absolute",
        left: 0,
        top: 3
    },
    checkedCircle: {
        width: 8,
        height: 8,
        borderRadius: 7,
        backgroundColor: '#1788F0',
    },
    btnSubmit: {
        width: 90,
        height: 42,
        alignItems: "center",
        backgroundColor: "#1788F0",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems:'center',
        marginTop: 30,
        padding: 5
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: "500",
        textTransform: "uppercase"
    },
    checkOutBtn: {
        backgroundColor: "rgba(255,255,255,0.6)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopColor: "#dfdfdf",
        borderTopWidth: 1,
        borderStyle: "solid"
    },
    btnCheckout: {
        backgroundColor: "#1788F0",
        borderRadius: 35,
        paddingVertical: 10,
        paddingHorizontal: 25
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 10,
        marginBottom: 25,
        marginLeft: 50
    },
    centeredView: {
        width: "100%",
        height: "100%",
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        width: "85%",
        margin: 0,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});