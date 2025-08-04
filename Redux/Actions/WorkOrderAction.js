import { WORK_ORDER_REQUEST, WORK_ORDER_SUCCESS, WORK_ORDER_FAILURE, WORK_ORDER_DETAILS_REQUEST, WORK_ORDER_DETAILS_SUCCESS, WORK_ORDER_DETAILS_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';


export const workOrderAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:WORK_ORDER_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
        //"customer_id":payload.vendorId,
        customer_id:"7"
    }
    // console.log(data)
    try{
        const response = await axios.post(API_URL+'/all-work-order/'+payload.page, data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        }) 
        
        dispatch({
            type:WORK_ORDER_SUCCESS,
            payload:response.data.data
        });

        //console.log('salesData', response.data.data);

    }catch(error){
        dispatch({type:WORK_ORDER_FAILURE, payload:error.response.data})
    }   
}


export const workOrderDetailsAction = (payload)=> async (dispatch, getState)=> {
    const val = await getMyLocalData();
    dispatch({type:WORK_ORDER_DETAILS_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
    }
    try{
        const response = await axios.post(API_URL+'/work-order-details/'+payload, data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        }) 

        //console.log(response)
        
        dispatch({
            type:WORK_ORDER_DETAILS_SUCCESS,
            payload:response.data.data
        });

       // console.log('detailsData', response.data.data);

    }catch(error){
        dispatch({type:WORK_ORDER_DETAILS_FAILURE, payload:error.response.data})
    }   
}
