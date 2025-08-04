import { LOGIN_REQUEST,LOGIN_SUCCESS,LOGIN_FAILURE, LOGOUT } from '../constants';
import axios from "axios";
import { API_URL } from '../../config/constant';

export const doLogin = (payload)=> async (dispatch, getState)=> {
    dispatch({type:LOGIN_REQUEST});

    let data = {
        "email_address": payload.email,
    }
    try{
        const response = await axios.post(API_URL+'/employee-login', data)

        dispatch({
            type:LOGIN_SUCCESS,
            payload:response.data
        });

        // console.log('ASdasdasd')

    }catch(error){
        dispatch({type:LOGIN_FAILURE, payload:error.response.data})
    }
}


export const doLogout = () => async (dispatch, getState) => {
    dispatch({type:LOGOUT});
}