import { RESOURCE_UPDATE_REQUEST, RESOURCE_UPDATE_SUCCESS, RESOURCE_UPDATE_FAILURE } from '../constants';
import axios from "axios";

import { getMyLocalData } from '../../config/getLocalStorageData';



// export const ResourceUpdateAction = (payload) => async (dispatch, getState) => {

//     //console.log("payload", payload);

//     const val = await getMyLocalData();

//     dispatch({ type: RESOURCE_UPDATE_REQUEST });

//     let data = {
//         "apiKey": val.apiKey,
//         "emp_id": val.emp_data.emp_id,
//         "resource_startdatetime": payload.startDate,
//         "resource_enddatetime": payload.endDate,
//         "work_order_resource_id": payload.work_order_resource_id
//         // "emp_id": "1",
//         // "resource_startdatetime":"2022-07-07 16:11:00",
//         // "resource_enddatetime":"2022-07-07 23:59:59",
//         // "work_order_resource_id":"1573"
//     }
//     // console.log("data", data);

//     try {
//         const response = await axios.post(API_URL + '/resourse-update/', data, {
//             headers: {
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${val.token}`
//             }
//         })
//         // console.log('updated data', response.data);

//         dispatch({
//             type: RESOURCE_UPDATE_SUCCESS,
//             payload: response.data.data
//         });

//     } catch (error) {
//         dispatch({ type: RESOURCE_UPDATE_FAILURE, payload: error.response.data })
//     }
// }