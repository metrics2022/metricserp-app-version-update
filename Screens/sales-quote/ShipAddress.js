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
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import { useDispatch, useSelector } from 'react-redux';
import { customerInfoAction } from '../../Redux/Actions/SalesQuoteAction';

const ShipAddress = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const SalesOrderCartState = useSelector(state => state.SalesOrderCartReducer);
    const addressState = useSelector(state => state.AddressReducer);
    const state = useSelector((state) => state.AllSalesQuote)

    // console.log('addressscreen', state?.sqCustomerSearchResult?.shipData);
    const [customerSiteId, setCustomerSiteId] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [menuAccess, setMenuAccess] = useState('');


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


    const dispatch = useDispatch();

    useEffect(() => {
        if (customerId != null &&
            dispatch(customerInfoAction({
                "value": customerId
            })));
    }, [dispatch, customerId]);


    const storeCustomerSiteId = async (id) => {
        try {
            await AsyncStorage.setItem('customer_site_id', JSON.stringify(id));
        } catch (error) {
            console.error('Error saving customer_site_id to AsyncStorage:', error);
        }
    };


    useEffect(() => {
        if (state?.sqCustomerSearchResult?.shipData?.length > 0) {
            const isPrimaryAddess = state?.sqCustomerSearchResult?.shipData?.find((item) => item.customer_site_primary == 1);
            setCustomerSiteId(isPrimaryAddess?.customer_site_id || '');
            storeCustomerSiteId(isPrimaryAddess?.customer_site_id || '');
        }
    }, [state?.sqCustomerSearchResult?.shipData]);

    const getmoduleData = async () => {
        try {
            //const value = await AsyncStorage.getItem('moduleData')
            const jsonValue1 = await AsyncStorage.getItem('moduleData')
            return jsonValue1 != null ? JSON.parse(jsonValue1) : null


        } catch (err) {
            // console.log(err)
        }

    }
    useEffect(() => {
        getmoduleData().then((e) => { setMenuAccess(e) });
    }, []);



    const handleAddressSelection = (id, sitePrimary) => {
        setCustomerSiteId(id);
        storeCustomerSiteId(id);

    };


    const goBack = () => {
        navigation.goBack()
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                state?.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
                        <View style={{
                            paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5
                        }}>
                            <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                        </View>
                    </View>
                )
            }
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Shipping Address"} goBack={goBack} fontSize={25} />
                <ScrollView >
                    {
                        state?.sqCustomerSearchResult?.shipData?.length > 0 ? (
                            state?.sqCustomerSearchResult?.shipData?.map((elem, index, arr) => {
                                return (
                                    <View key={index} style={{ paddingHorizontal: 10 }}>
                                        <TouchableOpacity key={index} onPress={() => handleAddressSelection(elem.customer_site_id, elem.customer_site_primary)} style={[styles.singleRadioBtn, customerSiteId == elem.customer_site_id && {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.22,
                                            shadowRadius: 2.22,
                                            elevation: 3,
                                            backgroundColor: '#f7f7f7'
                                        }]}>
                                            {elem.customer_site_primary == 1 && <Fontisto size={20} name='bookmark-alt' color="#1788F0" style={{ position: 'absolute', right: 15, top: 0 }} />}
                                            <View style={styles.circle}>
                                                {customerSiteId == elem.customer_site_id && (<View style={styles.checkedCircle} />)}
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ marginLeft: 15 }}>
                                                </Text>
                                                <Text style={{ color: "#1f1f1f", fontWeight: "700", fontSize: 16, width: "100%", marginBottom: 3, marginLeft: 8 }}>{elem.customer_site_city} </Text>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ marginLeft: 15 }}>
                                                </Text>
                                                <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom: 3, marginLeft: 8, paddingRight: 28 }}>{elem.customer_site_addr1} , {elem.customer_site_postcode}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ marginLeft: 15 }}>
                                                </Text>
                                                <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom: 3, marginLeft: 8 }}>Phone Number: {elem.customer_site_mobno}</Text>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        ) : (
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 13 }}>No Result Found</Text>
                            </View>
                        )

                    }

                </ScrollView>
            </View>
            {
                menuAccess?.menu_name == "Sales Order" ? (

                    SalesOrderCartState.cartItems.length > 0 && (
                        <View style={styles.checkOutBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                                <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(SalesOrderCartState.totalAmout.totalAmout).toFixed(2)}</Text>
                            </View>
                            <View>
                                {
                                    customerSiteId !== "" && <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('Address', {
                                        billToId: customerSiteId,
                                        currency: route.params.currency,
                                        currencyId: route.params.currencyId,
                                        orgId: route.params?.orgId
                                    })}>
                                        <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                    )
                ) : menuAccess?.menu_name == "QUOTE" && (
                    cartState.cartItems.length > 0 && (
                        <View style={styles.checkOutBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                                <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('Address', {
                                    billToId: customerSiteId,
                                    currency: route.params.currency,
                                    currencyId: route.params.currencyId,
                                    orgId: route.params?.orgId
                                })}>
                                    <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                )
            }
        </SafeAreaView>
    )
}

export default ShipAddress;

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        //alignItems: "center",
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    // Heading: {
    //     fontSize: 26,
    //     fontWeight: "500",
    //     color: "#252525",
    //     textAlign: "center"
    // },
    RadioButtonRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    singleRadioBtn: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#FFF",
        borderRadius: 15,
        paddingHorizontal: 35,
        paddingVertical: 12,
        marginBottom: 15
    },
    circle: {
        height: 24,
        width: 24,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#aeaeae',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        position: "absolute",
        left: 10,
        top: 17
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 15,
        backgroundColor: '#1788F0',
    },
    btnSubmit: {
        width: "46%",
        height: 42,
        alignItems: "center",
        backgroundColor: "#1788F0",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        padding: 5,
        marginHorizontal: "2%"
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
    }
});