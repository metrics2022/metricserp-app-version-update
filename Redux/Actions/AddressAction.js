import { GET_BILLTO_ADDRESS_REQUEST, GET_BILLTO_ADDRESS_SUCCESS, GET_BILLTO_ADDRESS_FAILURE, GET_SHIPTO_ADDRESS_REQUEST, GET_SHIPTO_ADDRESS_SUCCESS, GET_SHIPTO_ADDRESS_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';


export const BillToAddress = (payload)=> async (dispatch, getState)=> {
    const val = await getMyLocalData();

    dispatch({type:GET_BILLTO_ADDRESS_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
        "customer_id": payload,
    }
    try{
        const response = await axios.post(API_URL+'/customer-sites', data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        })

        // console.log('address', response.data.data);
        
        dispatch({
            type:GET_BILLTO_ADDRESS_SUCCESS,
            payload:response.data.data.address_billto
        });


    }catch(error){
        dispatch({type:GET_BILLTO_ADDRESS_FAILURE, payload:error.response.data})
    }   
}

export const ShipToAddress = (payload)=> async (dispatch, getState)=> {
    
    const val = await getMyLocalData();

    dispatch({type:GET_SHIPTO_ADDRESS_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
        "customer_id": payload,
    }
    try{
        const response = await axios.post(API_URL+'/customer-sites', data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        })

        // console.log('address', response.data.data);
        
        dispatch({
            type:GET_SHIPTO_ADDRESS_SUCCESS,
            payload:response.data.data.address_shipto
        });


    }catch(error){
        dispatch({type:GET_SHIPTO_ADDRESS_FAILURE, payload:error.response.data})
    }   
}