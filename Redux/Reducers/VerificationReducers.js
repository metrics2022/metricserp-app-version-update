import { VERIFY_REQUEST, VERIFY_SUCCESS, VERIFY_FAILURE, RESEND_OTP_REQUEST, RESEND_OTP_SUCCESS, RESEND_OTP_FAILURE, LOGOUT } from '../constants';


const initialState = {
  isLoggedIn: false,
  isLoading:false,
  verifyData: "",
  errorMessage: "",
  resendOtpData:""
}

export const VerificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_REQUEST:
      return {
        ...state,
        isLoggedIn: true,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        verifyData: action.payload
      };
    case VERIFY_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        errorMessage: action.payload,
        verifyData: ""
      }

    case RESEND_OTP_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RESEND_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        resendOtpData: action.payload
      };
    case RESEND_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
        resendOtpData: ""
    }
    case "RESET_OTP_DATA":
      return {
        ...state,
        isLoggedIn: false,
        errorMessage: "",
        resendOtpData:"",
        verifyData: "",
    }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        verifyData: ""
      }
    default:
      return state;
  }
}
