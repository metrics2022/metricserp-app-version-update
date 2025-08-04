import { ALL_ORGANIZATION_REQUEST, ALL_ORGANIZATION_SUCCESS, ALL_ORGANIZATION_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  allBranchs:[],
  errorMessage: ''
}

export const AllOrganizationReducers = (state = initialState, action) => {
  switch (action.type) {
    case ALL_ORGANIZATION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ALL_ORGANIZATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allBranchs: action.payload,
        errorMessage: ""
      };
    case ALL_ORGANIZATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        allBranchs:[],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
