import { API } from "aws-amplify";

export const BaseActionTypes = {
  WINDOW_RESIZE: 'WINDOW_RESIZE',
  GET_SYSTEMBOLAGET_DATA: 'GET_SYSTEMBOLAGET_DATA',
  GET_SYSTEMBOLAGET_DATA_ERROR: 'GET_SYSTEMBOLAGET_DATA_ERROR',
  SET_WSS_CLIENT: 'SET_WSS_CLIENT',
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