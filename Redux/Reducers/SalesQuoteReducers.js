import { SALES_QUOTE_REQUEST, SALES_QUOTE_SUCCESS, SALES_QUOTE_FAILURE, SALES_QUOTE_DETAILS_REQUEST, SALES_QUOTE_DETAILS_SUCCESS, SALES_QUOTE_DETAILS_FAILURE, SALESQUOTE_CUSTOMER_REQUEST, SALESQUOTE_CUSTOMER_SUCCESS, SALESQUOTE_CUSTOMER_FAILURE,SQ_TERMS_TEMPLATE_REQUEST, SQ_TERMS_TEMPLATE_SUCCESS, SQ_TERMS_TEMPLATE_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  allSalesQuotes: [],
  sqCustomerSearchResult: [],
  salesQuoteDetails: "",
  SqDefaultTermsTemplate: "",
  errorMessage: '',
}

export const salesQuoteReducers = (state = initialState, action) => {
  switch (action.type) {
    case SALES_QUOTE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_QUOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSalesQuotes: action.payload,
        errorMessage: ""
      };

    case SALES_QUOTE_FAILURE:
      return {
        ...state,
        isLoading: false,
        allSalesQuotes: [],
        errorMessage: action.payload
      }

    case SALES_QUOTE_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_QUOTE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        salesQuoteDetails: action.payload,
        errorMessage: ""
      };
    case SALES_QUOTE_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        salesQuoteDetails: '',
        errorMessage: action.payload
      }
    case SALESQUOTE_CUSTOMER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALESQUOTE_CUSTOMER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sqCustomerSearchResult: action.payload,
        errorMessage: ""

      };
    case SALESQUOTE_CUSTOMER_FAILURE:
      return {
        ...state,
        isLoading: false,
        sqCustomerSearchResult: [],
        errorMessage: action.payload
      }

    case SQ_TERMS_TEMPLATE_REQUEST:
        return {
          ...state,
          isLoading: true,
    };
    case SQ_TERMS_TEMPLATE_SUCCESS:
        return {
          ...state,
          isLoading: false,
          SqDefaultTermsTemplate: action.payload,
          errorMessage: ""
  
    };
    case SQ_TERMS_TEMPLATE_FAILURE:
        return {
          ...state,
          isLoading: false,
          SqDefaultTermsTemplate: '',
          errorMessage: action.payload
    }
    case "SALESQUOTE_CUSTOMER_RESET":
      return {
        ...state,
        isLoading: false,
        sqCustomerSearchResult: [],
        errorMessage: ""
      }
    default:
      return state;
  }
}
