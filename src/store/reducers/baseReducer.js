import { BaseActionTypes } from "../actions/baseActions";

const initState = {
  mobile: window.innerWidth <= 500,
  systembolagetData: []
}

const baseReducer = (state = initState, action) => {
  switch(action.type) {
    case BaseActionTypes.WINDOW_RESIZE:
      console.log(BaseActionTypes.WINDOW_RESIE);
      return {
        ...state,
        mobile: action.mobile
      }

    case BaseActionTypes.GET_SYSTEMBOLAGET_DATA:
      console.log(BaseActionTypes.GET_SYSTEMBOLAGET_DATA);
      console.log(action.systembolagetData);
      return {
        ...state,
        systembolagetData: action.systembolagetData 
      }
    
    case BaseActionTypes.GET_SYSTEMBOLAGET_DATA_ERROR:
      console.log('Get systembolaget data error', action.error);
      return state;
      
    default:
      return state;
  }
}

export default baseReducer;