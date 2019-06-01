import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * This component is similar to the AppliedRoute component. The main difference being 
 * that we look at the props that are passed in to check if a user is authenticated. 
 * If the user is authenticated, then we simply render the passed in component. And if 
 * the user is not authenticated, then we use the Redirect React Router v4 component 
 * to redirect the user to the login page. We also pass in the current path to the 
 * login page (redirect in the querystring) which we can use to redirect the user back 
 * after the user logs in.
 */
const AuthenticatedRoute = ({ component: Component, props, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => 
        props.auth.isAuthenticated 
          ? <Component /> 
          : <Redirect 
              to={`/login?redirect=${props.location.pathname}${props.location.search}`} 
            />
      }
    />
  );
}

export default AuthenticatedRoute;