import { RESOURCE_TRANSACTIONS_SEARCH_REQUEST, RESOURCE_TRANSACTIONS_SEARCH_SUCCESS, RESOURCE_TRANSACTIONS_SEARCH_FAILURE, RESOURCE_TRANSACTIONS_DETAILS_REQUEST, RESOURCE_TRANSACTIONS_DETAILS_SUCCESS, RESOURCE_TRANSACTIONS_DETAILS_FAILURE, RESOURCE_WORK_ORDER_SEARCH_REQUEST, RESOURCE_WORK_ORDER_SEARCH_SUCCESS, RESOURCE_WORK_ORDER_SEARCH_FAILURE, SELECTED_RESOURCE_WORK_ORDER_SEARCH_REQUEST, SELECTED_RESOURCE_WORK_ORDER_SEARCH_SUCCESS, SELECTED_RESOURCE_WORK_ORDER_SEARCH_FAILURE, RESOURCE_CODE_SEARCH_REQUEST, RESOURCE_CODE_SEARCH_SUCCESS, RESOURCE_CODE_SEARCH_FAILURE, SELECTED_RESOURCE_CODE_SEARCH_REQUEST, SELECTED_RESOURCE_CODE_SEARCH_SUCCESS, SELECTED_RESOURCE_CODE_SEARCH_FAILURE, RESOURCE_SUBMIT_REQUEST, RESOURCE_SUBMIT_SUCCESS, RESOURCE_SUBMIT_FAILURE, WORK_ORDER_FIND_START, WORK_ORDER_FIND_SUCCESS, WORK_ORDER_FIND_FAILURE, WO_DETAILS_REQUEST, WO_DETAILS_SUCCESS,  WO_DETAILS_FAILURE } from '../constants';
import axios from "axios";
import { API_URL_V1 } from '../../config/constant';
import { getMyLocalData } from '../../config/getLocalStorageData';







export const HandleWorkOrderSearchAction = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: WORK_ORDER_FIND_START });

    try {
        const response = await axios.post(API_URL_V1 + 'search-transaction-v2', payload, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: WORK_ORDER_FIND_SUCCESS,
            payload: response.data.data
        });

        // console.log("resource", response.data.data)

        return response.data;

    } catch (error) {
        dispatch({ type: WORK_ORDER_FIND_FAILURE, payload: error.response.data })
        throw error;
    }
}

export const woDetailsAction = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: WO_DETAILS_REQUEST });

    let data = {
        "work_order_id": payload
    }
    // console.log('payload', data);
    try {
        const response = await axios.post(API_URL_V1 + 'transaction-details', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
        dispatch({
            type: WO_DETAILS_SUCCESS,
            payload: response.data.data
        });

        // console.log('operations', response.data.data);

    } catch (error) {
        dispatch({ type: WO_DETAILS_FAILURE, payload: error.response.data })
        // console.log('Error', error);
    }
}