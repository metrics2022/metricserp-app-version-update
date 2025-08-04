import { RESOURCE_TRANSACTIONS_SEARCH_REQUEST, RESOURCE_TRANSACTIONS_SEARCH_SUCCESS, RESOURCE_TRANSACTIONS_SEARCH_FAILURE, RESOURCE_TRANSACTIONS_DETAILS_REQUEST, RESOURCE_TRANSACTIONS_DETAILS_SUCCESS, RESOURCE_TRANSACTIONS_DETAILS_FAILURE, RESOURCE_WORK_ORDER_SEARCH_REQUEST, RESOURCE_WORK_ORDER_SEARCH_SUCCESS, RESOURCE_WORK_ORDER_SEARCH_FAILURE, SELECTED_RESOURCE_WORK_ORDER_SEARCH_REQUEST, SELECTED_RESOURCE_WORK_ORDER_SEARCH_SUCCESS, SELECTED_RESOURCE_WORK_ORDER_SEARCH_FAILURE, RESOURCE_CODE_SEARCH_REQUEST, RESOURCE_CODE_SEARCH_SUCCESS, RESOURCE_CODE_SEARCH_FAILURE, SELECTED_RESOURCE_CODE_SEARCH_REQUEST, SELECTED_RESOURCE_CODE_SEARCH_SUCCESS, SELECTED_RESOURCE_CODE_SEARCH_FAILURE, RESOURCE_SUBMIT_REQUEST, RESOURCE_SUBMIT_SUCCESS, RESOURCE_SUBMIT_FAILURE, WORK_ORDER_FIND_START, WORK_ORDER_FIND_SUCCESS, WORK_ORDER_FIND_FAILURE, WO_DETAILS_REQUEST, WO_DETAILS_SUCCESS,  WO_DETAILS_FAILURE } from '../constants';
import axios from "axios";
import { API_URL, API_KEY, AUTH_KEY } from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';


