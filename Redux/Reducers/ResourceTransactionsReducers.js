import { RESOURCE_TRANSACTIONS_SEARCH_REQUEST, RESOURCE_TRANSACTIONS_SEARCH_SUCCESS, RESOURCE_TRANSACTIONS_SEARCH_FAILURE, RESOURCE_TRANSACTIONS_DETAILS_REQUEST, RESOURCE_TRANSACTIONS_DETAILS_SUCCESS, RESOURCE_TRANSACTIONS_DETAILS_FAILURE, RESOURCE_WORK_ORDER_SEARCH_REQUEST, RESOURCE_WORK_ORDER_SEARCH_SUCCESS, RESOURCE_WORK_ORDER_SEARCH_FAILURE, SELECTED_RESOURCE_WORK_ORDER_SEARCH_REQUEST, SELECTED_RESOURCE_WORK_ORDER_SEARCH_SUCCESS, SELECTED_RESOURCE_WORK_ORDER_SEARCH_FAILURE, RESOURCE_CODE_SEARCH_REQUEST, RESOURCE_CODE_SEARCH_SUCCESS, RESOURCE_CODE_SEARCH_FAILURE, SELECTED_RESOURCE_CODE_SEARCH_REQUEST, SELECTED_RESOURCE_CODE_SEARCH_SUCCESS, SELECTED_RESOURCE_CODE_SEARCH_FAILURE, RESOURCE_SUBMIT_REQUEST, RESOURCE_SUBMIT_SUCCESS, RESOURCE_SUBMIT_FAILURE, WORK_ORDER_FIND_START, WORK_ORDER_FIND_SUCCESS, WORK_ORDER_FIND_FAILURE,WO_DETAILS_REQUEST, WO_DETAILS_SUCCESS, WO_DETAILS_FAILURE} from '../constants';

const initialState = {
    isLoading: false,
    ResourceSearchResult: [],
    ResourceTransactionDetails: '',
    allWorkOrders: [],
    allResourceCode: [],
    selectedWorkOrder:[],
    selectedResCode: [],
    newResourceSubmit: '',
    errorMessage: '',
    operationLists:[],
    workOrderLists:[],
    headerData:''
}

//RESOURCE_TRANSACTIONS SEARCH
export const ResourceTransactionsReducers = (state = initialState, action) => {
    switch (action.type) {
        case RESOURCE_TRANSACTIONS_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RESOURCE_TRANSACTIONS_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ResourceSearchResult: action.payload,
                errorMessage: ""
            };
        case RESOURCE_TRANSACTIONS_SEARCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                ResourceSearchResult: [],
                errorMessage: action.payload
            };
        case "RESOURCE_TRANSACTIONS_SEARCH_RESET":
            return {
                ...state,
                isLoading: false,
                ResourceSearchResult: [],
                errorMessage: ""
            };
        // RESOURCE_TRANSACTIONS DETAILS
        case RESOURCE_TRANSACTIONS_DETAILS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RESOURCE_TRANSACTIONS_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ResourceTransactionDetails: action.payload,
                errorMessage: ""
            };
        case RESOURCE_TRANSACTIONS_DETAILS_FAILURE:
            return {
                ...state,
                isLoading: false,
                ResourceTransactionDetails: '',
                errorMessage: action.payload
            };
        case RESOURCE_WORK_ORDER_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RESOURCE_WORK_ORDER_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allWorkOrders: action.payload,
                errorMessage: ""
            };
        case RESOURCE_WORK_ORDER_SEARCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                allWorkOrders: [],
                errorMessage: action.payload
            };
        case SELECTED_RESOURCE_WORK_ORDER_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SELECTED_RESOURCE_WORK_ORDER_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                selectedWorkOrder: action.payload,
                errorMessage: ""
            };
        case SELECTED_RESOURCE_WORK_ORDER_SEARCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                selectedWorkOrder: [],
                errorMessage: action.payload
                    }
        case "SELECTED_RESOURCE_WORK_ORDER_SEARCH_RESET":
            return {
                ...state,
                isLoading: false,
                selectedWorkOrder: [],
                errorMessage: ""
            }
        case RESOURCE_CODE_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RESOURCE_CODE_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allResourceCode: action.payload,
                errorMessage: ""
            };
        case RESOURCE_CODE_SEARCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                allResourceCode: [],
                errorMessage: action.payload
            };
        case SELECTED_RESOURCE_CODE_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SELECTED_RESOURCE_CODE_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                selectedResCode: action.payload,
                errorMessage: ""
            };
        case SELECTED_RESOURCE_CODE_SEARCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                selectedResCode: [],
                errorMessage: action.payload
            }
        case "SELECTED_RESOURCE_CODE_SEARCH_RESET":
            return {
                ...state,
                isLoading: false,
                selectedResCode: [],
                errorMessage: ""
            }
        //Resource Submit
        case RESOURCE_SUBMIT_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RESOURCE_SUBMIT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                newResourceSubmit: action.payload,
                errorMessage: ""
            };
        case RESOURCE_SUBMIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                newResourceSubmit: "",
                errorMessage: action.payload
            }

        //Resource Submit

        //Work ORDER SEARCH
        case WORK_ORDER_FIND_START:
            return {
                ...state,
                isLoading: true,
            };
        case WORK_ORDER_FIND_SUCCESS:
            return {
                ...state,
                isLoading: false,
                workOrderLists: action.payload,
                errorMessage: ""
            };
        case WORK_ORDER_FIND_FAILURE:
            return {
                ...state,
                isLoading: false,
                workOrderLists: "",
                errorMessage: action.payload
            }
        //Work ORDER SEARCH    

         //WO DETAILS
         case WO_DETAILS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case  WO_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                operationLists: action.payload?.Serach_result,
                headerData:action.payload?.header_data,
                errorMessage: ""
            };
        case  WO_DETAILS_FAILURE:
            return {
                ...state,
                isLoading: false,
                operationLists:'',
                headerData:'',
                errorMessage: action.payload
            }

        case  "WO_DETAILS_RESET":
            return {
              ...state,
              isLoading: false,
              operationLists:"",
              headerData:"",
              errorMessage: ""
            }
        //WO DETAILS  
        case "RESOURCE_SUBMIT_RESET":
            return {
                ...state,
                isLoading: false,
                newResourceSubmit: "",
                errorMessage: ""
            }

        default:
            return state;
    }
}
