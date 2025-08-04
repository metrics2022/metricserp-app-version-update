import { SASS_LOGIN_REQUEST, SASS_LOGIN_SUCCESS, SASS_LOGIN_FAILURE } from '../constants';

const initialState = {
  isLoading: false,
  sassLoginData: [],
  errorMessage: ''
}

export const SassLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SASS_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SASS_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sassLoginData: action.payload,
        errorMessage: ""
      };
    case SASS_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        sassLoginData: [],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}

