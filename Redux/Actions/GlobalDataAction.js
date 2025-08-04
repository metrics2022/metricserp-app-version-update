import { GLOBAL_DATA_REQUEST, GLOBAL_DATA_SUCCESS, GLOBAL_DATA_FAILURE } from '../constants';
import axios from "axios";
import { API_URL_V1 } from '../../config/constant';

export const globalDataAction = (payload)=> async (dispatch, getState)=> {

    dispatch({type:GLOBAL_DATA_REQUEST});

    let data = {
        "apiKey": payload.apiKey
    }
    try{
        const response = await axios.post(API_URL_V1+'global-data', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${payload.token}`
            }
        })
        //console.log("sadassd", response.data)
        dispatch({
            type:GLOBAL_DATA_SUCCESS,
            payload:response.data
        });
        //console.log("sadassd", response.data)


    }catch(error){
        dispatch({type:GLOBAL_DATA_FAILURE, payload:error.response.data})
    }
}
