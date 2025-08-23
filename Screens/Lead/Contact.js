import React, { useState, useEffect, useRef } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeadSubmitAction } from '../../Redux/Actions/LeadSubmitAction';
import { useForm, Controller } from "react-hook-form";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import PhoneInput from "react-native-phone-number-input";
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const LeadContact = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const leadSubmitState = useSelector((state) => state.SearchLead);
    const { email_address, phone_number } = route.params || {};
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState("")
    const [isVisible, setIsvisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isSectionShow, setIsSectionShow] = useState(true);
    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [menuAccess, setMenuAccess] = useState('');
    const [leadType, setLeadType] = useState('');
    const [currentCountryCode, setCurrentCountryCode] = useState('');
    const [currentCountryFlag, setCurrentCountryFlag] = useState('US');
    const [gender, setGender] = useState('');
    const [emailValidError, setEmailValidError] = useState('');
    const [isFormTouched, setIsFormTouched] = useState(false);

    const genderOptions = [
        { value: '', label: "Select Gender" },
        { value: '1', label: "Male" },
        { value: '2', label: "Female" }
    ];

    const getLeadType = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        if (email_address) {
          setEmailAddress(email_address);
        }

        if (phone_number) {
            setPhoneNumber(phone_number);
        }
      }, [email_address, phone_number]);

    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };

    useEffect(() => {
        if (leadSubmitState?.errorMessage?.data == '3') {
            AlertComponent({
                title: leadSubmitState?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },
                ]
            });
        }
    }, [leadSubmitState?.errorMessage])

    useEffect(() => {
        getLeadType().then((e) => setLeadType(e?.default_lead_type));
    }, []);

    const getLeadTypeValue = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('leadTypeData')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (err) {
            // console.log(err)
        }
    }

    useEffect(() => {
        getLeadTypeValue().then((e) => { setMenuAccess(e) });
    }, []);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const getDateOfBirth = () => {
        if (date) {
            return moment(date).format("DD-MM-YYYY");
        } else {
            return "Select date";
        }
    };

    useEffect(() => {
        if (firstName == '' || lastName == '' || emailAddress == '' || emailValidError != '' || phoneNumber == '') {
            setBtnDisabled(true);
        }
        else {
            setBtnDisabled(false);
        }
    }, [firstName, lastName, phoneNumber, emailAddress, emailValidError]);
    
    useEffect(() => {
        const fetchCountryFlag = async () => {
            try {
                const response = await axios.get("https://api.ipregistry.co/?key=3228jir33m5fph17");
                const countryCode = response?.data?.location?.country?.code || 'US';
                const callingCode = "+".concat(response?.data?.location?.country?.calling_code || '1');
                
                setCurrentCountryFlag(countryCode);
                setCurrentCountryCode(callingCode);

                await AsyncStorage.setItem("currentCountryFlag", countryCode);
                await AsyncStorage.setItem("currentCountryCode", callingCode);
            } catch (error) {
                setCurrentCountryFlag('US');
                setCurrentCountryCode('+1');
            }
        };

        fetchCountryFlag();
    }, []);

    const { control, formState: { errors } } = useForm();
    const phoneInput = useRef(null);

    useEffect(() => {
        if (leadSubmitState?.newLeadSubmit?.status === "Success") {
            dispatch({ type: "LEAD_SUBMIT_RESET" });
            setIsSectionShow(false);
        }
    }, [leadSubmitState]);

    const handleLeadSubmit = () => {
        setIsFormTouched(true);
        if (!btnDisabled) {
            dispatch(LeadSubmitAction({
                first_name: firstName,
                last_name: lastName,
                email_address: emailAddress,
                phone_number: phoneNumber,
                phone_code: currentCountryCode,
                gender: gender,
                date_of_birth: date ? moment(date).format("YYYY-MM-DD") : null,
                company_id: route?.params?.companyId !== undefined ? route?.params?.companyId : '',
                company_name: route?.params?.companyName !== undefined ? route?.params?.companyName : '',
            }));
        }
    }

    const goBack = () => {
        navigation.goBack()
    }

    const handleValidEmail = val => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (val.length === 0) {
            setEmailValidError('Email address must be entered');
        } else if (reg.test(val) === false) {
            setEmailValidError('Enter valid email address');
        } else if (reg.test(val) === true) {
            setEmailValidError('');
        }
    };

    const leadTypeTwoField = () => {
        if (leadType == '2') {
            return (
                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date Of Birth</Text>
                        <TouchableOpacity 
                            style={styles.dateInput} 
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[styles.dateText, !date && { color: '#9CA3AF' }]}>
                                {getDateOfBirth()}
                            </Text>
                            <Fontawesome name="calendar" color="#6B7280" size={18} />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => setGender(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#6B7280"
                            >
                                {genderOptions.map((option, index) => (
                                    <Picker.Item 
                                        key={index} 
                                        label={option.label} 
                                        value={option.value} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {
                leadSubmitState.isLoading && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={styles.loadingText}>Submitting...</Text>
                        </View>
                    </View>
                )
            }
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.mainWrapper}>
                    {
                        isSectionShow && (
                            <>
                                <HeaderTextLeft title={"Lead Contact"} subTitle={"Please provide your contact information"} goBack={goBack} fontSize={25} />
                                {/* <Text style={styles.subtitle}></Text> */}
                            </>
                        )
                    }
                    <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                        {
                            isSectionShow ? (
                                <>
                                    <View style={styles.formContainer}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
                                            <TextInput 
                                                name="firstName" 
                                                placeholder="Enter first name"
                                                placeholderTextColor="#9CA3AF" 
                                                value={firstName} 
                                                onChangeText={(e) => { 
                                                    setFirstName(e); 
                                                    setIsvisible(true); 
                                                    setBtnDisabled(false); 
                                                }} 
                                                style={[styles.input, isFormTouched && !firstName && styles.inputError]}
                                            />
                                            {isFormTouched && !firstName && (
                                                <Text style={styles.errorText}>First name is required</Text>
                                            )}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
                                            <TextInput 
                                                name="lastName" 
                                                placeholder="Enter last name"
                                                placeholderTextColor="#9CA3AF" 
                                                value={lastName} 
                                                onChangeText={(e) => { 
                                                    setLastName(e); 
                                                    setIsvisible(true); 
                                                }} 
                                                style={[styles.input, isFormTouched && !lastName && styles.inputError]}
                                            />
                                            {isFormTouched && !lastName && (
                                                <Text style={styles.errorText}>Last name is required</Text>
                                            )}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                                            <Controller
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    pattern: {
                                                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                                        message: "Invalid email address"
                                                    }
                                                }}
                                                render={({ field: { onBlur } }) => (
                                                    <TextInput
                                                        style={[styles.input, 
                                                            (emailValidError || (isFormTouched && !emailAddress)) && styles.inputError
                                                        ]}
                                                        onBlur={onBlur}
                                                        value={emailAddress}
                                                        onChangeText={value => {
                                                            setEmailAddress(value);
                                                            handleValidEmail(value);
                                                        }}
                                                        placeholder="Enter email address"
                                                        placeholderTextColor="#9CA3AF"
                                                        editable={route.params?.email_address == "" ? true : false}
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                    />
                                                )}
                                                name="email"
                                                defaultValue=""
                                            />
                                            {emailValidError ? (
                                                <Text style={styles.errorText}>{emailValidError}</Text>
                                            ) : isFormTouched && !emailAddress && (
                                                <Text style={styles.errorText}>Email address is required</Text>
                                            )}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
                                            <View style={[styles.phoneContainer, 
                                                (isFormTouched && !phoneNumber) && styles.phoneContainerError
                                            ]}>
                                                {/* Country Code Selector (Always enabled) */}
                                                <View style={styles.countryCodeContainer}>
                                                    <PhoneInput
                                                        ref={phoneInput}
                                                        defaultCode={currentCountryFlag}
                                                        onChangeFormattedText={(text) => {
                                                            setCurrentCountryCode(text);
                                                        }}
                                                        withShadow
                                                        autoFocus={false}
                                                        textInputStyle={{ display: 'none' }}
                                                        codeTextStyle={styles.codeText}
                                                        textContainerStyle={[styles.textContainer, { backgroundColor: 'transparent' }]}
                                                        containerStyle={[styles.phoneContainerPart, { backgroundColor: 'transparent' }]}
                                                        renderDropdownImage={<AntDesign name='caretdown' size={14} color="#6B7280" />}
                                                    />
                                                </View>
                                                
                                                {/* Phone Number Input (Conditionally disabled) */}
                                                <TextInput
                                                    style={[
                                                        styles.phoneInput,
                                                        route.params?.phone_number && styles.disabledInput
                                                    ]}
                                                    value={phoneNumber}
                                                    onChangeText={(text) => {
                                                        setPhoneNumber(text);
                                                        setIsvisible(true);
                                                        setBtnDisabled(false);
                                                    }}
                                                    keyboardType="phone-pad"
                                                    placeholder="Enter phone number"
                                                    placeholderTextColor="#9CA3AF"
                                                    editable={!route.params?.phone_number}
                                                />
                                            </View>
                                            {isFormTouched && !phoneNumber && (
                                                <Text style={styles.errorText}>Phone number is required</Text>
                                            )}
                                        </View>
                                        {leadTypeTwoField()}
                                        <View style={styles.buttonContainer}>
                                            {
                                                <TouchableOpacity 
                                                    disabled={btnDisabled} 
                                                    style={[styles.btnSubmit, 
                                                        btnDisabled ? styles.btnDisabled : styles.btnEnabled
                                                    ]} 
                                                    onPress={handleLeadSubmit}
                                                >
                                                    <Text style={styles.btnText}>Submit</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.successContainer}>
                                    <View style={styles.successIcon}>
                                        <AntDesign name="checkcircle" size={60} color="#10B981" />
                                    </View>
                                    <Text style={styles.successTitle}>Lead Created Successfully</Text>
                                    <Text style={styles.successMessage}>Your lead information has been submitted successfully.</Text>
                                    <TouchableOpacity 
                                        style={styles.successButton} 
                                        onPress={() => { 
                                            navigation.navigate('service'); 
                                            navigation.popToTop(); 
                                            dispatch({ type: "LEAD_SUBMIT_RESET" }) 
                                        }}
                                    >
                                        <Text style={styles.successButtonText}>Return to Home</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    keyboardAvoid: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.9)",
        justifyContent: 'center',
        alignItems: "center",
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#4B5563',
    },
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 16,
        marginTop: 5,
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        paddingBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: "#374151",
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "600",
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        fontSize: 16,
        color: "#111827",
        paddingHorizontal: 16,
        height: 50,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        marginTop: 5,
    },
    dateInput: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        color: "#111827",
        fontSize: 16,
    },
    pickerContainer: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: "#111827",
    },
    // Phone Input Styles
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        height: 50,
        overflow: 'hidden',
    },
    phoneContainerError: {
        borderColor: '#EF4444',
    },
    countryCodeContainer: {
        width: '30%',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        paddingLeft: 10,
    },
    phoneContainerPart: {
        width: '100%',
        height: 50,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        color: "#111827",
        fontSize: 16,
        paddingHorizontal: 16,
        backgroundColor: "#F9FAFB",
    },
    disabledInput: {
        color: "#6B7280",
        backgroundColor: "#F3F4F6",
    },
    codeText: {
        color: "#111827",
        fontSize: 16,
    },
    textContainer: {
        backgroundColor: "transparent",
        paddingVertical: 0,
        height: 50,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    btnSubmit: {
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        width: '100%',
    },
    btnEnabled: {
        backgroundColor: "#3B82F6",
    },
    btnDisabled: {
        backgroundColor: "#9CA3AF",
    },
    btnText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    successIcon: {
        marginBottom: 20,
    },
    successTitle: {
        color: "#111827",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: 'center',
    },
    successMessage: {
        color: "#6B7280",
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    successButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    successButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default LeadContact