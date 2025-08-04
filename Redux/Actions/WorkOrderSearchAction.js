import { WORK_ORDER_SEARCH_REQUEST, WORK_ORDER_SEARCH_SUCCESS, WORK_ORDER_SEARCH_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';


export const workOrderSearchAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:WORK_ORDER_SEARCH_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
        "customer_id":payload.customer_id,
        "work_order_number":payload.work_order_number,
        "resource_name":payload.resource_name,
        "operation_description":payload.operation_description,
        "item_code":payload.item_code
    }
    // console.log('payload', data)
    try{
        const response = await axios.post(API_URL+'/work-order-search/'+payload.page, data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        }) 
        
        dispatch({
            type:WORK_ORDER_SEARCH_SUCCESS,
            payload:response.data.data
        });

        // console.log('searchData', response.data.data);

    }catch(error){
        dispatch({type:WORK_ORDER_SEARCH_FAILURE, payload:error.response.data})
    }   
}


