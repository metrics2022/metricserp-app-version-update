import { SALES_QUOTE_SUBMIT_REQUEST, SALES_QUOTE_SUBMIT_SUCCESS, SALES_QUOTE_SUBMIT_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  salesQuoteData: "",
  collectedId:"",
  errorMessage: ''
}

export const SalesQuoteSubmitReducers = (state = initialState, action) => {
  switch (action.type) {
    case SALES_QUOTE_SUBMIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_QUOTE_SUBMIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        salesQuoteData: action.payload,
        errorMessage: ""
      };
    case SALES_QUOTE_SUBMIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        salesQuoteData:"",
        errorMessage: action.payload
      }
      case "SALES_QUOTE_SUBMIT_RESET":
      return {
        ...state,
        isLoading: false,
        salesQuoteData:"",
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
