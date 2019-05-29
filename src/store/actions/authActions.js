import { Auth } from "aws-amplify"; 

export const AuthActionTypes = {
  SIGN_IN_USER: 'SIGN_IN_USER',
  SIGN_IN_USER_ERROR: 'SIGN_IN_USER_ERROR',
  SIGN_OUT_USER: 'SIGN_OUT_USER',
  SIGN_OUT_USER_ERROR: 'SIGN_OUT_USER_ERROR',
  GET_CURRENT_USER_SESSION: 'GET_CURRENT_USER_SESSION',
  GET_CURRENT_USER_SESSION_NO_USER: 'GET_CURRENT_USER_SESSION_NO_USER',
  SIGN_UP_NEW_USER: 'SIGN_UP_NEW_USER',
  SIGN_UP_NEW_USER_ERROR: 'SIGN_UP_NEW_USER_ERROR',
  CONFIRM_SIGN_UP: 'CONFIRM_SIGN_UP',
  CONFIRM_SIGN_UP_ERROR: 'CONFIRM_SIGN_UP_ERROR',
  GET_CURRENT_USER: 'GET_CURRENT_USER',
  GET_CURRENT_USER_ERROR: 'GET_CURRENT_USER_ERROR',
}

export const signInUser = (email, password) => {
  return async (dispatch, getState) => {
    try {
      await Auth.signIn(email, password);
      const user = await Auth.currentUserInfo();

      console.log('user', user);

      dispatch({
        type: AuthActionTypes.SIGN_IN_USER,
        isAuthenticated: true,
        user: user,
      });
    } catch (error) {
      dispatch({
        type: AuthActionTypes.SIGN_IN_USER_ERROR,
        isAuthenticated: false,
        error: error
      });
      throw error;
    }
  }
}

export const signOutUser = () => {
  return async (dispatch, getState) => {
    try {
      await Auth.signOut();

      dispatch({
        type: AuthActionTypes.SIGN_OUT_USER,
        isAuthenticated: false,
        user: null
      });
    } catch (error) {
      dispatch({
        type: AuthActionTypes.SIGN_OUT_USER_ERROR,
        isAuthenticated: true,
        error: error
      });
    }
  }
}

export const getCurrentUserSession = () => {
  return async (dispatch, getState) => {
    try {
      await Auth.currentSession();

      dispatch({
        type: AuthActionTypes.GET_CURRENT_USER_SESSION,
        isAuthenticated: true
      });
    } catch (error) {
      dispatch({
        type: AuthActionTypes.GET_CURRENT_USER_SESSION_NO_USER,
        isAuthenticated: false,
        error: error
      });
    }
  }
}

export const signUpNewUser = (username, password) => {
  return async (dispatch, getState) => {
    try {
      await Auth.signUp({ 
        'username': username,
        'password': password, 
        'attributes': {
          'name': username.split('@')[0],
        } 
      });
      
      dispatch({
        type: AuthActionTypes.SIGN_UP_NEW_USER
      });
    } catch (error) {
      if(error === 'UsernameExistsException') {
        Auth.resendSignUp();
      }
      dispatch({
        type: AuthActionTypes.SIGN_UP_NEW_USER_ERROR,
        error: error
      });
    }
  }
}

export const confirmSignUp = (email, confirmationCode) => {
  return async (dispatch, getState) => {
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      
      dispatch({
        type: AuthActionTypes.CONFIRM_SIGN_UP
      });
    } catch (error) {
      dispatch({
        type: AuthActionTypes.CONFIRM_SIGN_UP_ERROR,
        error: error
      });
    }
  }
}

export const getCurrentUser = () => {
  return async (dispatch, getState) => {
    try {
      const user = await Auth.currentUserInfo();

      dispatch({
        type: AuthActionTypes.GET_CURRENT_USER,
        user: user
      })
    } catch (error) {
      dispatch({
        type: AuthActionTypes.GET_CURRENT_USER_ERROR,
        error: error
      })
    }
  }
}