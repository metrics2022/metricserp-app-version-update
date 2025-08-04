import { SALES_ORDER_REQUEST, SALES_ORDER_SUCCESS, SALES_ORDER_FAILURE, SALES_ORDER_DETAILS_REQUEST, SALES_ORDER_DETAILS_SUCCESS, SALES_ORDER_DETAILS_FAILURE, GET_CUST_OUTSTANDING_REQUEST, GET_CUST_OUTSTANDING_SUCCESS, GET_CUST_OUTSTANDING_FAILURE, GET_CUST_PENDING_INVOICES_REQUEST, GET_CUST_PENDING_INVOICES_SUCCESS, GET_CUST_PENDING_INVOICES_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1 } from '../../config/constant';


export const salesOrderAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:SALES_ORDER_REQUEST});

    let data = {
        "emp_id":payload.customerId,
        "page":payload.page,
        "limit":"10",
        "orderBy":"DESC",
        "orderByKey":"so_header_id"
    }

    // console.log('data', data);

    try{
        const response = await axios.post(API_URL_V1+'fetch-all-sales-orders', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
        // console.log("response.data.data", response.data)

        dispatch({
            type:SALES_ORDER_SUCCESS,
            payload:response.data.data
        });

    }catch(error){
        dispatch({type:SALES_ORDER_FAILURE, payload:error.response.data})
    }
}


export const salesOrderDetailsAction = (payload)=> async (dispatch, getState)=> {
    const val = await getMyLocalData();
    dispatch({type:SALES_ORDER_DETAILS_REQUEST});

    try{
        const response = await axios.get(API_URL_V1+'sales-order/order-summary/'+payload, {
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:SALES_ORDER_DETAILS_SUCCESS,
            payload:response.data.data
        });

        // console.log('detailsData', response.data.data);

    }catch(error){
        dispatch({type:SALES_ORDER_DETAILS_FAILURE, payload:error.response.data})
    }
}

export const getCustOutstandingBalance = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();
    //console.log(payload)
    dispatch({type:GET_CUST_OUTSTANDING_REQUEST});

    let data = {
        "customer_id":payload.customerId,
        "org_id":payload.org_id
    }
    try{
        const response = await axios.post(API_URL_V1+'get-cust-outstanding', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
        
        //console.log("getCustOutstandingBalance", response.data)
        dispatch({
            type:GET_CUST_OUTSTANDING_SUCCESS,
            payload:response.data.data
        });

    }catch(error){
        dispatch({type:GET_CUST_OUTSTANDING_FAILURE, payload:error.response.data})
        // console.log("getCustOutstandingBalanceError", response.data)
    }
}

export const getCustPendingSalesInvoicesAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:GET_CUST_PENDING_INVOICES_REQUEST});

    let data = {
        "customer_id":payload.customerId,
        "org_id":payload.org_id,
        "page":payload.page,
        "limit":"10",
        "orderBy":"DESC",
        "orderByKey":"t.si_header_id"
    }

    // console.log('data', data);

    try{
        const response = await axios.post(API_URL_V1+'fetch-all-pending-invoices', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
        // console.log("response.data.data", response.data)

        dispatch({
            type:GET_CUST_PENDING_INVOICES_SUCCESS,
            payload:response.data.data
        });

    }catch(error){
        dispatch({type:GET_CUST_PENDING_INVOICES_FAILURE, payload:error.response.data})
    }
}