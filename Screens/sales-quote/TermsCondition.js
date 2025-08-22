import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    TouchableWithoutFeedback,
    Dimensions,
    Animated
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
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const TermsCondition = ({ navigation, route }) => {
    const cartState = useSelector(state => state.CartReducer);
    const salesQuoteSubmitState = useSelector(state => state.SalesQuoteSubmitReducers);
    const state = useSelector((state) => state.AllSalesQuote);
    const dispatch = useDispatch();
    const [lines, setLines] = useState();
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [empId, setEmpId] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [termsTemplateText, setTermsTemplateText] = useState(state?.SqDefaultTermsTemplate?.term_template?.invoicetemp_body || '');
    const [customerId, setCustomerId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [customerSiteId, setCustomerSiteId] = useState(null);
    const [mailTo, setMailTo] = useState('');
    const [mailCC, setMailCC] = useState('');
    const [mailSubject, setMailSubject] = useState('');
    const [mailBody, setMailBody] = useState('');
    const [loader, setLoader] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpacity] = useState(new Animated.Value(0));
    const _editor = useRef();

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        
        Animated.sequence([
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowToast(false);
        });
    };

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
            return { item_id: item.productId, item_quantity: item.product_qty, uom: item.uom, unit_price: item.price, sq_line_description: item.itemLineDesc };
        });
        setLines(lines);
    }, [cartState]);

    useEffect(() => {
        if (salesQuoteSubmitState.salesQuoteData.status === "Success") {
            dispatch({ type: "RESET_CART_DATA" });
            setIsSectionShow(false);
            showToastMessage('Sales quote created successfully!');
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
        try {
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
        } catch (error) {
            showToastMessage('Error submitting sales quote');
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
                showToastMessage('Email sent successfully!');
            }
        } catch (error) {
            setLoader(false);
            showToastMessage('Error sending email');
        } finally {
            setLoader(false);
        }
    }

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
            showToastMessage('PDF downloaded successfully!');
        } catch (error) {
            setLoader(false);
            showToastMessage('Error downloading PDF');
        } finally {
            setLoader(false);
        }
    }

    const handleTextChange = (text) => {
        setTermsTemplateText(text)
    };

    const goBack = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {salesQuoteSubmitState.isLoading && <LogoOverlay />}
            
            {/* Toast Notification */}
            {showToast && (
                <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
            
            <View style={styles.container}>
                {isSectionShow && (
                    <HeaderTextLeft 
                        title={"Terms & Conditions"} 
                        goBack={goBack} 
                        fontSize={20} 
                    />
                )}
                
                {isSectionShow ? (
                    <>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerInfoText}>
                                Review and customize the terms and conditions for your quotation
                            </Text>
                        </View>
                        
                        <View style={styles.editorContainer}>
                            <View style={styles.editorHeader}>
                                <Icon name="filetext1" size={20} color="#1788F0" />
                                <Text style={styles.editorTitle}>Terms Template</Text>
                            </View>
                            
                            <View style={styles.quillContainer}>
                                <QuillEditor
                                    onHtmlChange={handleTextChange}
                                    style={styles.quillEditor}
                                    theme={{ background: '#F8F9FA' }}
                                    initialHtml={termsTemplateText}
                                    ref={_editor}
                                />
                            </View>
                            
                            <Text style={styles.editorHint}>
                                You can customize the default terms and conditions as needed
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <View style={styles.successIcon}>
                            <Icon name="checkcircle" size={80} color="#27AE60" />
                        </View>
                        
                        <Text style={styles.successTitle}>
                            Sales Quote Created
                        </Text>
                        
                        <Text style={styles.successCode}>
                            #{salesQuoteSubmitState.salesQuoteData.data}
                        </Text>
                        
                        <Text style={styles.successMessage}>
                            Your sales quote has been successfully created and saved.
                        </Text>
                        
                        <View style={styles.successActions}>
                            <TouchableOpacity 
                                style={styles.successButton}
                                onPress={() => { 
                                    navigation.navigate('Home'); 
                                    navigation.popToTop(); 
                                    dispatch({ type: "SALES_QUOTE_SUBMIT_RESET" }); 
                                    dispatch({ type: "SEARCH_RESET" });
                                }}
                            >
                                <Icon name="home" size={18} color="#FFF" style={styles.buttonIcon} />
                                <Text style={styles.successButtonText}>Home</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.successButton, styles.emailButton]}
                                onPress={() => { 
                                    setModalVisible(true); 
                                    setMailTo(route.params?.customerEmail); 
                                    setMailSubject(`Sales Quote #${salesQuoteSubmitState.salesQuoteData.data}`);
                                }}
                            >
                                <Icon name="mail" size={18} color="#FFF" style={styles.buttonIcon} />
                                <Text style={styles.successButtonText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            
            {isSectionShow && cartState.cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total (ex. tax)</Text>
                            <Text style={styles.totalAmount}>
                                {route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Submit Quote</Text>
                            <Icon name="arrowright" size={18} color="#FFF" style={styles.submitButtonIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Email Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Send Quote via Email</Text>
                                    <TouchableOpacity 
                                        onPress={() => setModalVisible(false)} 
                                        style={styles.modalClose}
                                    >
                                        <Icon name="closecircle" size={24} color="#E74C3C" />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.modalBody}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>To</Text>
                                        <TextInput
                                            placeholder="Recipient email address"
                                            placeholderTextColor="#95A5A6"
                                            value={mailTo}
                                            onChangeText={setMailTo}
                                            style={styles.modalInput}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>CC (Optional)</Text>
                                        <TextInput
                                            placeholder="CC email addresses"
                                            placeholderTextColor="#95A5A6"
                                            value={mailCC}
                                            onChangeText={setMailCC}
                                            style={styles.modalInput}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Subject</Text>
                                        <TextInput
                                            placeholder="Email subject"
                                            placeholderTextColor="#95A5A6"
                                            value={mailSubject}
                                            onChangeText={setMailSubject}
                                            style={styles.modalInput}
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Message</Text>
                                        <TextInput
                                            placeholder="Add your message here..."
                                            placeholderTextColor="#95A5A6"
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical='top'
                                            style={[styles.modalInput, styles.modalTextArea]}
                                            value={mailBody}
                                            onChangeText={setMailBody}
                                        />
                                    </View>
                                </View>
                                
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity 
                                        style={[styles.modalButton, styles.modalCancelButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.modalCancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={[
                                            styles.modalButton, 
                                            styles.modalSendButton,
                                            (mailTo === "" || loader) && styles.modalButtonDisabled
                                        ]}
                                        onPress={handleMailSent}
                                        disabled={mailTo === "" || loader}
                                    >
                                        {loader ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <>
                                                <Icon name="mail" size={16} color="#FFF" style={styles.modalButtonIcon} />
                                                <Text style={styles.modalSendButtonText}>Send</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default TermsCondition;

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
    headerInfo: {
        marginTop: 10,
        marginBottom: 20,
    },
    headerInfoText: {
        fontSize: 14,
        color: '#7F8C8D',
        //textAlign: 'center',
        lineHeight: 20,
    },
    editorContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    editorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    editorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 10,
    },
    quillContainer: {
        height: 300,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    quillEditor: {
        flex: 1,
    },
    editorHint: {
        fontSize: 13,
        color: '#95A5A6',
        fontStyle: 'italic',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successIcon: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
    },
    successCode: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1788F0',
        marginBottom: 16,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    successActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    successButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 100,
        justifyContent: 'center',
    },
    emailButton: {
        backgroundColor: '#27AE60',
    },
    buttonIcon: {
        marginRight: 8,
    },
    successButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1788F0',
    },
    submitButton: {
        backgroundColor: '#27AE60',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 120,
        justifyContent: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    submitButtonIcon: {
        marginLeft: 8,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(39, 174, 96, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        zIndex: 1000,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 500,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E6ED',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    modalClose: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#F0F4F8',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#2C3E50',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    modalTextArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        gap: 12,
    },
    modalButton: {
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    modalCancelButton: {
        backgroundColor: '#F0F4F8',
    },
    modalCancelButtonText: {
        color: '#7F8C8D',
        fontWeight: '600',
    },
    modalSendButton: {
        backgroundColor: '#1788F0',
    },
    modalButtonDisabled: {
        backgroundColor: '#BDC3C7',
    },
    modalButtonIcon: {
        marginRight: 8,
    },
    modalSendButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});