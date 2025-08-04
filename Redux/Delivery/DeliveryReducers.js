import { DELIVERY_REQUEST_START, DELIVERY_REQUEST_SUCCESS, DELIVERY_REQUEST_FAILURE , DELIVERY_CONFIRM_REQUEST_START, DELIVERY_CONFIRM_REQUEST_SUCCESS, DELIVERY_CONFIRM_REQUEST_FAILURE } from '../constants';

const initialState = {
  isLoading: false,
  allDelivery: [],
  deliveryCompletion: "",
  errorMessage: "",
}

export const DeliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELIVERY_REQUEST_START:
      return {
        ...state,
        isLoading: true,
      };
    case DELIVERY_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allDelivery: action.payload,
        errorMessage: ""
      };
    case DELIVERY_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        allDelivery: [],
        errorMessage: action.payload
      }

    case DELIVERY_CONFIRM_REQUEST_START:
      return {
        ...state,
        isLoading: true,
      };
    case DELIVERY_CONFIRM_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deliveryCompletion: action.payload,
        errorMessage: ""
      };
    case DELIVERY_CONFIRM_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        deliveryCompletion: "",
        errorMessage: action.payload
      }

    case "DELIVERY_RESET":
      return {
        ...state,
        isLoading: false,
        deliveryCompletion:"",
        errorMessage:""
      }     
    default:
      return state;
  }
}
