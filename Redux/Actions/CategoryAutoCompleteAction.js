import { CATEGORY_SEARCH_REQUEST, CATEGORY_SEARCH_SUCCESS, CATEGORY_SEARCH_FAILURE } from '../constants';
import axios from "axios";
import { API_URL } from '../../config/constant';
import { getMyLocalData } from '../../config/getLocalStorageData';


export const CategoryAutoComplete = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:CATEGORY_SEARCH_REQUEST});
    
    let data = {
        "apiKey":  val.apiKey,
        "keyword": payload,
    }
    try{
        const response = await axios.post(API_URL + '/category-autocomplete', data, {
            headers:{
                'content-type': 'application/json',                                    
                'Authorization': `Bearer ${val.token}`
            }
        }) 
        
        dispatch({
            type:CATEGORY_SEARCH_SUCCESS,
            payload: response.data.data.categories
        });
        // console.log('Search CATEGORY', response.data.data.categories);

    }catch(error){
        dispatch({type:CATEGORY_SEARCH_FAILURE, payload:error.response.data})
    }   
}
