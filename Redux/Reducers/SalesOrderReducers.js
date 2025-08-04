import { SALES_ORDER_REQUEST, SALES_ORDER_SUCCESS, SALES_ORDER_FAILURE, SALES_ORDER_DETAILS_REQUEST, SALES_ORDER_DETAILS_SUCCESS, SALES_ORDER_DETAILS_FAILURE,GET_CUST_OUTSTANDING_REQUEST, GET_CUST_OUTSTANDING_SUCCESS, GET_CUST_OUTSTANDING_FAILURE, GET_CUST_PENDING_INVOICES_REQUEST, GET_CUST_PENDING_INVOICES_SUCCESS, GET_CUST_PENDING_INVOICES_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  allSalesOrders: [],
  salesOrderDetails: "",
  errorMessage: "",
  custOutstanding:"",
  custPendingInvoices:[]
}

export const AllSalesOrderReducers = (state = initialState, action) => {
  switch (action.type) {
    case SALES_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSalesOrders: action.payload,
        errorMessage: ""
      };
    case SALES_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        allSalesOrders: [],
        errorMessage: action.payload
      }

    case SALES_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SALES_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        salesOrderDetails: action.payload,
        errorMessage: ""
      };
    case SALES_ORDER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        salesOrderDetails:'',
        errorMessage: action.payload
      };
      case GET_CUST_OUTSTANDING_REQUEST:
        return {
          ...state,
          isLoading: true,
        };
      case GET_CUST_OUTSTANDING_SUCCESS:
        return {
          ...state,
          isLoading: false,
          custOutstanding: action.payload,
          errorMessage: ""
        };
      case GET_CUST_OUTSTANDING_FAILURE:
        return {
          ...state,
          isLoading: false,
          custOutstanding:"",
          errorMessage: action.payload
        }

      case "CUST_OUTSTANDING_RESET":
        return {
          ...state,
          isLoading: false,
          custOutstanding:"",
          errorMessage:""
      }     
      case GET_CUST_PENDING_INVOICES_REQUEST:
          return {
            ...state,
            isLoading: true,
          };     
      case GET_CUST_PENDING_INVOICES_SUCCESS:
          return {
            ...state,
            isLoading: false,
            custPendingInvoices: action.payload,
            errorMessage: ""
          };
      case GET_CUST_PENDING_INVOICES_FAILURE:
          return {
            ...state,
            isLoading: false,
            custPendingInvoices:'',
            errorMessage: action.payload
          }
    default:
      return state;
  }
}
