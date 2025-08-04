import { SASS_LOGIN_REQUEST, SASS_LOGIN_SUCCESS, SASS_LOGIN_FAILURE } from '../constants';
import axios from "axios";
import { API_URL } from '../../config/constant';

export const SassLoginAction = (payload)=> async (dispatch, getState)=> {

    dispatch({type:SASS_LOGIN_REQUEST});
    
    let data = {
        "unique_key": payload
    }
    try{
        const response = await axios.post(API_URL+'/sass-login', data) 
        
        dispatch({
            type:SASS_LOGIN_SUCCESS,
            payload:response.data
        });

        // console.log('sasslogin data', response.data.data);

    }catch(error){
        dispatch({type:SASS_LOGIN_FAILURE, payload:error.response.data})
    }   
}
