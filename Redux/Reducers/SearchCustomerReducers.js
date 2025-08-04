import { SEARCH_CUSTOMER_REQUEST, SEARCH_CUSTOMER_SUCCESS, SEARCH_CUSTOMER_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE, CUSTOMER_SITES_REQUEST, CUSTOMER_SITES_SUCCESS, CUSTOMER_SITES_FAILURE, CUSTOMER_CONTACTS_REQUEST, CUSTOMER_CONTACTS_SUCCESS, CUSTOMER_CONTACTS_FAILURE } from '../constants';


const initialState = {
  isLoading: false,
  customerList: [],
  SearchResult: [],
  customerSites: [],
  customerContacts: [],
  errorMessage: '',
  // categoryKey: '',
  // brandKey: '',
  // productsKey: '',
  // catId: '',
  // brandId: '',
  searchAllValues: {
    category: {},
    brand: {},
    searchValue: ''
  },
}

export const SearchCustomerReducers = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_CUSTOMER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEARCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customerList: action.payload,
        errorMessage: ""
      };
    case SEARCH_CUSTOMER_FAILURE:
      return {
        ...state,
        isLoading: false,
        customerList: [],
        errorMessage: action.payload
      }

    case SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        SearchResult: action.payload,
        errorMessage: ""
      };
    case SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        SearchResult: [],
        errorMessage: action.payload
      }
    // case 'SAVE_SEARCH':
    //   // console.log("action.payload", action)
    //   return {
    //     ...state,
    //     categoryKey: action.payload.catName,
    //     brandKey: action.payload.brandName,
    //     productsKey: action.payload.value,
    //     catId: action.payload.categoryId,
    //     brandId: action.payload.brandId
    //   }

      case "UPDATE_CATEGORY":
      return {
        ...state,
        searchAllValues: {
          ...state.searchAllValues,
          category: action.payload,
        },
      };
    case "UPDATE_BRAND":
      return {
        ...state,
        searchAllValues: {
          ...state.searchAllValues,
          brand: action.payload,
        },
      };
    case "UPDATE_SEARCH_VALUE":
      return {
        ...state,
        searchAllValues: {
          ...state.searchAllValues,
          searchValue: action.payload,
        },
      };

    case "SEARCH_RESET":
      return {
        ...state,
        // categoryKey: '',
        // brandKey: '',
        // productsKey: '',
        // catId: '',
        // brandId: '',
        searchAllValues: {
          category: {},
          brand: {},
          searchValue: ''
        }
      }

    case "SEARCH_LIST_RESET":
      return{
        ...state,
        SearchResult:[]
      }
    case CUSTOMER_SITES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CUSTOMER_SITES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customerSites: action.payload,
        errorMessage: ""
      };
    case CUSTOMER_SITES_FAILURE:
      return {
        ...state,
        isLoading: false,
        customerSites: [],
        errorMessage: action.payload
      }
    case CUSTOMER_CONTACTS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CUSTOMER_CONTACTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customerContacts: action.payload,
        errorMessage: ""
      };
    case CUSTOMER_CONTACTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        customerContacts: [],
        errorMessage: action.payload
      }
    default:
      return state;
  }
}

