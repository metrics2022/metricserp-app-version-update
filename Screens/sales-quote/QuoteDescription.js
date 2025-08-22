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
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

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
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpacity] = useState(new Animated.Value(0));

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

    const goBack = () => {
        navigation.goBack();
    }

    const handleNext = () => {
        // if (!descriptionText.trim()) {
        //     showToastMessage('Please add a description before continuing');
        //     return;
        // }
        
        navigation.navigate('SalesOrderTerms', {
            billToId: customerSiteId,
            currency: route.params.currency,
            currencyId: route.params.currencyId,
            orgId: route.params?.orgId,
            descriptionText: descriptionText,
            customerEmail: route.params?.customerEmail
        });
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
                <HeaderTextLeft 
                    title={"Quote Description"} 
                    
                    goBack={goBack} 
                    fontSize={20} 
                />
                
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
                >
                    <ScrollView 
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.descriptionContainer}>
                            {/* <View style={styles.descriptionHeader}>
                                <Icon name="form" size={20} color="#1788F0" />
                                <Text style={styles.descriptionTitle}>Quotation Details</Text>
                            </View> */}
                            
                            <Text style={styles.descriptionHint}>
                                Provide any special instructions, notes, or details about this quotation
                            </Text>
                            
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    placeholder="Type your quotation description here..."
                                    placeholderTextColor="#95A5A6"
                                    multiline
                                    numberOfLines={8}
                                    textAlignVertical='top'
                                    style={styles.textInput}
                                    value={descriptionText}
                                    onChangeText={setDescriptionText}
                                />
                                <View style={styles.charCount}>
                                    <Text style={styles.charCountText}>
                                        {descriptionText.length}/1000 characters
                                    </Text>
                                </View>
                            </View>
                            
                            {/* <View style={styles.tipsContainer}>
                                <Text style={styles.tipsTitle}>Tips for effective descriptions:</Text>
                                <View style={styles.tipItem}>
                                    <View style={styles.tipBullet} />
                                    <Text style={styles.tipText}>Be specific about requirements</Text>
                                </View>
                                <View style={styles.tipItem}>
                                    <View style={styles.tipBullet} />
                                    <Text style={styles.tipText}>Include delivery preferences</Text>
                                </View>
                                <View style={styles.tipItem}>
                                    <View style={styles.tipBullet} />
                                    <Text style={styles.tipText}>Mention any special instructions</Text>
                                </View>
                            </View> */}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            
            {cartState.cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total (ex. tax)</Text>
                            <Text style={styles.totalAmount}>
                                {route.params.currency} {Number(cartState.totalAmout.totalAmout).toFixed(2)}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[
                                styles.nextButton,
                                // !descriptionText.trim() && styles.nextButtonDisabled
                            ]} 
                            onPress={handleNext}
                            // disabled={!descriptionText.trim()}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Icon name="arrowright" size={18} color="#FFF" style={styles.nextButtonIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

export default QuoteDescription;

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
        marginBottom: 15,
    },
    headerInfoText: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
    },
    keyboardAvoidView: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    descriptionContainer: {
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
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 10,
    },
    descriptionHint: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 20,
        lineHeight: 20,
    },
    textInputContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    textInput: {
        backgroundColor: '#F0F4F8',
        fontSize: 15,
        color: '#2C3E50',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        textAlignVertical: 'top',
    },
    charCount: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    charCountText: {
        fontSize: 12,
        color: '#95A5A6',
    },
    tipsContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 16,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#1788F0',
        marginRight: 10,
    },
    tipText: {
        fontSize: 13,
        color: '#7F8C8D',
        flex: 1,
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
    nextButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 100,
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#BDC3C7',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    nextButtonIcon: {
        marginLeft: 8,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(231, 76, 60, 0.9)',
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
});