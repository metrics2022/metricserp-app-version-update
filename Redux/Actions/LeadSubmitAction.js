import { SEARCH_LEAD_COMPANY_REQUEST, SEARCH_LEAD_COMPANY_SUCCESS, SEARCH_LEAD_COMPANY_FAILURE, SEARCH_LEAD_REQUEST, SEARCH_LEAD_SUCCESS, SEARCH_LEAD_FAILURE, LEAD_REQUEST, LEAD_SUCCESS, LEAD_FAILURE, LEAD_DETAILS_REQUEST, LEAD_DETAILS_SUCCESS, LEAD_DETAILS_FAILURE, LEAD_SUBMIT_REQUEST, LEAD_SUBMIT_SUCCESS, LEAD_SUBMIT_FAILURE , LEAD_ACTIVITIES_REQUEST, LEAD_ACTIVITIES_SUCCESS, LEAD_ACTIVITIES_FAILURE , LEAD_ACTIVITIES_CREATE_REQUEST, LEAD_ACTIVITIES_CREATE_SUCCESS, LEAD_ACTIVITIES_CREATE_FAILURE , LEAD_ACTIVITY_TYPE_SUCCESS , LEAD_ACTIVITY_TYPE_REQUEST , LEAD_ACTIVITY_TYPE_FAILURE} from '../constants';
import axios from "axios";
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1 } from '../../config/constant';

export const SearchLeadCompanyAction = (payload) => async (dispatch, getState) => {

    const val = await getMyLocalData();

    dispatch({ type: SEARCH_LEAD_COMPANY_REQUEST });

    let data = {
        "tableName": "companies",
        "key": "company_name",
        "fields": [
            "company_id",
            "company_name"
        ],
        "whereObj": {
            "company_active": 1,
            "company_trash":0
        },
        "value": payload
    };

    try {
        const response = await axios.post(API_URL_V1 + 'global-serach', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            },
        });

        dispatch({
            type: SEARCH_LEAD_COMPANY_SUCCESS,
            payload: response.data.data,
        });


    } catch (error) {
        dispatch({ type: SEARCH_LEAD_COMPANY_FAILURE, payload: error.response.data })
    }
}

export const SearchLeadAction = (payload) => async (dispatch, getState) => {
    // console.log(payload, "dddd")
    const val = await getMyLocalData();

    dispatch({ type: SEARCH_LEAD_REQUEST });

    try {
        const response = await axios.post(API_URL_V1 + 'search-leads-v2', payload, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            },
        });

        dispatch({
            type: SEARCH_LEAD_SUCCESS,
            payload: response.data.data
        });

        return response.data

    } catch (error) {
        console.error("error",error.response)
        dispatch({ type: SEARCH_LEAD_FAILURE, payload: error.response.data })
    }
}
export const leadDetailsAction = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: LEAD_DETAILS_REQUEST });

    let data = {
        "lead_id":payload
    }
    try {
        const response = await axios.post(API_URL_V1 + 'lead-details-v2', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: LEAD_DETAILS_SUCCESS,
            payload: response.data.data
        });

        // console.log(response.data.data, "response.data.data")
    } catch (error) {
        dispatch({ type: LEAD_DETAILS_FAILURE, payload: error.response.data })
    }
}

export const LeadSubmitAction = (payload) => async (dispatch, getState) => {

    const val = await getMyLocalData();

    dispatch({ type: LEAD_SUBMIT_REQUEST });
   
    let data = {
        "emp_id": val.emp_data.emp_id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "email_address": payload.email_address,
        "phone_number": payload.phone_number,
        "phone_code": payload.phone_code,
        "company_id": payload.company_id,
        "company_name": payload.company_name,
        //="company_id": payload.company_id != "undefined" ? payload.company_id : '',
        // "company_name": payload.company_name != "undefined" ? payload.company_name : '',
        "gender": payload.gender,
        "date_of_birth": payload.date_of_birth != 'Invalid date' ? payload.date_of_birth : '',
        
    }
    //console.log(data)

    try {
        const response = await axios.post(API_URL_V1 + 'create-lead-v2', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: LEAD_SUBMIT_SUCCESS,
            payload: response.data
        });

        
    } catch (error) {
        // console.log('error',error.response.data)
        dispatch({ type: LEAD_SUBMIT_FAILURE, payload: error.response.data })

    }
}

export const LeadActivities = (payload) => async (dispatch, getState) => {
    //  console.log(payload, "LeadActivities")
    try {
        const val = await getMyLocalData();
        // console.log(val.token, "Local Data");

        dispatch({ type: LEAD_ACTIVITIES_REQUEST });

        let data = {
            "lead_id": payload.value
        };

        //console.log(data, "Data Payload");

        const response = await axios.post(API_URL_V1+'get-lead-activities', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
            ;
        //  console.log(response.data.data, "Response1234LeadActivities");

        dispatch({
            type: LEAD_ACTIVITIES_SUCCESS,
            payload: response.data.data
        });
        //console.log("sadsddddd", response.data.data)
    } catch (error) {
        console.error(error.response.status);
        dispatch({
            type: LEAD_ACTIVITIES_FAILURE,
            payload: error.response ? error.response.data : "Network Error"
        });
    }
};

export const CreateLeadActivities = (payload) => async (dispatch, getState) => {
    // console.log(payload, "LeadActivities")
   try {
       const val = await getMyLocalData();
       // console.log(val.token, "Local Data");

       dispatch({ type: LEAD_ACTIVITIES_CREATE_REQUEST });

       let data = {
        "lead_id" : payload.lead_id,
        "message":payload.message,
        "activity_type_id":payload.activity_type_id,
        "emp_id": val.emp_data.emp_id,
    };

       // console.log(data, "Data Payload");

       const response = await axios.post(API_URL_V1+'insert-lead-activity', data, {
           headers: {
               'content-type': 'application/json',
               'Authorization': `Bearer ${val.token}`
           }
       })
           ;
    // console.log(response.data.data, "Response1234LeadActivitiescreate");

       dispatch({
           type: LEAD_ACTIVITIES_CREATE_SUCCESS,
           payload: response.data.data
       });
   } catch (error) {
       console.error(error, "API Call Error");
       dispatch({
           type: LEAD_ACTIVITIES_CREATE_FAILURE,
           payload: error.response ? error.response.data : "Network Error"
       });
   }
};

export const activityType = (payload) => async (dispatch, getState) => {
    try {
        const val = await getMyLocalData();
        // console.log(val.token, "Local Data");


        dispatch({ type: LEAD_ACTIVITY_TYPE_REQUEST });

        let data = {
            "module": "leadActivityType",
            "whereObj": {
                "active": 1
            },
            "fields": [
                "activity_id",
                "activity_name"
            ],
            "orderByKey": "activity_name",
            "orderBy":"ASC"
        };

        // console.log(data, "Data Payload");

        const response = await axios.post(API_URL_V1+'fetch-multi-data', data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })
            ;
        //  console.log(response.data.data, "search123");

        dispatch({
            type: LEAD_ACTIVITY_TYPE_SUCCESS,
            payload: response.data.data,

        });
    } catch (error) {
        console.error(error, "API Call Error");
        dispatch({
            type: LEAD_ACTIVITY_TYPE_FAILURE,
            payload: error.response ? error.response.data : "Network Error"
        });
    }
};

