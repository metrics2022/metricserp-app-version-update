import { SALES_ORDER_SUBMIT_REQUEST, SALES_ORDER_SUBMIT_SUCCESS, SALES_ORDER_SUBMIT_FAILURE} from '../constants';


const initialState = {
  isLoading: false,
  salesOrderData: "",
  collectedId:"",
  errorMessage: ''
}

export const SalesOrderSubmitReducers = (state = initialState, action) => {
  switch (action.type) {
    case SALES_ORDER_SUBMIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_ORDER_SUBMIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        salesOrderData: action.payload,
        errorMessage: ""
      };
    case SALES_ORDER_SUBMIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        salesOrderData:"",
        errorMessage: action.payload
      }
      case "SALES_ORDER_SUBMIT_RESET":
      return {
        ...state,
        isLoading: false,
        salesOrderData:"",
        errorMessage:""
      }
      case "STORE_ID":
      return {
        ...state,
        isLoading: false,
        collectedId:action.payload,
      }
    default:
      return state;
  }
}
