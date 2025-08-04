import { GLOBAL_DATA_REQUEST, GLOBAL_DATA_SUCCESS, GLOBAL_DATA_FAILURE } from '../constants';


const initialState = {
  isLoggedIn: false,
  getGlobalData: "",
  errorMessage: ''
}

export const GlobalDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_DATA_REQUEST:
      return {
        ...state,
        isLoggedIn: true,
      };
    case GLOBAL_DATA_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        getGlobalData: action.payload
      };
    case GLOBAL_DATA_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        errorMessage: action.payload,
        getGlobalData: ""
      }
    default:
      return state;
  }
}
