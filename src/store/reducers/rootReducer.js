import { combineReducers } from 'redux';

import baseReducer from './baseReducer.js'
import authReducer from './authReducer.js';
import postsReducer from './postsReducer.js';

const rootReducer = combineReducers({
    base: baseReducer,
    auth: authReducer,
    posts: postsReducer,
  }
)

export default rootReducer;