import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    Button,
    TouchableWithoutFeedback,
    Image
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
import { itemIncrement, itemDecrement, removeToCart, cartLineNameChange } from '../../Redux/Actions/SalesOrderCartAction';
import { SALES_ORDER_TOTAL_AMOUNT } from '../../Redux/constants';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextCenter from '../../Component/HeaderTextCenter';
import HeaderTextLeft from '../../Component/HeaderTextLeft';


const SalesOrderCart = ({ navigation, route }) => {

    const cartState = useSelector(state => state.SalesOrderCartReducer);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [currency, setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [menuAccess, setMenuAccess] = useState('');
    const [lineNote, setLineNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    //const [itemDesc, setItemDesc] = useState('');
    const [itemLineDesc, setItemLineDesc] = useState('');
    const [lineIndex, setLineIndex] = useState('');
    const [lineProductId, setLineProductId] = useState('');
    const [lineProductUom, setLineProductUom] = useState('');


    const handleOpen = (desc, index) => {
        //console.log(index)
        setModalVisible(true);
        const newRoutingData = [...cartState.cartItems];

        const lineDesc = newRoutingData[index].itemLineDesc;
        setLineProductId(newRoutingData[index].productId);
        setLineProductUom(newRoutingData[index].uom)
        setItemLineDesc(lineDesc);
    }

    const handleClose = (index) => {
        setModalVisible(false);
    }
    //console.log('linedesc',cartState.cartItems[0].itemLineDesc)


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

    //console.log('cartMenu',menuAccess.menu_name)


    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => { setCurrency(e.currency.currency_code), setCurrencyId(e.currency.currency_id) });
    }, []);


    useEffect(() => {
        dispatch({ type: SALES_ORDER_TOTAL_AMOUNT });
    }, [cartState.cartItems]);


    const checkItemZero = (id) => Alert.alert(
        "Do you really want to delete?",
        "",
        [
            {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Yes", onPress: () => handleDecrement(id) }
        ]
    )

    const handleIncrement = (id) => {
        dispatch(itemIncrement(id));
    }
    const handleDecrement = (id) => {
        dispatch(itemDecrement(id));
    }

    const goBack = () => {
        navigation.goBack()
    }
    // const renderItem = ({ item }) => {
    //     return (
    //         <TouchableOpacity style={styles.eachProduct} onPress={() => handleOpen(item.item_description, item.item_marketprice, item.pricing, item.item_id)}>
    //             {
    //                 item.item_image != "" ? (
    //                     <Image source={{ uri: item.item_image }} style={{ width: "100%", height: 100, resizeMode: "cover", marginBottom: 10 }} />
    //                 ) : (
    //                     <Image source={{ uri: "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} style={{ width: "100%", height: 100, resizeMode: "cover", marginBottom: 10 }} />
    //                 )
    //             }
    //             <Text style={{ color: "#000", fontSize: 12, marginBottom: 3, textAlign: "center" }}>{item.item_description.length < 22
    //                 ? `${item.item_description}`
    //                 : `${item.item_description.substring(0, 20)}...`}</Text>

    //             <View style={styles.btnCart}>
    //                 <Text style={{ color: "#FFF" }}>ADD TO CART</Text>
    //             </View>
    //         </TouchableOpacity>

    //     )
    // }


    return (
        <>
            <View style={styles.mainWrapper}>

                {/* <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: "absolute", top: -10, left: -12, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                    <AntDesign name='arrowleft' size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.Heading}>Cart</Text>
                </View> */}
                <HeaderTextLeft title={"Cart"} goBack={goBack} fontSize={25} />
                {
                    cartState.cartItems?.length > 0 ? (
                        <ScrollView style={{ flex: 1 }}>
                            {cartState.cartItems.map((item, index) => {
                                //console.log('desc',cartState.cartItems.itemDesc)
                                return (
                                    <View style={styles.singleCartProduct} key={index}>
                                        <TouchableOpacity onPress={() => dispatch(removeToCart(index))} style={{ marginRight: 3, width: 24 }}>
                                            <MaterialIcons size={22} color="red" name="delete-outline" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.eachProduct} onPress={() => handleOpen(item.itemLineDesc, index)}>
                                            {
                                                item?.itemLineDesc == "" ? <Image
                                                    source={require('../../assets/file-icon2.png')}
                                                    style={{ height: 22, width: 22 }}
                                                /> : <Image
                                                    source={require('../../assets/file-icon3.png')}
                                                    style={{ height: 22, width: 22 }}
                                                />
                                            }

                                        </TouchableOpacity>

                                        {/* <Image source={require('../assets/product.png')} /> */}

                                        <View style={{ paddingHorizontal: 10, width: "45%" }}>
                                            <Text style={{ color: "#626F7F", fontSize: 12, fontWeight: "700" }}>{item.itemDesc}</Text>
                                            <Text style={{ color: "#626F7F", fontSize: 13, fontWeight: "600" }}>{item.uom_name}</Text>
                                            <Text style={{ color: "#626F7F", fontSize: 13, fontWeight: "600" }}>{Number(item.totalPrice).toFixed(2)}</Text>
                                        </View>
                                        <View style={{ alignItems: "center", marginLeft: "auto" }}>
                                            <Text style={styles.QtyHeading}>Quantity</Text>

                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                {
                                                    item.product_qty > 1 ? (
                                                        <TouchableOpacity onPress={() => handleDecrement(index)} style={{
                                                            width: 23,
                                                            height: 23,
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#FFF",
                                                            borderRadius: 35,
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 3,
                                                            },
                                                            shadowOpacity: 0.12,
                                                            shadowRadius: 4.65,
                                                            elevation: 6,
                                                        }}>
                                                            <MaterialCommunityIcons size={16} color="#000" name="minus" />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => checkItemZero(index)} style={{
                                                            width: 23,
                                                            height: 23,
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#FFF",
                                                            borderRadius: 35,
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 3,
                                                            },
                                                            shadowOpacity: 0.12,
                                                            shadowRadius: 4.65,
                                                            elevation: 6,
                                                        }}>
                                                            <MaterialCommunityIcons size={16} color="#000" name="minus" />
                                                        </TouchableOpacity>
                                                    )
                                                }

                                                <Text style={{ paddingHorizontal: 10, fontSize: 14, color: "#000" }}>{Number(item.product_qty)}</Text>
                                                <TouchableOpacity onPress={() => handleIncrement(index)} style={{
                                                    width: 28,
                                                    height: 28,
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#FFF",
                                                    borderRadius: 35,
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 3,
                                                    },
                                                    shadowOpacity: 0.12,
                                                    shadowRadius: 4.65,
                                                    elevation: 6,
                                                }}>
                                                    <MaterialCommunityIcons size={16} color="#000" name="plus" />
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", flex: 1, }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ alignItems: "center" }}>
                                    <Text>
                                        <TouchableOpacity style={{ position: 'absolute' }}>
                                            <Icon
                                                name="shoppingcart"
                                                style={{ fontSize: 95, color: "#dbd7d7" }} />

                                        </TouchableOpacity>
                                    </Text>
                                </View>
                                <View style={{ alignItems: "center", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 22, marginBottom: 10 }}>Your Cart is empty!</Text>
                                    {/* <Text style={{fontSize:16, color:"#7a7d81"}}>Add items to it now.</Text> */}
                                    <TouchableOpacity style={styles.btnSubmit} onPress={() => navigation.goBack()}>
                                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600" }}>Add Product</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    )

                }


                {/* <View style={{ paddingHorizontal: 15, paddingVertical: 8, marginTop: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#626F7F", fontWeight: "600", fontSize: 16 }}>Subtotal</Text>
                <Text style={{ color: "#98A4B2", fontSize: 14 }}>$0.00</Text>
            </View>
            <View style={{ paddingHorizontal: 15, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F3F3F3", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                <Text style={{ color: "#626F7F", fontWeight: "600", fontSize: 16 }}>Total</Text>
                <Text style={{ color: "#98A4B2", fontSize: 14 }}>$0.00</Text>
            </View> */}

            </View>

            {
                cartState.cartItems.length > 0 && (
                    <View style={styles.checkOutBtn}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                            <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                        </View>
                        <View>
                            {/* {
                                menuAccess?.menu_name == "Sales Order" ? (

                                    <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('ShipAdd', {
                                        currency: currency,
                                        currencyId: currencyId,
                                        orgId: cartState?.orgId
                                    })}>
                                        <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                                    </TouchableOpacity>
                                ) : menuAccess?.menu_name == "QUOTE" && (
                                    <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('ShipAdd', {
                                        currency: currency,
                                        currencyId: currencyId,
                                        orgId: cartState?.orgId
                                    })}>
                                        <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                                    </TouchableOpacity>
                                )
                            } */}

                            <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('ShipAdd', {
                                currency: currency,
                                currencyId: currencyId,
                                orgId: cartState?.orgId
                            })}>
                                <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }
            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={(index) => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => { dispatch(cartLineNameChange({ lineProductId, lineProductUom, itemLineDesc })), handleClose() }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 10, paddingHorizontal: 5, position: "relative", fontWeight: "700" }}>Line Note</Text>
                            <View style={styles.line}></View>
                            <Text style={{ color: "#626F7F", fontSize: 12, marginBottom: 5, paddingHorizontal: 5, position: "relative", fontWeight: "700" }}>Add node</Text>
                            <View>
                                <TextInput placeholder="Type quote description"
                                    editable
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'
                                    placeholderTextColor="#a1a1a1"
                                    style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 150, borderRadius: 10 }}
                                    value={itemLineDesc}
                                    defaultValue={itemLineDesc}
                                    onChangeText={(e) => setItemLineDesc(e)}
                                />
                                <TouchableOpacity style={[styles.btnPopUpSubmit, { borderRadius: 8, marginTop: 15 }]} onPress={() => { dispatch(cartLineNameChange({ lineProductId, lineProductUom, itemLineDesc })), handleClose() }}>
                                    <Text style={styles.popUpTextStyle}>Save</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </Modal>
            </View>
        </>
    )
}

export default SalesOrderCart;

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
    singleCartProduct: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        backgroundColor: "#F9F9F9",
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20
    },
    QtyHeading: {
        color: "#626F7F",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8
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
    btnPopUpSubmit: {
        backgroundColor: "#3b5998",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 45
    },
    popUpTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
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