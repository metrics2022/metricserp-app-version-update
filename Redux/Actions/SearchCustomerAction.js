import { SEARCH_CUSTOMER_REQUEST, SEARCH_CUSTOMER_SUCCESS, SEARCH_CUSTOMER_FAILURE,
    SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE, CUSTOMER_SITES_REQUEST, CUSTOMER_SITES_SUCCESS, CUSTOMER_SITES_FAILURE,CUSTOMER_CONTACTS_REQUEST, CUSTOMER_CONTACTS_SUCCESS, CUSTOMER_CONTACTS_FAILURE } from '../constants';
import axios from "axios";
import { getMyLocalData } from '../../config/getLocalStorageData';
import { API_URL_V1, API_URL} from '../../config/constant';

export const SearchCustomerAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:SEARCH_CUSTOMER_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "key_word": payload,
    }
    try{
        const response = await axios.post(API_URL+'/search-customers', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:SEARCH_CUSTOMER_SUCCESS,
            payload:response.data.data
        });


    }catch(error){
        dispatch({type:SEARCH_CUSTOMER_FAILURE, payload:error.response.data})
    }
}


export const Search = (payload)=> async (dispatch, getState)=> {
    // console.log(payload , "pppaaayyyllloooaaaddd")

    const val = await getMyLocalData();

    dispatch({type:SEARCH_REQUEST});

    // let data = {
    //     "brand_id":payload.brand_id,
    //     "category_id": payload.category_id,
    //     "keyword":payload.keyword,
    //     "customer_id":payload.empId
    // }
    try{
        const response = await axios.post(API_URL_V1+'item-autocomplete-cpl', payload,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:SEARCH_SUCCESS,
            payload:response.data.data
        });
        // console.log("dassd", response.data.data)


    }catch(error){
        dispatch({type:SEARCH_FAILURE, payload:error.response.data})
    }
}


export const CustomerDependencySiteAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:CUSTOMER_SITES_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "customer_id":payload,
    }
    //console.log('Quotedata',data)
    try{
        const response = await axios.post(API_URL+'/all-address', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:CUSTOMER_SITES_SUCCESS,
            payload:response.data.data.customer_address
        });
        //console.log("dassd", response.data.data.customer_address)


    }catch(error){
        dispatch({type:CUSTOMER_SITES_FAILURE, payload:error.response.data})
    }
}
export const CustomerDependencyContactAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:CUSTOMER_CONTACTS_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "customer_id":payload,
    }
    //console.log('Quotedata',data)
    try{
        const response = await axios.post(API_URL+'/customer-contacts', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:CUSTOMER_CONTACTS_SUCCESS,
            payload:response.data.data
        });


    }catch(error){
        dispatch({type:CUSTOMER_CONTACTS_FAILURE, payload:error.response.data})
    }
}