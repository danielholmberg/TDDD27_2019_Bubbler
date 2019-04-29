import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

import Routes from "./Routes.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  /**
   * All this does is load the current session. If it loads, then it updates
   * the isAuthenticating flag once the process is complete.
   * The Auth.currentSession() method throws an error No current user if
   * nobody is currently logged in. We don’t want to show this error to users
   * when they load up our app and are not signed in.
   */
  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  /**
   * When we refresh the page (once a user has logged in and then logged out),
   * we then load the user session from the browser Local Storage (using Amplify),
   * in effect logging them back in.
   *
   * AWS Amplify has a Auth.signOut() method that helps clear this session state out.
   */
  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    // This redirects the user back to the login page once the user logs out.
    this.props.history.push("/login");
  };

  /**
   * Since loading the user session is an asynchronous process, we want to
   * ensure that our app does not change states when it first loads. To do
   * this we’ll hold off rendering our app till isAuthenticating is false.
   * We’ll conditionally render our app based on the isAuthenticating flag.
   */
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Navbar fluid collapseOnSelects>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/" style={{ fontFamily: "Bungee Inline" }}>
                  BUBBLER
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                {this.state.isAuthenticated ? (
                  <Fragment>
                    <LinkContainer to="/profile">
                      <NavItem>Profile</NavItem>
                    </LinkContainer>
                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  </Fragment>
                ) : (
                  <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

/**
 * The App component does not have access to the router props directly since
 * it is not rendered inside a Route component. To be able to use the router
 * props in our App component we will need to use the withRouter Higher-Order
 * Component (or HOC).
 */
export default withRouter(App);
