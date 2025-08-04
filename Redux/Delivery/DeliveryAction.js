import { DELIVERY_REQUEST_START, DELIVERY_REQUEST_SUCCESS, DELIVERY_REQUEST_FAILURE , DELIVERY_CONFIRM_REQUEST_START, DELIVERY_CONFIRM_REQUEST_SUCCESS, DELIVERY_CONFIRM_REQUEST_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1 } from '../../config/constant';


export const DeliveryAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:DELIVERY_REQUEST_START});

    try{
        const response = await axios.post(API_URL_V1+'fetch-all-deliveries', payload,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:DELIVERY_REQUEST_SUCCESS,
            payload:response.data.data
        });

    }catch(error){
        dispatch({type:DELIVERY_REQUEST_FAILURE, payload:error.response.data})
    }
}

export const ConfirmDelivery = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:DELIVERY_CONFIRM_REQUEST_START});

    try{
        const response = await axios.post(API_URL_V1+'deliveries/record-completion', payload,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:DELIVERY_CONFIRM_REQUEST_SUCCESS,
            payload:response.data.data
        });

        return response.data.data

    }catch(error){
        let errorMessage = 'Something went wrong. Please try again.';

        if (error.response) {
            // Server responded with a status other than 2xx
            //console.log('Server Error:', error.response.data);
            errorMessage = 'Something went wrong. Please try again.' || 'Error fetching data from server.';
        } else if (error.request) {
            // Request was made but no response received
            //console.log('Network Error:', error.request);
            errorMessage = 'Network error. Please check your internet connection.';
        } else {
            // Something else happened while setting up the request
            //console.log('Error', error.message);
            errorMessage = error.message;
        }

        // Dispatch failure action with the error message
        dispatch({type:DELIVERY_CONFIRM_REQUEST_FAILURE, payload:error.response.data})

        // Optionally show the error message to the user via an alert or notification
        //alert(errorMessage);

    }
}