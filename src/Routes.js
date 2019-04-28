import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";

// Components
import AppliedRoute from './components/AppliedRoute.js';
import AuthenticatedRoute from "./components/AuthenticatedRoute.js";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.js";

const MyLoadingComponent = ({error, timedOut, retry, pastDelay}) => {
  if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else if (timedOut) {
    return <div>Taking a long time... <button onClick={retry}>Retry</button></div>;
  } else if (pastDelay) {
    return <div>Bubbling...</div>;
  } else {
    return null;
  }
};

// Containers
const AsyncHome = Loadable({
  loader: () => import("./containers/Home/Home.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
const AsyncLogin = Loadable({
  loader: () => import("./containers/Login/Login.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
const AsyncSignup = Loadable({
  loader: () => import("./containers/Signup/Signup.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
const AsyncNewWine = Loadable({
  loader: () => import("./containers/NewWine/NewWine.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
const AsyncWines = Loadable({
  loader: () => import("./containers/Wines/Wines.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
const AsyncNotFound404 = Loadable({
  loader: () => import("./containers/NotFound404/NotFound404.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 300, // 0.3 seconds
});
/**
 * This component uses this Switch component from React-Router that 
 * renders the first matching route that is defined within it. 
 * The first route looks for / and renders the Home component when matched. 
 * We are also using the exact prop to ensure that it matches the / route exactly. 
 * This is because the path / will also match any route that starts with a /.
 * 
 * By using the route path /wines/:id we are telling the router to send all matching 
 * routes to our component Wines. This will also end up matching the route /wines/new 
 * with an id of new. To ensure that doesn’t happen, we put our /wines/new route before 
 * the pattern matching one.
 */
export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={AsyncLogin} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={AsyncSignup} props={childProps} />
    <AuthenticatedRoute path="/wines/new" exact component={AsyncNewWine} props={childProps} />
    <AuthenticatedRoute path="/wines/:id" exact component={AsyncWines} props={childProps} />


    { /* Finally, catch all unmatched routes */ }
    <Route component={AsyncNotFound404} />
  </Switch>;