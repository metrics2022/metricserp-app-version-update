import { WORK_ORDER_REQUEST, WORK_ORDER_SUCCESS, WORK_ORDER_FAILURE, WORK_ORDER_DETAILS_REQUEST, WORK_ORDER_DETAILS_SUCCESS, WORK_ORDER_DETAILS_FAILURE, RESOURCE_UPDATE_REQUEST, RESOURCE_UPDATE_SUCCESS, RESOURCE_UPDATE_FAILURE  } from '../constants';


const initialState = {
  isLoading: false,
  allWorkOrders: [],
  workOrderDetails: "",
  errorMessage: ''
}

export const AllWorkOrdersReducers = (state = initialState, action) => {
  switch (action.type) {
    case WORK_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case WORK_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allWorkOrders: action.payload,
        errorMessage: ""
      };
    case WORK_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        allWorkOrders: [],
        errorMessage: action.payload
      }

    case WORK_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case WORK_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        workOrderDetails: action.payload,
        errorMessage: ""
      };
    case WORK_ORDER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        workOrderDetails:'',
        errorMessage: action.payload
      }

      case RESOURCE_UPDATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RESOURCE_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        workOrderDetails: action.payload,
        errorMessage: ""
      };
    case RESOURCE_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        workOrderDetails:'',
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
