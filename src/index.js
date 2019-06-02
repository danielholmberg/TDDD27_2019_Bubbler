import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import config from "./config";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './store/reducers/rootReducer';

/**
 *  - Amplify refers to Cognito as Auth, S3 as Storage, and API Gateway as API.
 *  - The mandatorySignIn flag for Auth is set to true because we want our users 
 *    to be signed in before they can interact with our app.
 *  - The name-attribute is basically telling Amplify that we want to name our API in order
 *    to reference the exact endpoint later in the code. 
 *    Amplify allows you to add multiple APIs that your app is going to work with. 
 *    In our case our entire backend is just one single API.

The Amplify.configure() is just setting the various AWS resources that we want to interact with. 
It isn’t doing anything else special here beside configuration.
 */
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.prod.cognito.REGION,
    userPoolId: config.prod.cognito.USER_POOL_ID,
    identityPoolId: config.prod.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.prod.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.prod.s3.REGION,
    bucket: config.prod.s3.BUCKET,
    identityPoolId: config.prod.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "REST",
        endpoint: config.prod.apiGateway.URL,
        region: config.prod.apiGateway.REGION
      },
    ]
  }
});

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
