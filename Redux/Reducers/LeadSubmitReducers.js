import { SEARCH_LEAD_COMPANY_REQUEST, SEARCH_LEAD_COMPANY_SUCCESS, SEARCH_LEAD_COMPANY_FAILURE, SEARCH_LEAD_REQUEST, SEARCH_LEAD_SUCCESS, SEARCH_LEAD_FAILURE, LEAD_DETAILS_REQUEST, LEAD_DETAILS_SUCCESS, LEAD_DETAILS_FAILURE, LEAD_SUBMIT_REQUEST, LEAD_SUBMIT_SUCCESS, LEAD_SUBMIT_FAILURE, LEAD_ACTIVITIES_REQUEST, LEAD_ACTIVITIES_SUCCESS, LEAD_ACTIVITIES_FAILURE, LEAD_ACTIVITIES_CREATE_REQUEST, LEAD_ACTIVITIES_CREATE_SUCCESS, LEAD_ACTIVITIES_CREATE_FAILURE , LEAD_ACTIVITY_TYPE_SUCCESS , LEAD_ACTIVITY_TYPE_REQUEST , LEAD_ACTIVITY_TYPE_FAILURE } from '../constants';

const initialState = {
  isLoading: false,
  leadList: [],
  leadSearchResult: [],
  leadDetails: '',
  newLeadSubmit: '',
  errorMessage: '',
  leadSearchStatus: [],
  leadActivitiesCreate:[],
  leadActivity:[]
}
export const SearchLeadCompanyReducers = (state = initialState, action) => {
  //console.log('baafabf',action.payload.data);
  switch (action.type) {
    //Search for lead list
    case SEARCH_LEAD_COMPANY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEARCH_LEAD_COMPANY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leadList: action.payload,
        errorMessage: ""

      };
    case SEARCH_LEAD_COMPANY_FAILURE:
      return {
        ...state,
        isLoading: false,
        leadList: [],
        errorMessage: action.payload
      }

    //LEAD SEARCH
    case SEARCH_LEAD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEARCH_LEAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leadSearchResult: action.payload,
        errorMessage: ""

      };
    case SEARCH_LEAD_FAILURE:
      return {
        ...state,
        isLoading: false,
        leadSearchResult: [],
        errorMessage: action.payload
      }

    case "SEARCH_LEAD_RESET":
      return {
        ...state,
        isLoading: false,
        leadSearchResult: [],
        errorMessage: ""
      }
    //Lead detailes
    case LEAD_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LEAD_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leadDetails: action.payload,
        errorMessage: ""
      };
    case LEAD_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        leadDetails: '',
        errorMessage: action.payload
      }
    case "LEAD_DETAILS_RESET":
      return {
        ...state,
        isLoading: false,
        leadSearchResult: [],
        errorMessage: ""
      }
    //Lead Submit 
    case LEAD_SUBMIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LEAD_SUBMIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newLeadSubmit: action.payload,
        errorMessage: ""
      };
    case LEAD_SUBMIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        newLeadSubmit: "",
        errorMessage: action.payload
      }
    case "LEAD_SUBMIT_RESET":
      return {
        ...state,
        isLoading: false,
        newLeadSubmit: "",
        errorMessage: ""
      }
    case LEAD_ACTIVITIES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LEAD_ACTIVITIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newLeadActivities: action.payload,
        errorMessage: ""
      };
    case LEAD_ACTIVITIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        newLeadActivities: "",
        errorMessage: action.payload
      }
    case "LEAD_ACTIVITIES_RESET":
      return {
        ...state,
        isLoading: false,
        newLeadActivities: "",
        errorMessage: ""
      }

    case LEAD_ACTIVITIES_CREATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LEAD_ACTIVITIES_CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leadActivitiesCreate: action.payload,
        errorMessage: ""
      };
    case LEAD_ACTIVITIES_CREATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        leadActivitiesCreate: "",
        errorMessage: action.payload
      }
    case "LEAD_ACTIVITIES_CREATE_RESET":
      return {
        ...state,
        isLoading: false,
        leadActivitiesCreate: "",
        errorMessage: ""
      }

      case LEAD_ACTIVITY_TYPE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LEAD_ACTIVITY_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leadActivity: action.payload,
        errorMessage: ""
      };
    case LEAD_ACTIVITY_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        leadActivity: "",
        errorMessage: action.payload
      }
    case "LEAD_ACTIVITY_TYPE_RESET":
      return {
        ...state,
        isLoading: false,
        leadActivity: "",
        errorMessage: ""
      }

    default:
      return state;
  }
}