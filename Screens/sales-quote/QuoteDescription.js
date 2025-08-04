import React, { useState, useEffect, useCallback, useRef } from 'react'
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
    Modal,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
import { SalesQuoteSubmitAction } from '../../Redux/Actions/SalesQuoteSubmitAction';
import { getDefaultSQTermsTemplateAction } from '../../Redux/Actions/SalesQuoteAction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMyLocalData } from '../../config/getLocalStorageData';
import axios from 'axios';
import { API_URL_V1 } from '../../config/constant';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { useFocusEffect } from '@react-navigation/native';

const QuoteDescription = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const salesQuoteSubmitState = useSelector(state => state.SalesQuoteSubmitReducers);
    const state = useSelector((state) => state.AllSalesQuote);
    const dispatch = useDispatch();
    const [lines, setLines] = useState();
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [empId, setEmpId] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [customerSiteId, setCustomerSiteId] = useState(null);

    useEffect(() => {
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
    }, []);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {
                    salesQuoteSubmitState.isLoading && (
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
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: "absolute", top: -10, left: -12, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                        <AntDesign name='arrowleft' size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={{ position: "relative" }}>
                        <Text style={styles.Heading}>Quote Description</Text>
                    </View>
                    <View style={styles.line}></View>
                    <Text style={[styles.Heading, { textAlign: 'left', fontSize: 18, marginBottom: 10 }]}>Got specific details? enter them here!</Text>

                    <View style={{ flex: 1, overflow: 'hidden' }}>
                        <TextInput placeholder="Type here"
                            editable
                            multiline
                            numberOfLines={100}
                            textAlignVertical='top'
                            placeholderTextColor="#a1a1a1"
                            style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 200, borderRadius: 10 }}
                            value={descriptionText}
                            onChangeText={(e) => setDescriptionText(e)}
                        />
                    </View>


                </ScrollView>

                {
                    cartState.cartItems.length > 0 && (
                        <View style={styles.checkOutBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                                <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                            </View>
                            <View>
                                {/* <TouchableOpacity style={styles.btnCheckout}

                                    onPress={handleSubmit}

                                >
                                    <Text style={{ color: "#FFF", fontSize: 16 }}>Submit</Text>
                                </TouchableOpacity> */}

                                <TouchableOpacity style={styles.btnCheckout} onPress={() => navigation.navigate('SalesOrderTerms', {
                                    billToId: customerSiteId,
                                    currency: route.params.currency,
                                    currencyId: route.params.currencyId,
                                    orgId: route.params?.orgId,
                                    descriptionText:descriptionText,
                                    customerEmail:route.params?.customerEmail
                                })}>
                                    <Text style={{ color: "#FFF", fontSize: 16 }}>Next</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    )
                }
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default QuoteDescription;

var styles = StyleSheet.create({
    mainWrapper: {
        flexGrow: 1,
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
        alignItems: 'center',
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
    editor: {
        height: 300,
        padding: 0,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 0,
        marginVertical: 5,
        backgroundColor: '#ccc',
    }
});