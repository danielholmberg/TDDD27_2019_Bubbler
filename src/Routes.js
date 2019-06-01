import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import Loadable from "react-loadable";
import { connect } from "react-redux";

// Components
import AppliedRoute from "./components/AppliedRoute.js";
import AuthenticatedRoute from "./components/AuthenticatedRoute.js";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.js";

const MyLoadingComponent = ({ error, timedOut, retry, pastDelay }) => {
  if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else if (timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (pastDelay) {
    return <Loader>.*. bubbling .*.</Loader>;
  } else {
    return null;
  }
};

// Containers
const AsyncHome = Loadable({
  loader: () => import("./containers/Home/Home.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncLogin = Loadable({
  loader: () => import("./containers/Login/Login.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncSignup = Loadable({
  loader: () => import("./containers/Signup/Signup.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncNewPost = Loadable({
  loader: () => import("./containers/NewPost/NewPost.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncPost = Loadable({
  loader: () => import("./containers/Post/Post.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncNotFound404 = Loadable({
  loader: () => import("./containers/NotFound404/NotFound404.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
const AsyncProfile = Loadable({
  loader: () => import("./containers/Profile/Profile.js"),
  loading: MyLoadingComponent,
  timeout: 10000, // 10 seconds
  delay: 1000 // 1 second
});
/**
 * This component uses this Switch component from React-Router that
 * renders the first matching route that is defined within it.
 * The first route looks for / and renders the Home component when matched.
 * We are also using the exact prop to ensure that it matches the / route exactly.
 * This is because the path / will also match any route that starts with a /.
 *
 * By using the route path /posts/:id we are telling the router to send all matching
 * routes to our component Post. This will also end up matching the route /posts/new
 * with an id of new. To ensure that doesn’t happen, we put our /posts/new route before
 * the pattern matching one.
 */
const Routes = (props) => (
  <Switch>
    <AppliedRoute 
      path="/" 
      exact 
      component={AsyncHome}
    />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={props}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={AsyncSignup}
      props={props}
    />
    <AuthenticatedRoute
      path="/posts/new"
      exact
      component={AsyncNewPost}
      props={props}
    />
    <AuthenticatedRoute
      path="/posts/:id"
      exact
      component={AsyncPost}
      props={props}
    />
    <AuthenticatedRoute
      path="/profile"
      exact
      component={AsyncProfile}
      props={props}
    />

    {/* Finally, catch all unmatched routes */}
    <Route component={AsyncNotFound404} />
  </Switch>
);

const mapStateToProps = (state, ownProps) => {
  return {
    ...state,
    ...ownProps
  }
}

export default withRouter(connect(mapStateToProps)(Routes));