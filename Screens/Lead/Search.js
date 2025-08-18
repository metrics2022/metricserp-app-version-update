import Icon from 'react-native-vector-icons/AntDesign';
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
    Keyboard
} from 'react-native';
import { useDispatch } from 'react-redux';
import { SearchLeadAction } from '../../Redux/Actions/LeadSubmitAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import LogoOverlay from '../../Component/LoaderComponent';

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
        Keyboard.dismiss();
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
        }
    }

    const validateEmail = (email) => {
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
            {isLoading && <LogoOverlay/>}
           
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainWrapper}>
                        <HeaderTextLeft title={"Lead Search"} goBack={goBack} fontSize={25} />
                        
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchTitle}>Search Leads by Name, Phone, Company, or Email:</Text>
                            
                            {/* Name Search Field */}
                            <View style={styles.searchFieldContainer}>
                                <View style={styles.inputContainer}>
                                    <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        onChangeText={(e) => { setInputVal(e); }} 
                                        placeholder="Search by Name" 
                                        placeholderTextColor="#666" 
                                        style={styles.inputField} 
                                        editable={!isAnyFieldTyped || inputVal.length > 0} 
                                        maxLength={40} 
                                        value={inputVal}
                                    />
                                </View>
                                <TouchableOpacity 
                                    disabled={inputVal?.length < 3} 
                                    style={[styles.searchButton, { backgroundColor: inputVal?.length >= 3 ? "#1788F0" : "#ccc" }]} 
                                    onPress={handleSearch}
                                >
                                    <Icon name="search1" color="#FFF" size={20} />
                                </TouchableOpacity>
                            </View>

                            {/* Phone Search Field */}
                            <View style={styles.searchFieldContainer}>
                                <View style={styles.inputContainer}>
                                    <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput 
                                        keyboardType='phone-pad' 
                                        onChangeText={(e) => { setPhoneNumber(e.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')); }} 
                                        placeholder="Search by Phone" 
                                        placeholderTextColor="#666" 
                                        style={styles.inputField} 
                                        editable={!isAnyFieldTyped || phoneNumber.length > 0} 
                                        maxLength={10} 
                                        value={phoneNumber}
                                    />
                                </View>
                                <TouchableOpacity 
                                    disabled={phoneNumber?.length < 3} 
                                    style={[styles.searchButton, { backgroundColor: phoneNumber?.length >= 3 ? "#1788F0" : "#ccc" }]} 
                                    onPress={handleSearch}
                                >
                                    <Icon name="search1" color="#FFF" size={20} />
                                </TouchableOpacity>
                            </View>

                            {/* Company Search Field */}
                            <View style={styles.searchFieldContainer}>
                                <View style={styles.inputContainer}>
                                    <Icon name="isv" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput 
                                        onChangeText={(e) => { setCompanyName(e) }} 
                                        placeholder="Search by Company" 
                                        placeholderTextColor="#666" 
                                        style={styles.inputField} 
                                        editable={!isAnyFieldTyped || companyName.length > 0} 
                                        maxLength={40} 
                                        value={companyName}
                                    />
                                </View>
                                <TouchableOpacity 
                                    disabled={companyName?.length < 3} 
                                    style={[styles.searchButton, { backgroundColor: companyName?.length >= 3 ? "#1788F0" : "#ccc" }]} 
                                    onPress={handleSearch}
                                >
                                    <Icon name="search1" color="#FFF" size={20} />
                                </TouchableOpacity>
                            </View>

                            {/* Email Search Field */}
                            <View style={styles.searchFieldContainer}>
                                <View style={styles.inputContainer}>
                                    <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput 
                                        keyboardType='email-address' 
                                        onChangeText={handleEmailChange} 
                                        placeholder="Search by Email" 
                                        placeholderTextColor="#666" 
                                        style={styles.inputField} 
                                        maxLength={40} 
                                        editable={!isAnyFieldTyped || emailAddress.length > 0}
                                        value={emailAddress}
                                    />
                                </View>
                                <TouchableOpacity 
                                    disabled={emailAddress?.length < 3 || !isEmailValid} 
                                    style={[styles.searchButton, { backgroundColor: (emailAddress?.length >= 3 && isEmailValid) ? "#1788F0" : "#ccc" }]} 
                                    onPress={handleSearch}
                                >
                                    <Icon name="search1" color="#FFF" size={20} />
                                </TouchableOpacity>
                            </View>
                            {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address</Text>}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    searchContainer: {
        flex: 1,
        width: '100%',
        marginTop: 20
    },
    searchTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: '#333',
        marginBottom: 25,
        // textAlign: 'center'
    },
    searchFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        overflow: 'hidden'
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10
    },
    inputField: {
        flex: 1,
        fontSize: 15,
        color: "#333",
        height: 50,
        paddingVertical: 0
    },
    searchButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1788F0",
    },
    errorText: {
        color: 'red',
        marginTop: -15,
        marginBottom: 15,
        fontSize: 12,
        paddingLeft: 15
    },
});

export default LeadSearch;