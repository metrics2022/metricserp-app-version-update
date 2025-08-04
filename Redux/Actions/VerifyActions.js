import { VERIFY_REQUEST, VERIFY_SUCCESS, VERIFY_FAILURE, RESEND_OTP_REQUEST, RESEND_OTP_SUCCESS, RESEND_OTP_FAILURE, LOGOUT } from '../constants';
import axios from "axios";
import { API_URL } from '../../config/constant';
import { getMyLocalData } from '../../config/getLocalStorageData';

export const doVerify = (payload)=> async (dispatch, getState)=> {
    const val = await getMyLocalData();
    dispatch({type:VERIFY_REQUEST});

    let data = {
        "unique_key" : payload.uniqueKey,
        "emp_otp": payload.otp
    }
    // console.log('ASdasdasd',data)
    try{
        const response = await axios.post(API_URL+'/otp-verification', data)


        dispatch({
            type:VERIFY_SUCCESS,
            payload:response.data
        });

        // console.log('ASdasdasd',response.data)

    }catch(error){
        dispatch({type:VERIFY_FAILURE, payload:error.response.data})
    }
}

export const resendOtp = (payload)=> async (dispatch, getState)=> {
    //console.log(payload);

    dispatch({type:RESEND_OTP_REQUEST});

    let data = {
        "unique_key" : payload
    }
    try{
        const response = await axios.post(API_URL+'/employee-resend-otp', data)
        // console.log('tuu', response.data);

        dispatch({
            type:RESEND_OTP_SUCCESS,
            payload:response.data
        });

    }catch(error){
        dispatch({type:RESEND_OTP_FAILURE, payload:error.response.data})
    }
}

export const doLogout = () => async (dispatch, getState) => {
    dispatch({type:LOGOUT});
}