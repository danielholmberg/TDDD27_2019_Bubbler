import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home/Home.js";
import Login from "./containers/Login/Login.js";
import AppliedRoute from './components/AppliedRoute.js';
import Signup from "./containers/Signup/Signup.js";
import NotFound404 from "./containers/NotFound404/NotFound404.js";
import NewWine from "./containers/NewWine/NewWine.js";
import Wines from "./containers/Wines/Wines.js";
import AuthenticatedRoute from "./components/AuthenticatedRoute.js";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.js";

/**
 * This component uses this Switch component from React-Router that 
 * renders the first matching route that is defined within it. 
 * For now we only have a single route, it looks for / and renders 
 * the Home component when matched. We are also using the exact prop 
 * to ensure that it matches the / route exactly. This is because the 
 * path / will also match any route that starts with a /.
 * 
 * By using the route path /wines/:id we are telling the router to send all matching 
 * routes to our component Wines. This will also end up matching the route /wines/new 
 * with an id of new. To ensure that doesn’t happen, we put our /wines/new route before 
 * the pattern matching one.
 */
export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/wines/new" exact component={NewWine} props={childProps} />
    <AuthenticatedRoute path="/wines/:id" exact component={Wines} props={childProps} />


    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound404} />
  </Switch>;
