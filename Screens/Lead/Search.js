import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Image
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useDispatch } from 'react-redux';
import { SearchLeadAction } from '../../Redux/Actions/LeadSubmitAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';

const LeadSearch = ({ navigation }) => {
    
    const dispatch = useDispatch()

    const [inputVal, setInputVal] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [isVisible, setIsvisible] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Track which field is active
    const isAnyFieldTyped = inputVal || phoneNumber || companyName || emailAddress;

    const handleSearch = async () => {
        setIsLoading(true);
        dispatch({ type: "SEARCH_LEAD_RESET" })
        dispatch({type:"LEAD_ACTIVITIES_RESET"});
        dispatch({type:"LEAD_SUBMIT_RESET"});
        dispatch({type:"LEAD_DETAILS_RESET"});
        try {

            let data = {
                "name": inputVal,
                "email": emailAddress,
                "company": companyName,
                "phone": phoneNumber,
                "page": "1"
            }
            const response = await dispatch(SearchLeadAction(data));
            if(response.status == "Success"){
                setIsLoading(false);
                const leads = response.data.data
                //console.log('leads',leads[0].leads_id)
                if (leads.length === 1) {
                    navigation.navigate('Details', { leads_id: leads[0].leads_id });
                   
                } else if (leads.length > 1) {
                    // Navigate to the list page if there are multiple work orders
                    navigation.navigate('SearchList', data)
                }else{
                    navigation.navigate('SearchList', data)
                }
                
            }

        } catch (error) {
            console.error("Error:", error);
            // Optionally, handle the error (e.g., show an error message)
        }

    }

    const validateEmail = (email) => {
      // Basic regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleEmailChange = (email) => {
      setEmailAddress(email);
      if(email !== ""){
        setIsEmailValid(validateEmail(email));
      }else{
        setIsEmailValid(true);
      }

    };


    const goBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                 isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
                        <View style={{
                            paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5
                        }}>
                        <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                        </View>
                    </View>
                )
            }
           
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if necessary
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainWrapper}>
                        <HeaderTextLeft title={"Lead Search"} goBack={goBack} fontSize={25} />
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ width: '100%' }}>
                                <Text style={{ fontSize: 16, fontWeight: "700", color: '#000', marginBottom: 15 }}>Search Leads by Name, Phone, Company, or Email:</Text>
                                <View style={{ position: 'relative', paddingRight: 80 }}>
                                    <View style={{ width: "100%", paddingHorizontal: "auto", position: "relative", marginBottom: 20 }}>
                                        <TextInput
                                            onChangeText={(e) => { setInputVal(e); }} placeholder="Search by Name" placeholderTextColor="#000" style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 10, height: 50 }} editable={!isAnyFieldTyped || inputVal.length > 0} maxLength={40} value={inputVal}
                                        />
                                    </View>
                                    <View style={{ overflow: "hidden", position: 'absolute', right: 0 }}>
                                        <TouchableOpacity disabled={inputVal?.length < 3} style={[styles.btnSubmit, { backgroundColor: inputVal?.length >= 3 ? "#1788F0" : "#9d9d9d" }]} onPress={() => {
                                            handleSearch()
                                        }} >
                                            <EvilIcons name="search" color="#FFF" size={38} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ position: 'relative', paddingRight: 80 }}>
                                    <View style={{ width: "100%", paddingHorizontal: "auto", position: "relative", marginBottom: 20 }}>
                                        <TextInput keyboardType='phone-pad' onChangeText={(e) => { setPhoneNumber(e.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')); }} placeholder="Search by Phone" placeholderTextColor="#000" style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 10, height: 50 }} editable={!isAnyFieldTyped || phoneNumber.length > 0} maxLength={10} value={phoneNumber}
                                        />
                                    </View>
                                    <View style={{ overflow: "hidden", position: 'absolute', right: 0 }}>
                                        <TouchableOpacity disabled={phoneNumber?.length < 3} style={[styles.btnSubmit, { backgroundColor: phoneNumber?.length >= 3 ? "#1788F0" : "#9d9d9d" }]} onPress={() => {
                                            handleSearch()
                                        }} >
                                            <EvilIcons name="search" color="#FFF" size={38} />
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                <View style={{ position: 'relative', paddingRight: 80 }}>
                                    <View style={{ width: "100%", paddingHorizontal: "auto", position: "relative", marginBottom: 20 }}>
                                        <TextInput onChangeText={(e) => { setCompanyName(e) }} placeholder="Search by Company" placeholderTextColor="#000" style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 10, height: 50 }} editable={!isAnyFieldTyped || companyName.length > 0} maxLength={40} value={companyName}
                                        />
                                    </View>
                                    <View style={{ overflow: "hidden", position: 'absolute', right: 0 }}>
                                        <TouchableOpacity disabled={companyName?.length < 3} style={[styles.btnSubmit, { backgroundColor: companyName?.length >= 3 ? "#1788F0" : "#9d9d9d" }]} onPress={() => {
                                            handleSearch()
                                        }} >
                                            <EvilIcons name="search" color="#FFF" size={38} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ position: 'relative', paddingRight: 80 }}>
                                    <View style={{ width: "100%", paddingHorizontal: "auto", position: "relative", marginBottom: 20 }}>
                                        <TextInput keyboardType='email-address' onChangeText={handleEmailChange} placeholder="Search by Email" placeholderTextColor="#000" style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 10, height: 50 }} maxLength={40} editable={!isAnyFieldTyped || emailAddress.length > 0}
                                            value={emailAddress}
                                        />
                                        {!isEmailValid && <Text style={styles.errorText}>please enter an valid email address</Text>}
                                    </View>
                                    <View style={{ overflow: "hidden", position: 'absolute', right: 0 }}>
                                        {isEmailValid ? <TouchableOpacity disabled={emailAddress?.length < 3} style={[styles.btnSubmit, { backgroundColor: emailAddress?.length >= 3 ? "#1788F0" : "#9d9d9d" }]} onPress={() => {
                                            handleSearch()
                                        }} >
                                            <EvilIcons name="search" color="#FFF" size={38} />
                                        </TouchableOpacity> : <TouchableOpacity disabled={emailAddress?.length < 3 && isEmailValid} style={[styles.btnSubmit, { backgroundColor: emailAddress?.length >= 3 && isEmailValid ? "#1788F0" : "#9d9d9d" }]}>
                                            <EvilIcons name="search" color="#FFF" size={38} />
                                        </TouchableOpacity>}
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    Row: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center"
    },
    btnSubmit: {
        width: 70,
        height:50,
        backgroundColor: "#3b5998",
        flexDirection: "row",
        justifyContent: "center",
        alignItems:'center',
        paddingHorizontal: 18,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 14,
      },
});

export default LeadSearch;