export const SearchResourceTransactionsAction = (payload) => async (dispatch, getState) => {

    const val = await getMyLocalData();

    dispatch({ type: RESOURCE_TRANSACTIONS_SEARCH_REQUEST });

    let data = {
        "apiKey": val.apiKey,
        "work_order_no": payload.work_order_no
    }
    // console.log('payload Resource Search', data)
    try {
        const response = await axios.post(API_URL + '/search-transaction/' + payload.page, data, {
            // const response = await axios.post(API_URL + '/search-transaction', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
        // console.log('RESOURCE_TRANSACTIONS_Result', response.data.data);
        dispatch({
            type: RESOURCE_TRANSACTIONS_SEARCH_SUCCESS,
            payload: response.data.data
        });

        //console.log('searchData', response.data);

    } catch (error) {
        dispatch({ type: RESOURCE_TRANSACTIONS_SEARCH_FAILURE, payload: error.response.data })
    }
}

// export const ResourceTransactionsDetailsAction = (payload) => async (dispatch, getState) => {
//     const val = await getMyLocalData();
//     dispatch({ type: RESOURCE_TRANSACTIONS_DETAILS_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//     }
//     try {
//         const response = await axios.post(API_URL + '/search-transaction/' + payload, data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })

//         //console.log(response)

//         dispatch({
//             type: RESOURCE_TRANSACTIONS_DETAILS_SUCCESS,
//             payload: response.data.data
//         });

//         // console.log('detailsData', response.data.data);

//     } catch (error) {
//         dispatch({ type: RESOURCE_TRANSACTIONS_DETAILS_FAILURE, payload: error.response.data })
//     }
// }

// export const SearchResourceWorkOrdersAction = (payload) => async (dispatch, getState) => {

//     const val = await getMyLocalData();

//     // dispatch({ type: RESOURCE_WORK_ORDER_SEARCH_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//     }
//     // console.log('RESOURCE WORK_ORDER', data)
//     try {
//         const response = await axios.post(API_URL + '/work-orders', data, {
//             // const response = await axios.post(API_URL + '/search-transaction', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })
//         // console.log('RESOURCE_TRANSACTIONS_WorkOrder', response.data.data);
//         dispatch({
//             type: RESOURCE_WORK_ORDER_SEARCH_SUCCESS,
//             payload: response.data.data
//         });

//         // console.log('Work_ORDER_RESOURCE', response.data.data);

//     } catch (error) {
//         dispatch({ type: RESOURCE_WORK_ORDER_SEARCH_FAILURE, payload: error.response.data })
//         // console.log('Work_ORDER_RESOURCE_Error', response.data.data);
//     }
// }

// export const SelectedWorkOrderResourceAction = (payload) => async (dispatch, getState) => {
//     const val = await getMyLocalData();
//     dispatch({ type: SELECTED_RESOURCE_WORK_ORDER_SEARCH_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//         "work_order_id": payload
//     }
//     try {
//         const response = await axios.post(API_URL + '/operation-code', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })
//         dispatch({
//             type: SELECTED_RESOURCE_WORK_ORDER_SEARCH_SUCCESS,
//             payload: response.data.data
//         });


//     } catch (error) {
//         dispatch({ type: SELECTED_RESOURCE_WORK_ORDER_SEARCH_FAILURE, payload: error.response.data })
//     }
// }

// export const SearchResourceCodeAction = (payload) => async (dispatch, getState) => {

//     const val = await getMyLocalData();

//     dispatch({ type: RESOURCE_CODE_SEARCH_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//     }
//     try {
//         const response = await axios.post(API_URL + '/resource-code', data, {
//             // const response = await axios.post(API_URL + '/search-transaction', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })
//         dispatch({
//             type: RESOURCE_CODE_SEARCH_SUCCESS,
//             payload: response.data.data
//         });


//     } catch (error) {
//         dispatch({ type: RESOURCE_CODE_SEARCH_FAILURE, payload: error.response.data })
//     }
// }
// export const SelectedResourceCodeAction = (payload) => async (dispatch, getState) => {
//     const val = await getMyLocalData();
//     dispatch({ type: SELECTED_RESOURCE_CODE_SEARCH_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//         "resource_id": payload
//     }
//     try {
//         const response = await axios.post(API_URL + '/get-entity', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })
//         dispatch({
//             type: SELECTED_RESOURCE_CODE_SEARCH_SUCCESS,
//             payload: response.data.data
//         });

//         // console.log('Selected_Work_ORDER_RESOURCE', response.data.data);

//     } catch (error) {
//         dispatch({ type: SELECTED_RESOURCE_CODE_SEARCH_FAILURE, payload: error.response.data })
//         // console.log('Work_ORDER_RESOURCE_Error', response.data.data);
//     }
// }

// export const ResourceSubmitAction = (payload) => async (dispatch, getState) => {

//     const val = await getMyLocalData();

//     dispatch({ type: RESOURCE_SUBMIT_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//         "workorder_id": payload.workorder_id,
//         "org_id": payload.org_id,
//         "entitie_id": payload.entitie_id,
//         "resource_id": payload.resource_id,
//         "operation_code": payload.operation_code,
//         "transaction_date": payload.transaction_date,
//         "num_of_hrs": payload.num_of_hrs,
//         "resource_cost_actual": payload.resource_cost_actual,
//         "resource_cost_calculation_date": payload.resource_cost_calculation_date,
//         "workorder_no": payload.workorder_no,
//         "comments": payload.comments,
//     }
//     try {
//         const response = await axios.post(API_URL + '/createResourceTransaction', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })

//         dispatch({
//             type: RESOURCE_SUBMIT_SUCCESS,
//             payload: response.data
//         });


//     } catch (error) {
//         dispatch({ type: RESOURCE_SUBMIT_FAILURE, payload: error.response.data })
//         // console.log('ErrorSubmitRESOURCE:  ', error.response.data);
//     }
// }


export const HandleWorkOrderSearchAction = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: WORK_ORDER_FIND_START });

    try {
        const response = await axios.post(API_URL + '/v1/search-transaction-v2', payload, {
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
        const response = await axios.post(API_URL + '/v1/transaction-details', data, {
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