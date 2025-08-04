import { SALES_QUOTE_REQUEST, SALES_QUOTE_SUCCESS, SALES_QUOTE_FAILURE, SALES_QUOTE_DETAILS_REQUEST, SALES_QUOTE_DETAILS_SUCCESS, SALES_QUOTE_DETAILS_FAILURE, SALESQUOTE_CUSTOMER_REQUEST, SALESQUOTE_CUSTOMER_SUCCESS, SALESQUOTE_CUSTOMER_FAILURE, SQ_TERMS_TEMPLATE_REQUEST, SQ_TERMS_TEMPLATE_SUCCESS, SQ_TERMS_TEMPLATE_FAILURE } from '../constants';
import axios from "axios";
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1,API_URL } from '../../config/constant';

export const salesQuoteAction = (payload) => async (dispatch, getState) => {

    const val = await getMyLocalData();

    dispatch({ type: SALES_QUOTE_REQUEST });

    let data = {
        "apiKey": val.apiKey,
        "emp_id": payload.customerId,
        "page": payload.page
    }
    // console.log(data)
    try {
        const response = await axios.post(API_URL + '/all-sales-quotes', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: SALES_QUOTE_SUCCESS,
            payload: response.data.data
        });

        // console.log('salesData', response.data.data);

    } catch (error) {
        dispatch({ type: SALES_QUOTE_FAILURE, payload: error.response.data })
    }
}

export const salesQuoteDetailsAction = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: SALES_QUOTE_DETAILS_REQUEST });

    let data = {
        "apiKey": val.apiKey,
    }
    try {
        const response = await axios.post(API_URL + '/v1/sales-quote/' + payload, data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: SALES_QUOTE_DETAILS_SUCCESS,
            payload: response.data.data
        });

        //console.log('detailsData', response.data.data);

    } catch (error) {
        dispatch({ type: SALES_QUOTE_DETAILS_FAILURE, payload: error.response.data })
    }
}

export const salesQuoteCustomerAction = (payload) => async (dispatch, getState) => {
    try {
        const val = await getMyLocalData();
        // console.log(val.token, "Local Data");


        dispatch({ type: SALESQUOTE_CUSTOMER_REQUEST });

        let data = {
            "apiKey": val.apiKey,
            "tableName": "customers",
            "key": "customer_name",
            "fields": [
                "customer_id",
                "customer_name"
            ],
            "whereObj": {
                "customer_active": 1
            },
            "value": payload.value
        };

        // console.log(data, "Data Payload");

        const response = await axios.post(API_URL_V1+'global-serach', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
            ;
        // console.log(response.data.versions, "versions");

        dispatch({
            type: SALESQUOTE_CUSTOMER_SUCCESS,
            payload: response.data.data,

        });
    } catch (error) {
        console.error(error, "API Call Error");
        dispatch({
            type: SALESQUOTE_CUSTOMER_FAILURE,
            payload: error.response ? error.response.data : "Network Error"
        });
    }
};

export const customerInfoAction = (payload) => async (dispatch, getState) => {
    // console.log(payload, "payloadcustinfo")
    try {
        const val = await getMyLocalData();

        dispatch({ type: SALESQUOTE_CUSTOMER_REQUEST });

        let data = {
            "org_id": "1",
            "customer_id": payload.value
        };

        // console.log(data, "Data Payload");

        const response = await axios.post(API_URL_V1+'get-customer-info', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
            ;
        // console.log(response.data.data, "Response1234");

        dispatch({
            type: SALESQUOTE_CUSTOMER_SUCCESS,
            payload: response.data.data
        });
    } catch (error) {
        console.error(error, "API Call Error");
        dispatch({
            type: SALESQUOTE_CUSTOMER_FAILURE,
            payload: error.response ? error.response.data : "Network Error"
        });
    }
};

export const getDefaultSQTermsTemplateAction = (payload) => async (dispatch, getState) => {
    // console.log(payload, "payloadcustinfo")
    try {
        const val = await getMyLocalData();

        dispatch({ type: SQ_TERMS_TEMPLATE_REQUEST });

        let data = {
           "module":"sales_quote",
           "fetch_type":"1"
        };

        // console.log(data, "Data Payload");

        const response = await axios.post(API_URL_V1+'get-term-template', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        });
        // console.log(response.data.data, "Response1234");

        dispatch({
            type: SQ_TERMS_TEMPLATE_SUCCESS,
            payload: response.data.data
        });

        return response.data

    } catch (error) {
        console.error(error, "API Call Error");
        dispatch({
            type: SQ_TERMS_TEMPLATE_FAILURE,
            payload: error.response ? error.response.data : "Network Error"
        });
    }
};