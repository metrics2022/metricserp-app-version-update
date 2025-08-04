import axios from 'axios';
import { getMyLocalData } from '../../config/getLocalStorageData';
import { SALES_ORDER_ADD_TO_CART, SALES_ORDER_REMOVE_FROM_CART, SALES_ORDER_INCREMENT, SALES_ORDER_DECREMENT, SALES_ORDER_CART_LINE_NAME_CHANGE, SALES_ORDER_ADD_TO_CART_START, SALES_ORDER_ADD_TO_CART_SUCCESS, SALES_ORDER_ADD_TO_CART_FAILURE } from '../constants';
import { API_URL } from "@env"
import { API_URL_V1 } from '../../config/constant';

export const addToCart = (payload)=> {
    // console.log('cartproduct', payload);
    return{
        type:SALES_ORDER_ADD_TO_CART,
        payload
    }
}

export const removeToCart = (payload)=> {
    // console.log('dsfdsfdsf',payload);
    return{
        type:SALES_ORDER_REMOVE_FROM_CART,
        payload
    }
}

export const itemIncrement = (payload) => {
    return{
        type:SALES_ORDER_INCREMENT,
        payload
    }
}

export const itemDecrement = (payload) => {
    return{
        type:SALES_ORDER_DECREMENT,
        payload
    }
}

export const cartLineNameChange = (payload) => {
    return{
        type:SALES_ORDER_CART_LINE_NAME_CHANGE,
        payload
    }
}


export const handleAddToCart = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: SALES_ORDER_ADD_TO_CART_START });

    // console.log("payload", payload)

    try {
        const response = await axios.post(API_URL_V1+'add-to-cart', payload, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: SALES_ORDER_ADD_TO_CART_SUCCESS,
            payload: response.data.data
        });

        // console.log("response.data;", response.data)

        return response.data;

    } catch (error) {
        dispatch({ type: SALES_ORDER_ADD_TO_CART_FAILURE, payload: error.response.data })
        throw error;
    }
}