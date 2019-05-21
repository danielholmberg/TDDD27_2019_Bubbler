import { AuthActionTypes } from "../actions/authActions";

const initState = {
  isAuthenticated: false,
  user: null,
}

const authReducer = (state = initState, action) => {
  switch(action.type) {

    // SIGN IN
    case AuthActionTypes.SIGN_IN_USER:
      console.log(AuthActionTypes.SIGN_IN_USER);
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user
      }

    case AuthActionTypes.SIGN_IN_USER_ERROR:
      console.log('Sign in user error', action.error);
      return {
        ...state,
        isAuthenticated: false
      }

    // SIGN OUT
    case AuthActionTypes.SIGN_OUT_USER:
      console.log(AuthActionTypes.SIGN_OUT_USER);
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: null
      }

    case AuthActionTypes.SIGN_OUT_USER_ERROR:
      console.log('Sign out user error', action.error);
      return {
        ...state,
        isAuthenticated: true
      } 

    // CURRENT SESSION
    case AuthActionTypes.GET_CURRENT_USER_SESSION:
      console.log(AuthActionTypes.GET_CURRENT_USER_SESSION);
      return {
        ...state,
        isAuthenticated: action.isAuthenticated
      }

    case AuthActionTypes.GET_CURRENT_USER_SESSION_NO_USER:
      console.log('Get current user session error', action.error);
      return {
        ...state,
        isAuthenticated: false
      }

    // SIGN UP
    case AuthActionTypes.SIGN_UP_NEW_USER:
      console.log(AuthActionTypes.SIGN_UP_NEW_USER);
      return state;

    case AuthActionTypes.SIGN_UP_NEW_USER_ERROR:
      console.log('Sign up new user error', action.error);
      return state;

    case AuthActionTypes.CONFIRM_SIGN_UP:
      console.log(AuthActionTypes.CONFIRM_SIGN_UP);
      return state;

    case AuthActionTypes.CONFIRM_SIGN_UP_ERROR:
      console.log('Confirm sign up error', action.error);
      return state;

    case AuthActionTypes.GET_CURRENT_USER:
      console.log(AuthActionTypes.GET_CURRENT_USER);
      return {
        ...state,
        user: action.user
      };

    case AuthActionTypes.GET_CURRENT_USER_ERROR:
      console.log('Get current user error', action.error);
      return state;

    default:
      return state;
  }
}

export default authReducer;
