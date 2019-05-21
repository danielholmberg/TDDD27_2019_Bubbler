import React from "react";
import { Route } from "react-router-dom";

/**
 * This simple component creates a Route where the child component 
 * that it renders contains the passed in props. 
 * 
 * The props variable in this case is what the Route component passes us. 
 * Whereas, the cProps is the childProps that we want to set.
 */
const AppliedRoute = ({ component: Component, ...rest }) =>
  <Route {...rest} render={() => <Component/>} />;

export default AppliedRoute;
