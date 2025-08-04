import { RESOURCE_UPDATE_REQUEST, RESOURCE_UPDATE_SUCCESS, RESOURCE_UPDATE_FAILURE  } from '../constants';


const initialState = {
  isLoading: false,
  updateMesage: "",
  errorMessage: ''
}

export const ResourceUpdateReducers = (state = initialState, action) => {
  switch (action.type) {
    case RESOURCE_UPDATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RESOURCE_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateMesage: action.payload,
        errorMessage: ""
      };
    case RESOURCE_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        updateMesage:'',
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
