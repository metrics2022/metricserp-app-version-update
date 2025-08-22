import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    Image
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { itemIncrement, itemDecrement, removeToCart, cartLineNameChange } from '../../Redux/Actions/cartAction';
import { TOTAL_AMOUNT } from '../../Redux/constants';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../../Component/HeaderTextLeft';

const Cart = ({ navigation }) => {
    const cartState = useSelector(state => state.CartReducer);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [currency, setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [menuAccess, setMenuAccess] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [itemLineDesc, setItemLineDesc] = useState('');
    const [cartItemId, setCartItemId] = useState('');

    const handleOpen = (item) => {
        setModalVisible(true);
        setCartItemId(item.cartItemId || '');
        setItemLineDesc(item.itemLineDesc || '');
    }

    const handleClose = () => {
        if (cartItemId) {
            dispatch(cartLineNameChange({ cartItemId, itemLineDesc }));
        }
        setModalVisible(false);
        setCartItemId('');
        setItemLineDesc('');
    }

    const getmoduleData = async () => {
        try {
            const jsonValue1 = await AsyncStorage.getItem('moduleData')
            return jsonValue1 != null ? JSON.parse(jsonValue1) : null
        } catch (err) {}
    }

    useEffect(() => {
        getmoduleData().then((e) => { setMenuAccess(e) });
    }, []);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {}
    }

    useEffect(() => {
        readItemFromStorage().then((e) => { 
            setCurrency(e.currency.currency_code) 
            setCurrencyId(e.currency.currency_id) 
        });
    }, []);

    useEffect(() => {
        dispatch({ type: TOTAL_AMOUNT });
    }, [cartState.cartItems]);

    const checkItemZero = (index) => Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item from your cart?",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Remove", onPress: () => dispatch(itemDecrement(index)), style: "destructive" }
        ]
    )

    const handleIncrement = (index) => {
        dispatch(itemIncrement(index));
    }

    const handleDecrement = (index) => {
        dispatch(itemDecrement(index));
    }

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <>
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Cart"} goBack={goBack} fontSize={25} />

                {
                    cartState.cartItems?.length > 0 ? (
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            {cartState.cartItems.map((item, index) => {
                                return (
                                    <View style={styles.singleCartProduct} key={index}>
                                        <TouchableOpacity 
                                            onPress={() => dispatch(removeToCart(index))} 
                                            style={styles.deleteButton}
                                        >
                                            <MaterialIcons size={22} color="red" name="delete-outline" />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.eachProduct} onPress={() => handleOpen(item)}>
                                            {
                                                item?.itemLineDesc == "" ? 
                                                <Image source={require('../../assets/file-icon2.png')} style={{ height: 22, width: 22 }} /> 
                                                : <Image source={require('../../assets/file-icon3.png')} style={{ height: 22, width: 22 }} />
                                            }
                                        </TouchableOpacity>

                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.itemDesc}</Text>
                                            <Text style={styles.productDetails}>{item.uom_name}</Text>
                                            <Text style={styles.productPrice}>{currency} {Number(item.totalPrice).toFixed(2)}</Text>
                                        </View>

                                        <View style={styles.quantityContainer}>
                                            <Text style={styles.QtyHeading}>Quantity</Text>
                                            <View style={styles.quantityControls}>
                                                {
                                                    item.product_qty > 1 ? (
                                                        <TouchableOpacity 
                                                            onPress={() => handleDecrement(index)} 
                                                            style={styles.quantityButton}
                                                        >
                                                            <Icon size={16} color="#000" name="minus" />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity 
                                                            onPress={() => checkItemZero(index)} 
                                                            style={styles.quantityButton}
                                                        >
                                                            <Icon size={20} color="#2C3E50" name="minus" />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                <Text style={styles.quantityText}>{Number(item.product_qty)}</Text>
                                                <TouchableOpacity 
                                                    onPress={() => handleIncrement(index)} 
                                                    style={[styles.quantityButton, styles.incrementButton]}
                                                >
                                                    <Icon size={20} color="#2C3E50" name="plus" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <View style={styles.emptyCartContainer}>
                            <View style={styles.emptyCartContent}>
                                <View style={styles.emptyCartIcon}>
                                    <Icon name="shoppingcart" style={styles.emptyCartIconImage} />
                                </View>
                                <View style={styles.emptyCartText}>
                                    <Text style={styles.emptyCartTitle}>Your Cart is empty!</Text>
                                    <TouchableOpacity style={styles.btnSubmit} onPress={() => navigation.goBack()}>
                                        <Text style={styles.btnSubmitText}>Add Product</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>

            {
                cartState.cartItems.length > 0 && (
                    <View style={styles.checkOutBtn}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total (ex. tax)</Text>
                            <Text style={styles.totalAmount}>{currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.btnCheckout} 
                            onPress={() => {
                                if(menuAccess?.menu_name == "Sales Order"){
                                    navigation.navigate('Billto', {
                                        currency, currencyId, orgId: cartState?.orgId
                                    })
                                } else if(menuAccess?.menu_name == "QUOTE"){
                                    navigation.navigate('BillingShippingAddress', {
                                        currency, currencyId, orgId: cartState?.orgId, module:"salesQuote"
                                    })
                                }
                            }}
                        >
                            <Text style={styles.btnCheckoutText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <TouchableOpacity onPress={handleClose} style={styles.modalCloseButton}>
                            <Icon size={25} color="red" name="closecircle" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Line Note</Text>
                        <View style={styles.divider}></View>
                        <Text style={styles.modalSubtitle}>Add note</Text>
                        <TextInput
                            placeholder="Type description"
                            editable
                            multiline
                            numberOfLines={5}
                            textAlignVertical='top'
                            placeholderTextColor="#a1a1a1"
                            style={styles.noteInput}
                            value={itemLineDesc}
                            onChangeText={(e) => setItemLineDesc(e)}
                        />
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={handleClose}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default Cart;

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    singleCartProduct: {
        padding: 16,
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    deleteButton: { padding: 4 },
    eachProduct: {
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 8
    },
    productInfo: { flex: 1, paddingHorizontal: 8 },
    productName: { color: "#2C3E50", fontSize: 14, fontWeight: "700", marginBottom: 4 },
    productDetails: { color: "#7F8C8D", fontSize: 13, fontWeight: "600", marginBottom: 4 },
    productPrice: { color: "#1788F0", fontSize: 14, fontWeight: "700" },
    quantityContainer: { alignItems: "center" },
    QtyHeading: { color: "#626F7F", fontSize: 12, fontWeight: "600", marginBottom: 8 },
    quantityControls: { flexDirection: "row", alignItems: "center" },
    quantityButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    incrementButton: { backgroundColor: "#E8F5FF" },
    quantityText: {
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#2C3E50",
        fontWeight: "600",
        minWidth: 30,
        textAlign: 'center',
    },
    emptyCartContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyCartContent: { alignItems: "center", width: '100%' },
    emptyCartIcon: { marginBottom: 24 },
    emptyCartIconImage: { fontSize: 95, color: "#E0E6ED" },
    emptyCartText: { alignItems: "center" },
    emptyCartTitle: { color: "#2C3E50", fontSize: 20, fontWeight: "600", marginBottom: 16, textAlign: "center" },
    btnSubmit: {
        backgroundColor: "#1788F0",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    btnSubmitText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    checkOutBtn: {
        backgroundColor: "#FFF",
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#E0E6ED",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    totalContainer: { flexDirection: "row", alignItems: "center" },
    totalLabel: { color: "#7F8C8D", fontSize: 14, marginRight: 8 },
    totalAmount: { color: "#1788F0", fontSize: 20, fontWeight: "700" },
    btnCheckout: {
        backgroundColor: "#1788F0",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    btnCheckoutText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
    },
    modalCloseButton: { position: "absolute", right: 12, top: 12, zIndex: 1 },
    modalTitle: { color: "#2C3E50", fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
    divider: { height: 1, backgroundColor: "#E0E6ED", marginBottom: 16 },
    modalSubtitle: { color: "#7F8C8D", fontSize: 14, fontWeight: "600", marginBottom: 8 },
    noteInput: {
        backgroundColor: "#F8F9FA",
        fontSize: 15,
        color: "#2C3E50",
        padding: 16,
        height: 150,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0E6ED",
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: "#1788F0",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
    },
    saveButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
