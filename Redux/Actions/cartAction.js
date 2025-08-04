import axios from 'axios';
import { getMyLocalData } from '../../config/getLocalStorageData';
import { ADD_TO_CART, REMOVE_FROM_CART, INCREMENT, DECREMENT, CART_LINE_NAME_CHANGE, ADD_TO_CART_START, ADD_TO_CART_SUCCESS, ADD_TO_CART_FAILURE, ADD_TO_CART_FROM_QUOTE } from '../constants';
import { API_URL } from "@env"
import { API_URL_V1 } from '../../config/constant';

export const addToCart = (payload)=> {
    // console.log('cartproduct', payload);
    return{
        type:ADD_TO_CART,
        payload
    }
}

export const addToCartFromQuote = (payload)=> {
    // console.log('cartproduct', payload);
    return{
        type:ADD_TO_CART_FROM_QUOTE,
        payload
    }
}

export const removeToCart = (payload)=> {
    // console.log('dsfdsfdsf',payload);
    return{
        type:REMOVE_FROM_CART,
        payload
    }
}

export const itemIncrement = (payload) => {
    return{
        type:INCREMENT,
        payload
    }
}

export const itemDecrement = (payload) => {
    return{
        type:DECREMENT,
        payload
    }
}

export const cartLineNameChange = (payload) => {
    return{
        type:CART_LINE_NAME_CHANGE,
        payload
    }
}


export const handleAddToCart = (payload) => async (dispatch, getState) => {
    const val = await getMyLocalData();
    dispatch({ type: ADD_TO_CART_START });

    // console.log("payload", payload)

    try {
        const response = await axios.post(API_URL_V1+'add-to-cart', payload, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${val.token}`
            }
        })

        dispatch({
            type: ADD_TO_CART_SUCCESS,
            payload: response.data.data
        });

        // console.log("response.data;", response.data)

        return response.data;

    } catch (error) {
        dispatch({ type: ADD_TO_CART_FAILURE, payload: error.response.data })
        throw error;
    }
}