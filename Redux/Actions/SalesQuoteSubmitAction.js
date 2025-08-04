import { SALES_QUOTE_SUBMIT_REQUEST, SALES_QUOTE_SUBMIT_SUCCESS, SALES_QUOTE_SUBMIT_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1 } from '../../config/constant';


export const SalesQuoteSubmitAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();
    //console.log('orderSubmitaction', payload);
    dispatch({type:SALES_QUOTE_SUBMIT_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "customer_id" : payload.customer_id,
        "emp_id":payload.emp_id,
        "sq_amount" : payload.sq_amount,
        "currency_id":payload.currency_id,
        "org_id":payload.org_id,
        "customer_site_id":payload.customer_site_id || 0,
        "customer_contact_id":payload.customer_contact_id || 0,
        "sq_delivery_address":payload.sq_delivery_address,
        "sq_description":payload.sq_description,
        "terms_conditions":payload.terms_conditions,
        "lines":payload.Lines
    }
    try{
        const response = await axios.post(API_URL_V1+'create-sales-quote', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:SALES_QUOTE_SUBMIT_SUCCESS,
            payload:response.data
        });

        // console.log('quote', response.data);

    }catch(error){
        //console.log("error", error)
        dispatch({type:SALES_QUOTE_SUBMIT_FAILURE, payload:error.response.data})
    }
}

export const storeIds = (payload)=> {
    // console.log('Storeid',payload);
    return{
        type:"STORE_ID",
        payload
    }
}