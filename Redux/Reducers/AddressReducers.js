import { GET_BILLTO_ADDRESS_REQUEST, GET_BILLTO_ADDRESS_SUCCESS, GET_BILLTO_ADDRESS_FAILURE, GET_SHIPTO_ADDRESS_REQUEST, GET_SHIPTO_ADDRESS_SUCCESS, GET_SHIPTO_ADDRESS_FAILURE } from '../constants';

const initialState = {
  isLoading: false,
  allBillToAddress: [],
  allShipToAddress: [],
  errorMessage: ''
}

export const AddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILLTO_ADDRESS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_BILLTO_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allBillToAddress: action.payload,
        errorMessage: ""
      };
    case GET_BILLTO_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        allBillToAddress: [],
        errorMessage: action.payload
      }
    case GET_SHIPTO_ADDRESS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SHIPTO_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allShipToAddress: action.payload,
        errorMessage: ""
      };
    case GET_SHIPTO_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        allShipToAddress: [],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}

