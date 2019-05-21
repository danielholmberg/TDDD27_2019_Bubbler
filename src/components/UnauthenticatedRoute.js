import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * This method takes the querystring param we want to read and returns it.
 */
function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Here we are checking to ensure that the user is not authenticated before we render 
 * the component that is passed in. And in the case where the user is authenticated, 
 * we use the Redirect component to simply send the user to the homepage.
 */
const UnauthenticatedRoute = ({ component: Component, props, ...rest }) => {
  console.log('UnauthRoute:', props)
  const redirect = querystring("redirect");
  return (
    <Route
      {...rest}
      render={() =>
        !props.auth.isAuthenticated
          ? <Component/>
          : <Redirect
              to={redirect === "" || redirect === null ? "/" : redirect}
            />}
    />
  );
}

export default UnauthenticatedRoute;