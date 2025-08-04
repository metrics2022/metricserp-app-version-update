import { WORK_ORDER_SEARCH_REQUEST, WORK_ORDER_SEARCH_SUCCESS, WORK_ORDER_SEARCH_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  workOrderSearchResult: [],
  errorMessage: ''
}

export const WorkOrderSearchReducers = (state = initialState, action) => {
  switch (action.type) {
    case WORK_ORDER_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case WORK_ORDER_SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        workOrderSearchResult: action.payload,
        errorMessage: ""
      };
    case WORK_ORDER_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        workOrderSearchResult: [],
        errorMessage: action.payload
      };
      case "WORK_ORDER_RESET":
        return {
          ...state,
          isLoading: false,
          workOrderSearchResult: [],
          errorMessage: ""
        }

    
    default:
      return state;
  }
}
