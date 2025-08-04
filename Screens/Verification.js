import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Keyboard,
    Pressable
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { doVerify, resendOtp } from '../Redux/Actions/VerifyActions';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import HeaderTextLeft from '../Component/HeaderTextLeft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomOTPInput from '../Component/CustomOTPInput';


const Verification = ({ navigation, route }) => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [otp, setOtp] = useState('');
    const [active, setActive] = useState(true);
    const [uniqueKey, setUniqueKey] = useState('');
    const [empno, setEmpno] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setIsloading] = useState(false);

    const [otpCode, setOTPCode] = useState("");
    const [isPinReady, setIsPinReady] = useState(false);
    const maximumCodeLength = 6;

    // console.log("newOtp", otp)
    // const handleOtpChange = (newOtp) => {

    //     setOtp(newOtp);
    //     //console.log('newOtp',newOtp)
    //     if (newOtp.length == 6) {
    //         console.log('otp', newOtp)
    //         dispatch(doVerify({ newOtp, uniqueKey }));
    //         setOtp('');
    //         setMessage('');
    //         dispatch({ type: "RESET_OTP_DATA" });
    //     }

    // };

    useEffect(()=>{
        if (otp.length == 6) {
            // console.log('otp', otp)
            dispatch(doVerify({ otp, uniqueKey }));
            // setOtp('');
            setMessage('');
            dispatch({ type: "RESET_OTP_DATA" });
        }
    }, [otp])

    useEffect(() => {
        setUniqueKey(route.params.uniqueKey);
        setEmpno(route.params.emp_mobno);
        Toast.show({
            type: 'success',
            text1: "OTP Sent Successfully",
        });
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => { });
        return () => {
            showSubscription.remove();
        };
    }, []);

    const localStorageData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('uuid', jsonValue)
        } catch (e) {
            // saving error
        }
    }


    useEffect(() => {
        //console.log(state.Verify)
        if (state.Verify.verifyData.status === "Success") {
            setOtp('');
            setMessage('');
            localStorageData(state.Verify.verifyData.data);
            Toast.show({
                type: 'success',
                text1: "OTP varified Successfully",
            });
            // console.log('assdasdasdasdddasdasd', state.Verify.verifyData.data.apiKey);
        }
        if (state.Verify.errorMessage.status === "Error") {
            //console.log(state.Verify.errorMessage)
            setMessage(state.Verify.errorMessage.message);
            Toast.show({
                type: 'error',
                text1: state.Verify.errorMessage.message,
            });
            setActive(true);
        }

        if (state.Verify.resendOtpData?.status === "Success") {
            setOtp('');
            setMessage('');
            Toast.show({
                type: 'success',
                text1: "OTP Sent Successfully",
            });
        }
        setIsloading(state.Verify.isLoggedIn);
    }, [state]);


    // const handleSubmit = ()=> {
    //     dispatch(doVerify({otp, empid}));
    //     setOtp('');
    //     setMessage('');
    // }

    const handleResendOtp = () => {
        dispatch(resendOtp(uniqueKey));
        setOtp('');
        setMessage('');
        dispatch({ type: "RESET_OTP_DATA" });
    }

    useEffect(() => {
        if (!active) {
            dispatch(doVerify({ otp, uniqueKey }));
            // setOtp('');
        }
    }, [active]);

    useEffect(() => {
        setMessage('');
    }, [isFocused]);

    const goBack = () => {
        navigation.goBack()
    }
    return (
        <ScrollView style={styles.mainWrapper}>
            {
                loading || state.Verify.isLoading && (
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
            <View style={{ paddingHorizontal: 30, paddingVertical: 30 }}>
                {/* <Text style={styles.Heading}>Verification</Text> */}
                <HeaderTextLeft title={"Verification"} goBack={goBack} fontSize={26} />

                <View style={styles.formWrapper}>
                    {/* <Text style={styles.formLabel}>Verify account by entering the 6-digit code sent to: XXXXXXX{empno.slice(empno.length - 3)}</Text> */}
                    <Text style={styles.formLabel}>A 6-digit code has been sent to your registered email address.</Text>
                    <View style={{ flexDirection: "row", marginHorizontal: "-1%" }}>
                        {/* <OTPInputView
                        style={{width: '100%', height:55}}
                        pinCount={6}
                        code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged = {code => setOtp(code)}
                        codeInputFieldStyle={styles.Otpbox}
                        codeInputHighlightStyle={styles.activeOtp}
                        onCodeFilled = {(code => {
                            console.log(`Code is ${code}, you are good to go!`);
                            if(code.length == 6){
                                setActive(false);
                                setOtp(code);
                                setMessage('');
                                dispatch({type:"RESET_OTP_DATA"});
                            }
                        })}
                    />     */}
                        {/* <CustomOTPInput length={6} onOtpChange={handleOtpChange} /> */}

                        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                            <CustomOTPInput
                                code={otp}
                                setCode={setOtp}
                                maximumLength={maximumCodeLength}
                                setIsPinReady={setIsPinReady}
                            />
{/*
                            <ButtonContainer
                                disabled={!isPinReady}
                                style={{
                                    backgroundColor: !isPinReady ? "grey" : "#000000",
                                }}
                            >
                                <ButtonText
                                    style={{
                                        color: !isPinReady ? "black" : "#EEEEEE",
                                    }}
                                >
                                    Login
                                </ButtonText>
                            </ButtonContainer> */}
                        </Pressable>
                    </View>
                    {/* <TouchableOpacity disabled={active} style={[styles.btnSubmit, { backgroundColor: active ? "#9d9d9d" : "#1788F0" }]} onPress={handleSubmit}>
                    <Text style={styles.btnSubmitText}>VERIFY</Text>
                </TouchableOpacity> */}
                    {/* {
                        message !=='' && (
                            <Text style={{color:"red", textAlign:"center"}}>{message}</Text>
                        )
                } */}
                    <View style={{ marginTop: 20, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ color: '#626F7F', fontSize: 15, marginRight: 6 }}>Didn't receive the OTP?</Text>
                        <TouchableOpacity onPress={handleResendOtp}>
                            <Text style={{ color: "#1788F0", fontSize: 15, fontWeight: "700" }}>RESEND OTP</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{marginTop:20,alignItems:"center"}}>
                    <Text style={{color:'#060395', fontSize:15, marginRight:6}}>Code expires in 04:59 minutes</Text>
                </View> */}
                </View>
            </View>
            <Toast position='top' style={{ backgroundColor: "#000" }} />
        </ScrollView>
    )
}

export default Verification;

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF'
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
        paddingVertical: 30
    },
    formLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: '#626F7F',
        lineHeight: 24,
        marginBottom: 20
    },
    inputWrapper: {
        width: "22.66%",
        backgroundColor: "#F2F1F8",
        borderRadius: 14,
        marginHorizontal: "1%"
    },
    btnSubmit: {
        width: "100%",
        backgroundColor: "#1788F0",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        padding: 14,
        marginTop: 30,
        marginBottom: 8
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: "500",
        textTransform: "uppercase"
    },
    Otpbox: {
        backgroundColor: "#F2F1F8",
        borderRadius: 14,
        color: "#000",
        fontSize: 17,
        fontWeight: "700"
    },
    activeOtp: {
        borderColor: "#1788F0"
    }
});