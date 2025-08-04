import { BRAND_SEARCH_REQUEST, BRAND_SEARCH_SUCCESS, BRAND_SEARCH_FAILURE } from '../constants';
import axios from "axios";
import { API_URL } from '../../config/constant';
import { getMyLocalData } from '../../config/getLocalStorageData';


export const BrandAutoComplete = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:BRAND_SEARCH_REQUEST});
    
    let data = {
        "apiKey": val.apiKey,
        "keyword": payload,
    }
    try{
        const response = await axios.post(API_URL+'/brand-autocomplete', data,{
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        }) 
        
        dispatch({
            type:BRAND_SEARCH_SUCCESS,
            payload:response.data.data
        });
        // console.log('SEARCH Brand', response.data.data);

    }catch(error){
        dispatch({type:BRAND_SEARCH_FAILURE, payload:error.response.data})
    }   
}
