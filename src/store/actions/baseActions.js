import { API } from "aws-amplify";
//import * as  AmazonCognitoIdentity from "amazon-cognito-identity-js";

export const BaseActionTypes = {
  WINDOW_RESIZE: 'WINDOW_RESIZE',
  GET_SYSTEMBOLAGET_DATA: 'GET_SYSTEMBOLAGET_DATA',
  GET_SYSTEMBOLAGET_DATA_ERROR: 'GET_SYSTEMBOLAGET_DATA_ERROR',
  SET_WSS_CLIENT: 'SET_WSS_CLIENT',
  UPDATE_USER_ATTRIBUTES: 'UPDATE_USER_ATTRIBUTES',
  UPDATE_USER_ATTRIBUTES_ERROR: 'UPDATE_USER_ATTRIBUTES_ERROR',
}

export const windowResize = () => {
  return (dispatch, getState) => {
    dispatch({
      type: BaseActionTypes.WINDOW_RESIZE,
      mobile: window.innerWidth <= 500
    });
  }
}

export const getSystembolagetData = () => {
  return async (dispatch, getState) => {
    try {
      const data = await API.get("REST", "/systembolaget");

      dispatch({
        type: BaseActionTypes.GET_SYSTEMBOLAGET_DATA,
        systembolagetData: data
      });
    } catch (error) {
      dispatch({
        type: BaseActionTypes.GET_SYSTEMBOLAGET_DATA_ERROR,
        error: error
      })
    }
  }
}

export const setWSSClient = (wss) => {
  return (dispatch, getState) => {
    dispatch({
      type: BaseActionTypes.SET_WSS_CLIENT,
      wss: wss
    });
  }
}

// Not in use at the moment, useful to change user attributes later on.
/*
export const updateUserAttributes = (attributes) => {
  return async (dispatch, getState) => {
    try {
      var attributeList = [];
      var attribute = {
          Name : 'nickname',
          Value : attributes.name
      };
      var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
      attributeList.push(attribute);
  
      getState().auth.user.updateAttributes(attributeList, function(err, result) {
          if (err) {
              alert(err);
              return;
          }
          console.log('call result: ' + result);
      });

      dispatch({
        type: BaseActionTypes.UPDATE_USER_ATTRIBUTES,
        attributes: attributes
      });
    } catch (error) {
      dispatch({
        type: BaseActionTypes.UPDATE_USER_ATTRIBUTES_ERROR,
        error: error
      });
    }
  }
}*/