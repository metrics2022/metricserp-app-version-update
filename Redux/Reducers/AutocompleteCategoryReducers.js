import { CATEGORY_SEARCH_REQUEST, CATEGORY_SEARCH_SUCCESS, CATEGORY_SEARCH_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  allCategoryList: [],
  errorMessage: ''
}

export const AutocompleteCategoryReducers = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CATEGORY_SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allCategoryList: action.payload,
        errorMessage: ""
      };
    case CATEGORY_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        allCategoryList: [],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
