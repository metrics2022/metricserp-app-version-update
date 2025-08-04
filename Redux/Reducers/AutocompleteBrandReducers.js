import { BRAND_SEARCH_REQUEST, BRAND_SEARCH_SUCCESS, BRAND_SEARCH_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  allBrandList: [],
  errorMessage: ''
}

export const AutocompleteBrandReducers = (state = initialState, action) => {
  switch (action.type) {
    case BRAND_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BRAND_SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allBrandList: action.payload,
        errorMessage: ""
      };
    case BRAND_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        allBrandList: [],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
