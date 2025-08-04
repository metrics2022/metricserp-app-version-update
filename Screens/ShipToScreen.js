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


import HeaderTextLeft from '../Component/HeaderTextLeft';
import { useDispatch, useSelector } from 'react-redux';

const ShipToScreen = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const addressState = useSelector(state => state.AddressReducer);
    // console.log('addressscreen', addressState);
    const [customerSiteId, setCustomerSiteId] = useState('');


    useEffect(() => {
        if (addressState.allShipToAddress.length > 0) {
            setCustomerSiteId(addressState.allShipToAddress[0].customer_site_id);
        }
    }, [addressState]);

    const goBack = () => {
        navigation.goBack()
    }
    return (
        <>
            <View style={styles.mainWrapper}>

                {/* <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: "absolute", top: -10, left: -12, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                    <AntDesign name='arrowleft' size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.Heading}>Shipping Address</Text>
                </View> */}
                <HeaderTextLeft title={"Shipping Address"} goBack={goBack} fontSize={25} />
                <ScrollView >
                {
                    addressState.allShipToAddress.length > 0 ? (
                        addressState.allShipToAddress?.map((elem, index, arr) => {
                            return (
                                <View key={index} style={{ paddingHorizontal: 10 }}>
                                    <TouchableOpacity key={index} onPress={() => setCustomerSiteId(elem.customer_site_id)} style={styles.singleRadioBtn}>
                                        <View style={styles.circle}>
                                            {customerSiteId == elem.customer_site_id && (<View style={styles.checkedCircle} />)}
                                        </View>
                                        <Text style={{ color: "#1f1f1f", fontWeight: "700", fontSize: 16, width: "100%", marginBottom:5 }}>
                                            {/* <Feather name='map-pin' size={16} color="#1788F0" />  */}
                                            {elem.customer_site_city}
                                        </Text>
                                        <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom:5 }}>
                                            {/* <Feather name='map-pin' size={16} color="#1788F0" />   */}
                                            {elem.customer_site_addr1}</Text>
                                        <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom:5 }}>
                                            {/* <FontAwesome5 name='city' size={16} color="#1788F0" />  */}
                                            {elem.customer_site_state}</Text>
                                        <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom:5 }}>
                                            {/* <FontAwesome5 name='fax' size={16} color="#1788F0" />   */}
                                            {elem.customer_site_postcode}
                                        </Text>
                                        <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%", marginBottom:5 }}>
                                          {/* <FontAwesome5 name='phone-alt' size={16} color="#1788F0" />   */}
                                          {elem.customer_site_mobno}
                                        </Text>
                                        <Text style={{ color: "#6c6c6c", fontSize: 14, width: "100%" }}>
                                            {/* <FontAwesome5 name='envelope' size={16} color="#1788F0" />   */}
                                            {elem.customer_site_email}
                                        </Text>
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
                cartState.cartItems.length > 0 && (
                    <View style={styles.checkOutBtn}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                            <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('Remarks', {
                                billToId: route.params.billToId,
                                shipToId: customerSiteId,
                                currency:route.params.currency,
                                currencyId:route.params.currencyId
                            })}>
                                <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </>
    )
}

export default ShipToScreen;

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        //alignItems: "center",
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
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
        backgroundColor: "#FFF",
        borderRadius: 15,
        paddingHorizontal: 35,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 15
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
        left: 10,
        top:17
    },
    checkedCircle: {
        width: 8,
        height: 8,
        borderRadius: 7,
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