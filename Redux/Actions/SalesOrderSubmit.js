import { SALES_ORDER_SUBMIT_REQUEST, SALES_ORDER_SUBMIT_SUCCESS, SALES_ORDER_SUBMIT_FAILURE} from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1 } from '../../config/constant';


export const SalesOrderSubmitAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();
    //console.log('orderSubmitaction', payload);
    dispatch({type:SALES_ORDER_SUBMIT_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "customer_id" : payload.customer_id,
        "emp_id":payload.emp_id,
        "so_amount" : payload.so_amount,
        "customer_billto_id":payload.billToId || 0,
        "customer_shipto_id":payload.shipToId || 0,
        "remarks":payload.remarks,
        "currency_id":payload.currency_id,
        "org_id":payload.org_id,
        // "cust_po_num":"MetricsERP App",
        // "payment": "0",
        // "invoice":"0",
        "lines":payload.Lines
    }
    try{
        const response = await axios.post(API_URL_V1+'create-sales-order', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        // console.log("response.data", response.data)

        dispatch({
            type:SALES_ORDER_SUBMIT_SUCCESS,
            payload:response.data
        });



    }catch(error){
        dispatch({type:SALES_ORDER_SUBMIT_FAILURE, payload:error.response.data})
    }
}

export const storeIds = (payload)=> {
    // console.log('id',payload);
    return{
        type:"STORE_ID",
        payload
    }
}