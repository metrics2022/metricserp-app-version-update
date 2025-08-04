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
} from 'react-native';
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeadSubmitAction } from '../../Redux/Actions/LeadSubmitAction';
import { useForm, Controller } from "react-hook-form";
import AntDesign from 'react-native-vector-icons/AntDesign';

import axios from "axios";
import PhoneInput from "react-native-phone-number-input";
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';
import SelectDropdown from 'react-native-select-dropdown'


let currentCountryFlag = '';

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
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [menuAccess, setMenuAccess] = useState('');
    const [leadType, setLeadType] = useState('');
    const [currentCountryCode, setCurrentCountryCode] = useState();
    //const [currentCountryFlag, setCurrentCountryFlag] = useState();
    const [gender, setGender] = useState('');
    //const [isFlagChecked, setIsFlagChecked] = useState(false);

    const genderOptions = [{
        "value": '1',
        "label": "Male"
    },
    {
        "value": '2',
        "label": "Female"
    }]

    const getLeadType = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    //console.log("email_address", email_address)

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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(new Date(date).toLocaleDateString());
        hideDatePicker();
    };

    const getDateOfBirth = () => {
        if (date != "Invalid date") {
            return date !== '' ? moment(date).format("DD-MM-YYYY") : null
        } else {
            return date = "select date"
        }

    };
    useEffect(() => {
        if (firstName == '' || lastName == '' || emailAddress == '' || emailValidError != '' || phoneNumber == '') {
            setBtnDisabled(true);
        }
        else {
            setBtnDisabled(false);
        }
    }, [firstName, lastName, phoneNumber, emailAddress]);
    //console.log("AsyncStorage",AsyncStorage.getItem("currentCountryFlag"))
    
    // useEffect(() => {
    //     const fetchCountryFlag = async () => {
    //         try {
    //             // Fetch the country flag
    //             const response = await axios.get("https://api.ipregistry.co/?key=3228jir33m5fph17");
    //             const flag = "+".concat(response?.data?.location?.country?.calling_code)
    //             console.log("Fetched flag:", flag);
    
    //             // Update the state
    //             setCurrentCountryFlag(flag); // Ensure this updates currentCountryFlag
    //             setCurrentCountryCode(flag);
    
    //             // Save to AsyncStorage
    //             await AsyncStorage.setItem("currentCountryFlag", flag);
    //         } catch (error) {
    //             //console.error("Error fetching country flag:", error);
    //         }
    //     };
    
    //     fetchCountryFlag();
    // }, []);
    
    // useEffect(() => {
    //     const checkStoredFlag = async () => {
    //         try {
    //             const storedFlag = await AsyncStorage.getItem("currentCountryFlag");
    //             if (storedFlag != "" && isFlagChecked == false) {
    //                 //console.log("currentCountryFlag matches AsyncStorage value.");
    //                 setIsFlagChecked(true);
    //             }
    //         } catch (error) {
    //             //console.error("Error checking AsyncStorage flag:", error);
    //         }
    //     };
    
    //     if (currentCountryFlag) {
    //         //console.log("Triggering second useEffect...");
    //         checkStoredFlag();
    //     }
    
    // }, [currentCountryFlag]);

    //let currentCountryFlag ='';
    useEffect(() => {
        axios.get("https://api.ipregistry.co/?key=3228jir33m5fph17")
            .then(result => {
                setCurrentCountryCode("+".concat(result?.data?.location?.country?.calling_code));
                currentCountryFlag = result?.data?.location?.country?.code;
            })
    }, [])

    const { control, formState: { errors } } = useForm();
    const phoneInput = useRef(null);

    useEffect(() => {
        if (leadSubmitState?.newLeadSubmit?.status === "Success") {
            dispatch({ type: "LEAD_SUBMIT_RESET" });
            setIsSectionShow(false);
        }
    }, [leadSubmitState]);

    const handleLeadSubmit = () => {

        dispatch(LeadSubmitAction({
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress,
            phone_number: phoneNumber,
            phone_code: currentCountryCode,
            gender: gender,
            date_of_birth: date,
            company_id: route?.params?.companyId !== undefined ? route?.params?.companyId : '',
            company_name: route?.params?.companyName !== undefined ? route?.params?.companyName : '',

        }));
    }

    const goBack = () => {
        navigation.goBack()
    }
    //console.log('currentCountryCode',currentCountryCode)
    //console.log('phoneNumber',phoneNumber)
   
    //..................email validaion....................//
    const [emailValidError, setEmailValidError] = useState('');
    const handleValidEmail = val => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (val.length === 0) {
            setEmailValidError('email address must be entered');
        } else if (reg.test(val) === false) {
            setEmailValidError('enter valid email address');
        } else if (reg.test(val) === true) {
            setEmailValidError('');
        }
    };


    const leadTypeTwoField = () => {
        if (leadType == '2') {
            return (
                <View>
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Date Of Birth</Text>
                        <View style={[styles.dateWrapper, { backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12 }]}>
                            <View style={styles.dateRow}>
                                <View style={[styles.box1,]}>
                                    <TouchableOpacity onPress={showDatePicker} style={{ height: 30, backgroundColor: "#e1e2e3" }}>
                                        <Fontawesome name="calendar" color="#000" size={16} style={{ position: "absolute", top: 16, right: 10 }} />

                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.box2,]}>
                                    <TextInput style={{ color: '#000', height: 50 }} value={getDateOfBirth() != "Invalid date" ? getDateOfBirth() : 'Select Date'}
                                        placeholder='Select Date' editable={false}
                                    />

                                </View>
                            </View>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                maximumDate={new Date()}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Gender</Text>

                            <SelectDropdown
                                buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height: 50 }}
                                buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 14 }}
                                defaultButtonText="Select Gender"
                                data={genderOptions}
                                onSelect={(selectedItem) => {
                                    setGender(selectedItem.value)
                                }}
                                buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item) => {
                                    return item.label
                                }}
                                renderDropdownIcon={() => {
                                    return <AntDesign name='caretdown' size={12} color="#000" />;
                                }}
                            />
                        </View>
                    </View>
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                leadSubmitState.isLoading && (
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
                {
                    isSectionShow && (
                        <>
                            <HeaderTextLeft title={"Lead Contact"} goBack={goBack} fontSize={25} />
                        </>
                    )
                }
                <ScrollView style={{flex:1}}>
                    {
                        isSectionShow ? (
                            <>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative" }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>First Name <Text style={{ color: '#FF0000' }}>*</Text></Text>
                                    <TextInput name="firstName" placeholderTextColor="#1a1a1a" value={firstName} onChangeText={(e) => { setFirstName(e), setIsvisible(true), setBtnDisabled(false) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }}
                                    />
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Last Name <Text style={{ color: '#FF0000' }}>*</Text></Text>

                                    <TextInput name="lasttName" defaultValue='' placeholderTextColor="#1a1a1a" value={lastName} onChangeText={(e) => { setLastName(e), setIsvisible(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }} />
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Email Address <Text style={{ color: '#FF0000' }}>*</Text></Text>
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
                                                style={[styles.conInput, { color: "#000", height: 50 }]}
                                                onBlur={onBlur}
                                                value={emailAddress}
                                                onChangeText={value => {
                                                    setEmailAddress(value);
                                                    handleValidEmail(value);
                                                }}
                                                placeholderTextColor="#6c6c6c"
                                                editable={route.params?.email_address == "" ? true:false}
                                            />
                                        )}
                                        name="email"
                                        defaultValue=""
                                    />
                                    {emailValidError ? <Text style={{ color: "red" }}>{emailValidError}</Text> : null}
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>

                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Phone No <Text style={{ color: '#FF0000' }}>*</Text></Text>
                                    <View style={styles.container}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                                pattern: "(0/91)?[7-9][0-9]{9}",
                                            }}
                                            render={({ field: { } }) => (
                                                <PhoneInput
                                                    ref={phoneInput}
                                                    defaultCode={currentCountryFlag}
                                                    onChangeFormattedText={(text) => setCurrentCountryCode(text)}
                                                    withShadow
                                                    textInputStyle={[styles.input, { color: "#000" }]}
                                                    containerStyle={{
                                                        width: "25%",
                                                        height: 50,
                                                        color: "#000"
                                                    }}
                                                    textContainerStyle={{
                                                        backgroundColor: "#e1e2e3",
                                                        color: "#000",

                                                    }}
                                                    // disabled={phoneNumber !== "" ? true:false}
                                                />
                                            )}
                                            defaultValue=""
                                        />
                                        <TextInput name="phone" keyboardType='phone-pad' defaultValue='' placeholderTextColor="#1a1a1a" value={phoneNumber} onChangeText={(e) => { setPhoneNumber(e), setIsvisible(true),setBtnDisabled(false)}} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 25, width: "90%", height: 50 }} editable={route.params?.phone_number == "" ? true:false} />


                                    </View>


                                    {errors?.contactno && errors?.contactno?.type === "required" && <Text style={{ color: "red", fontSize: 12 }}>This is required.</Text>}
                                    {errors?.contactno && errors?.contactno?.type === "minLength" && <Text style={{ color: "red", fontSize: 12 }}>{errors?.contactno?.message}</Text>}
                                    {errors?.contactno && errors?.contactno?.type === "maxLength" && <Text style={{ color: "red", fontSize: 12 }}>{errors?.contactno?.message}</Text>}
                                </View>
                                {leadTypeTwoField()}
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    {
                                        <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={() => handleLeadSubmit()}>
                                            <Text style={{ color: "#FFF", fontSize: 18 }}>Submit</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </>

                        ) : (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                                <View>
                                    <Text style={{ color: "#000", fontSize: 16, fontWeight: "700" }}>Lead Created Successfully</Text>
                                    <TouchableOpacity style={styles.btnSubmit} onPress={() => { navigation.navigate('service'), navigation.popToTop(), dispatch({ type: "LEAD_SUBMIT_RESET" }) }}>
                                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    btnSubmit: {
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    dateRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -5
    },
    box1: {
        width: "9%",
    },
    box2: {
        width: "50%",
    },
    input: {
        width: "100%",
        height: 30,
        paddingHorizontal: -4,
        paddingVertical: 2,
        fontStyle: "italic",
        backgroundColor: "#e1e2e3",
        color: "#000"
    },
    conInput: {
        backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    item: {
        height: 100,
        width: 100
    }

});

export default LeadContact
