import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Alert,
    Platform,
    BackHandler,
    Linking
} from 'react-native';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { useIsFocused } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import VersionCheck from 'react-native-version-check';

import { doLogin } from '../Redux/Actions/AuthActions';
import { VERSION_CHECK_API_URL } from '../config/constant';
import axios from "axios";
import { LOGIN_REQUEST } from '../Redux/constants';
import LogoOverlay from '../Component/LoaderComponent';

const Login = ({ navigation }) => {
    const state = useSelector(state => state.LoginReducer);
    const { control, handleSubmit, getValues, formState: { errors } } = useForm();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const [loading, setIsloading] = useState(false);
    const [message, setMessage] = useState('');


    const onSubmit = async (data) => {
        dispatch({type:LOGIN_REQUEST});
        const response = await axios.get(VERSION_CHECK_API_URL + '/version-check', {
            headers: {
                "X-Access-Token": "wSsVR61wrET5CPgsz2esIukxn1gBUgzyEEx"
            }
          });

          const latestVersion =  Platform.OS === 'ios' ? response?.data?.data?.ios_version : response?.data?.data?.android_version;
          const currentVersion = VersionCheck.getCurrentVersion();
          // console.log(latestVersion, currentVersion)
          if(currentVersion < latestVersion){
            Alert.alert(
              'Please Update',
              'Please update the MetricsERP app to leverage the latest features..',
              [
                {
                  text: 'Update',
                  onPress: () => {
                    BackHandler.exitApp();
                    Linking.openURL(
                      Platform.OS === 'ios'
                        ? 'https://apps.apple.com/app/metricserp/id1480100130'
                        : 'https://play.google.com/store/apps/details?id=com.metricsERP'
                    ); // open the appropriate store depending on the platform
                  }
                }
              ],
              { cancelable: false }
          );
          }else{
            dispatch(doLogin(data));
          }


    }


    useEffect(()=> {
        //console.log(state.errorMessage);
        if(state.loginData.status==="Success"){

            if(state.loginData.data.account_count == "1"){
                if(state.loginData.data.employeeData.email == "demo.user@gmail.com")
                {
                    alert("OTP: "+state.loginData.data.otp.otp);
                }
                dispatch({type:"RESET_OTP_DATA"});
                let unique_key = state.loginData.data.employeeData.unique_key;
                let mobileNo = state.loginData.data.employeeData.emp_mobno;
                navigation.navigate('verification', {
                    uniqueKey: unique_key,
                    emp_mobno:mobileNo
                });
            }else{
                //console.log('dif flow');
                navigation.navigate('account', {
                    empData: state.loginData.data.employeeData
                });
            }

            dispatch({type:"RESET_LOGIN_DATA"});
            setMessage('');

        }

        if(state.errorMessage.status==="Error"){
                setMessage(state.errorMessage.message);
        }
        setIsloading(state.isLoggedIn);
    },[state]);

    useEffect(() => {
        setMessage('');
    }, [isFocused]);



    const onPressCheck = () => {
        setMessage('');
        dispatch({type:"RESET_LOGIN_DATA"});
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.mainWrapper}>
                    {
                        loading && (
                            <View style={{
                                    flex: 1,
                                     position: "absolute",
                                     zIndex: 2,
                                                left: 0,
                                                width: "100%",
                                                justifyContent: "center",
                                                height: "100%",
                                                alignItems: "center",
                                                backgroundColor: "rgba(255,255,255,0.9)"
                                            }}>
                                                <View style={{
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 15,
                                                    borderRadius: 5
                                                }}>
                                                    <Image source={require('../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                                                </View>
                                            </View>
                        )
                    }
                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", paddingHorizontal: 30 }}>
                        <View style={styles.formWrapper}>
                            <Image
                                source={require('../assets/m-logo.webp')}
                                width="70"
                                height="20"
                                resizeMode="cover"
                                style={{ marginBottom: 5 }}
                            />
                            <View style={{ width: "100%", marginBottom: 15 }}>
                                <View style={[styles.inputWrapper, { marginBottom: 5 }]}>
                                    <Icon size={16} color="#626F7F" name="user" style={{ position: "absolute", left: 15, top: 16 }} />
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                            pattern: {
                                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                                message: "Invalid email address"
                                            }
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                placeholder="Email Address"
                                                placeholderTextColor="#808080"
                                                style={{ width: "100%", color: "#000", height:50 }}
                                                onKeyPress={onPressCheck} />
                                        )}
                                        name="email"
                                        defaultValue=""
                                    />
                                </View>
                                {errors.email && errors.email.type === "required" && <Text style={{ color: "red", fontSize: 12 }}>This is required.</Text>}
                                {errors.email && errors.email.type === "pattern" && <Text style={{ color: "red", fontSize: 12 }}>{errors.email.message}</Text>}
                            </View>
                            {/* <View style={{ width: "100%", marginBottom: 15 }}>
                                <View style={[styles.inputWrapper, { marginBottom: 5 }]}>
                                    <Icon size={16} color="#626F7F" name="key" style={{ position: "absolute", left: 15, top: 16 }} />
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                            style={{ width: "100%", color: "#000" }}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                placeholder="Password"
                                                placeholderTextColor="#6c6c6c"
                                                secureTextEntry={true}
                                                onKeyPress={onPressCheck}

                                            />
                                        )}
                                        name="password"
                                        defaultValue=""
                                    />
                                </View>
                                {errors.password && errors.password.type ==="required" && <Text style={{color:"red", fontSize:12}}>This is required.</Text>}
                            </View> */}
                            {

                                    message !== '' && (

                                        <Text style={{ color: "red" }}>{message}</Text>
                                    )
                            }
                            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit(onSubmit)}>
                                <Text style={styles.btnSubmitText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Login;

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative"
    },
    Heading: {
        fontSize: 26,
        fontWeight: "500",
        color: "#252525"
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 10
    },
    formWrapper: {
        paddingVertical: 30,
        alignItems: "center"
    },
    formLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: '#626F7F',
        marginBottom: 10
    },
    inputWrapper: {
        width: "100%",
        backgroundColor: "#F2F1F8",
        borderRadius: 30,
        paddingRight: 15,
        paddingLeft: 35,
    },
    btnSubmit: {
        width: "40%",
        backgroundColor: "#1788F0",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        padding: 14,
        marginTop: 20
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: "500",
        textTransform: "uppercase"
    }
});