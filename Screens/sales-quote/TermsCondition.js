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

const TermsCondition = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const salesQuoteSubmitState = useSelector(state => state.SalesQuoteSubmitReducers);
    const state = useSelector((state) => state.AllSalesQuote);
    const dispatch = useDispatch();
    const [lines, setLines] = useState();
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [empId, setEmpId] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [termsTemplateText, setTermsTemplateText] = useState(state?.SqDefaultTermsTemplate?.term_template?.invoicetemp_body || '')

    const [customerId, setCustomerId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    //console.log('description Page', route.params);
    // console.log('Cart Reducers', salesOrderSubmitState);
    //console.log('collectedData', salesQuoteSubmitState.collectedId);

    const [customerSiteId, setCustomerSiteId] = useState(null);
    const [mailTo, setMailTo] = useState('');
    const [mailCC, setMailCC] = useState('');
    const [mailSubject, setMailSubject] = useState('');
    const [mailBody, setMailBody] = useState('');
    const [loader, setLoader] = useState(false);
    //const _editor = React.createRef();

    const _editor = useRef();

    //console.log(state.SqDefaultTermsTemplate.term_template.invoicetemp_body)



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
    }, []);

    useEffect(() => {
        const lines = cartState.cartItems.map(item => {
            // console.log('asdasd', item);
            return { item_id: item.productId, item_quantity: item.product_qty, uom: item.uom, unit_price: item.price, sq_line_description: item.itemLineDesc };
        });
        setLines(lines);
    }, [cartState]);

    useEffect(() => {
        if (salesQuoteSubmitState.salesQuoteData.status === "Success") {
            dispatch({ type: "RESET_CART_DATA" });
            setIsSectionShow(false);
        }
    }, [salesQuoteSubmitState]);

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

    const handleSubmit = async () => {
        // console.log('click' , salesQuoteSubmitState);
        try{
            await dispatch(SalesQuoteSubmitAction({
                sq_amount: Number(cartState.totalAmout.totalAmout).toFixed(2),
                customer_id: customerId,
                org_id: route.params?.orgId,
                emp_id: empId,
                currency_id: route.params.currencyId,
                customer_site_id: customerSiteId,
                customer_contact_id: route.params.contactId,
                sq_description: route.params.descriptionText,
                terms_conditions: termsTemplateText?.html || state?.SqDefaultTermsTemplate?.term_template?.invoicetemp_body,
                sq_delivery_address: "",
                Lines: lines,
            }));
        }catch{

        }

    }

    const handleMailSent = async () => {
        Keyboard.dismiss()
        const val = await getMyLocalData();
        let data = {
            "sq_code": salesQuoteSubmitState.salesQuoteData.data,
            "mail_to_Body": mailBody,
            "mail_Send_to_email": mailTo,
            "mail_subject": mailSubject,
            "mail_CC": mailCC
        }
        setLoader(true);
        try {
            const response = await axios.post(API_URL_V1 + 'send-pdf-email', data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })


            if (response?.data?.status == "Success") {
                setLoader(false);
                setModalVisible(false);
                Alert.alert(response?.data?.message);
                // dispatch({ type: "SALES_QUOTE_SUBMIT_RESET" })
            }


        } catch (error) {
            // console.log("error");
            setLoader(false);
        } finally {
            setLoader(false);
        }

    }
    //console.log('email',route.params?.customerEmail)

    const handlePdfDownload = async () => {
        const val = await getMyLocalData();
        setLoader(true);
        try {
            const response = await axios.get(`https://metricserp.net/metricsapi/public/api/v1/generate-pdf/${salesQuoteSubmitState.salesQuoteData.data}/D`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })

            // console.log("response?.data", response)



        } catch (error) {
            // console.log("error",error);
            setLoader(false);
        } finally {
            setLoader(false);
        }

    }

    const handleTextChange = (text) => {
        setTermsTemplateText(text)
    };

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
                    {
                        isSectionShow && (
                            <>
                                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: "absolute", top: -10, left: -12, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                                    <AntDesign name='arrowleft' size={24} color="#000" />
                                </TouchableOpacity>
                                <View style={{ position: "relative" }}>
                                    <Text style={styles.Heading}>Terms & Condition</Text>
                                </View>
                                <View style={styles.line}></View>
                            </>

                        )
                    }

                    {
                        isSectionShow ? (
                            <View style={{ overflow: 'hidden', marginBottom: 60 }}>
                                {/* <QuillToolbar editor={_editor} options="basic" theme={{ size: 30, color: 'white', background: '#1788F0' }} styles={{ border: 'none' }} /> */}
                                <QuillEditor
                                    onHtmlChange={handleTextChange}
                                    style={{ height: 430, padding: 0, borderColor: '#ccc', borderWidth: 1 }}
                                    theme={{ background: '#F2F1F8' }}
                                    initialHtml={termsTemplateText}
                                    ref={_editor}
                                />
                            </View>
                        ) : (
                            
                            
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 250 }}>
                                <Text
                                    style={{
                                    color: "#000",
                                    fontSize: 20,
                                    fontWeight: "700",
                                    textAlign: "center",
                                    lineHeight: 28, // 👈 ensures even vertical spacing
                                    }}
                                >
                                    Sales Quote Created
                                    <Text
                                    style={{
                                        color: "#1788F0",
                                        fontSize: 20,
                                        fontWeight: "700",
                                        lineHeight: 28, // 👈 match lineHeight
                                    }}
                                    >
                                    {" "}#{salesQuoteSubmitState.salesQuoteData.data}
                                    </Text>
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.btnSubmit} onPress={() => { navigation.navigate('Home'), navigation.popToTop(), dispatch({ type: "SALES_QUOTE_SUBMIT_RESET" }); dispatch({ type: "SEARCH_RESET" }) }}>
                                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600", textTransform: "uppercase" }}>Home</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btnSubmit, { marginHorizontal: 6 }]} onPress={() => { setModalVisible(true); setMailTo(route.params?.customerEmail); setMailSubject(`Sales Quote #${salesQuoteSubmitState.salesQuoteData.data}`) }}>
                                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600", textTransform: "uppercase" }}>Email</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={[styles.btnSubmit]} onPress={handlePdfDownload}>
                                    <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600", textTransform: "uppercase" }}>PDF</Text>
                                </TouchableOpacity> */}
                                </View>
                            </View>
                        )
                    }


                </ScrollView>

                {
                    cartState.cartItems.length > 0 && (
                        <View style={styles.checkOutBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 14, marginRight: 10 }}>Total (ex. tax)</Text>
                                <Text style={{ color: "#1788F0", fontSize: 20, fontWeight: "700" }}>{route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.btnCheckout}

                                    onPress={handleSubmit}

                                >
                                    <Text style={{ color: "#FFF", fontSize: 16 }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }

                <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>


                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={(index) => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center", marginLeft: -12, marginRight: -12 }}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={() => { setModalVisible(false) }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>

                                <TextInput placeholder="Mail To" placeholderTextColor="#a1a1a1" value={mailTo} onChangeText={(e) => { setMailTo(e) }} style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50, marginBottom: 12 }} />

                                <TextInput placeholder="Mail CC" placeholderTextColor="#a1a1a1" value={mailCC} onChangeText={(e) => { setMailCC(e) }} style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50, marginBottom: 12 }} />

                                <TextInput placeholder="Mail Subject" placeholderTextColor="#a1a1a1" value={mailSubject} onChangeText={(e) => { setMailSubject(e) }} style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50, marginBottom: 12 }} />

                                <TextInput placeholder="Mail Body"
                                    editable
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'
                                    placeholderTextColor="#a1a1a1"
                                    style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 150 }}
                                    value={mailBody}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(e) => setMailBody(e)}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity disabled={mailTo == "" || loader} style={[styles.btnSubmit, { borderRadius: 8, marginTop: 15, backgroundColor: mailTo == "" || loader ? '#ccc' : '#1788F0', width: 100 }]} onPress={() => handleMailSent()}>
                                        {loader && <ActivityIndicator size={15} color="#FFF" />}
                                        <Text style={[styles.btnSubmitText, { marginLeft: 10 }]}>Send</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    </Modal>

                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default TermsCondition;

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