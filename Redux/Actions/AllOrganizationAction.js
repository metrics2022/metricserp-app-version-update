import { ALL_ORGANIZATION_REQUEST, ALL_ORGANIZATION_SUCCESS, ALL_ORGANIZATION_FAILURE } from '../constants';
import axios from "axios";
import {API_URL, API_KEY, AUTH_KEY} from "@env"
import { getMyLocalData } from '../../config/getLocalStorageData';


export const AllOrganizationAction = (payload)=> async (dispatch, getState)=> {

    const val = await getMyLocalData();

    dispatch({type:ALL_ORGANIZATION_REQUEST});

    let data = {
        "apiKey": val.apiKey,
        "emp_id": payload,
    }
    try{
        const response = await axios.post(API_URL+'/branches', data,{
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type:ALL_ORGANIZATION_SUCCESS,
            payload:response.data.data
        });

        // console.log('salesOrg', response.data.data);

    }catch(error){
        dispatch({type:ALL_ORGANIZATION_FAILURE, payload:error.response.data})
    }
}
