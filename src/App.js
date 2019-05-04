import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import { Menu, Container, Icon } from "semantic-ui-react";

import Routes from "./Routes.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      mobile: window.innerWidth <= 500,
    };
  }

  handleWindowSizeChange = () => {
    this.setState({ mobile: window.innerWidth <= 500 });
  };

  /**
   * All this does is load the current session. If it loads, then it updates
   * the isAuthenticating flag once the process is complete.
   * The Auth.currentSession() method throws an error No current user if
   * nobody is currently logged in. We don’t want to show this error to users
   * when they load up our app and are not signed in.
   */
  async componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
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
   * 
   * <Link> component from 'react-router-dom' helps avoid refreshing the webpage
   * when routing the user to path='/'
   */
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      mobile: this.state.mobile
    };

    const profile = 'Profile', logout = 'Logout', login = 'Login', signup = 'Sign up';

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Menu fixed='top' inverted>
            <Container>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Menu.Item as='a' header style={{ fontFamily: "Bungee Inline" }}>
                  BUBBLER
                </Menu.Item>
              </Link>
              {this.state.isAuthenticated ? (
                <Menu.Menu position='right'>
                  <LinkContainer to="/profile">
                    <Menu.Item>
                      <Icon name='user circle'/>{!this.state.mobile && profile}
                    </Menu.Item>
                  </LinkContainer>
                  <Menu.Item onClick={this.handleLogout}>
                    <Icon name='log out'/>{!this.state.mobile && logout}
                  </Menu.Item>
                </Menu.Menu>) : (
                <Menu.Menu position='right'>
                  <LinkContainer to="/signup">
                    <Menu.Item>
                      <Icon name='add user'/>{!this.state.mobile && signup}
                    </Menu.Item>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Menu.Item>
                      <Icon name='sign in'/>{!this.state.mobile && login}
                    </Menu.Item>
                  </LinkContainer>  
                </Menu.Menu>
                )
              }
            </Container>
          </Menu>
          <Container style={{ marginTop: '60px' }}>
            <Routes childProps={childProps} />
          </Container>
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
