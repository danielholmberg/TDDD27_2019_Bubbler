import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Container, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import Sockette from "sockette";

import Routes from "./Routes.js";
import "./App.css";
import config from "./config.js";
import { 
  signInUser,
  signOutUser,
  getCurrentUserSession,
  getCurrentUser
} from "./store/actions/authActions.js";
import { 
  getFeedHistory, 
  addNewPostEvent,
  removePostEvent,
  updatePostEvent
} from "./store/actions/postActions.js";
import { 
  windowResize, 
  getSystembolagetData, 
  setWSSClient 
} from "./store/actions/baseActions";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticating: true
    }
  }

  async componentDidUpdate() {
    if(this.props.isAuthenticated) {
      try {
        if(!this.props.wss) {
          const wss = new Sockette(config.prod.apiGateway.WSS, {
            timeout: 5e3, // 5000
            maxAttempts: 10,
            onopen: e => console.log('Connected!', e),
            onmessage: e => this.onWSSMessage(e),
            onreconnect: e => console.log('Reconnecting...', e),
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
          });

          this.props.setWSSClient(wss);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  onWSSMessage(e) {
    console.log('OnMessage', e);
    const data = JSON.parse(e.data)
    switch(data.action) {
      case 'add':
        this.props.addNewPostEvent(data.post);
        break;
      case 'delete':
        this.props.removePostEvent(data.id);
        break;
      case 'update':
        this.props.updatePostEvent(data.post);
        break;
      default:
        console.warn('Unhandled WSS onMessage event...', data);
    }
  }

  async componentDidMount() {
    console.log('App componentDidMount()')
    window.addEventListener('resize', () => this.props.windowResize());
    try {
      await this.props.getCurrentUserSession();
      await this.props.getCurrentUser();
      await this.props.getSystembolagetData();
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.props.windowResize());
    try {
      if(this.props.wss) {
        this.props.wss.close();
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * When we refresh the page (once a user has logged in and then logged out),
   * we then load the user session from the browser Local Storage (using Amplify),
   * in effect logging them back in.
   *
   * AWS Amplify has a Auth.signOut() method that helps clear this session state out.
   */
  handleLogout = async () => {
    await this.props.signOutUser()    
    this.props.history.push("/login");
  };

  /**
   * Since loading the user session is an asynchronous process, we want to
   * ensure that our app does not change states when it first loads. To do
   * this we’ll hold off rendering our app till isAuthenticating is false.
   * We’ll conditionally render our app based on the isAuthenticating flag.
   * 
   * <NavLink> component from 'react-router-dom' helps avoid refreshing the webpage
   * when routing the user to path='/'
   */
  render() {
    const { isAuthenticated, mobile } = this.props;

    const profile = 'Profile', logout = 'Logout', login = 'Login', signup = 'Sign up';

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Menu fixed='top' size='large' inverted>
            <Container>

              <Menu.Item header as={Link} to='/' style={{ fontFamily: "Bungee Inline" }}>
                BUBBLER
              </Menu.Item>

              {isAuthenticated ? (

                <Menu.Menu position='right'>
                  <Menu.Item as={Link} to='/profile'>
                    <Icon name='user circle'/>{!mobile && profile}
                  </Menu.Item>
                  <Menu.Item onClick={this.handleLogout}>
                    <Icon name='log out'/>{!mobile && logout}
                  </Menu.Item>
                </Menu.Menu>) 

                : (

                <Menu.Menu position='right'>
                  <Menu.Item as={Link} to='/signup'>
                    <Icon name='add user'/>{!mobile && signup}
                  </Menu.Item>
                  <Menu.Item as={Link} to='/login'>
                    <Icon name='sign in'/>{!mobile && login}
                  </Menu.Item> 
                </Menu.Menu>

                )
              }
            </Container>
          </Menu>

          <Container style={{ marginTop: '60px', marginBottom: '60px' }}>
            <Routes />
          </Container>
        </div>
      )
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('App state', state);
  console.log('App ownProps', ownProps);
  return {
    isAuthenticated: state.auth.isAuthenticated,
    mobile: state.base.mobile,
    wss: state.base.wss,
    hasFeedHistory: state.posts.hasFeedHistory,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signInUser: () => dispatch(signInUser()),
    signOutUser: () => dispatch(signOutUser()),
    windowResize: () => dispatch(windowResize()),
    getCurrentUserSession: () => dispatch(getCurrentUserSession()),
    getCurrentUser: () => dispatch(getCurrentUser()),
    getSystembolagetData: () => dispatch(getSystembolagetData()),
    getFeedHistory: () => dispatch(getFeedHistory()),
    setWSSClient: (wss) => dispatch(setWSSClient(wss)),
    addNewPostEvent: (post) => dispatch(addNewPostEvent(post)),
    removePostEvent: (id) => dispatch(removePostEvent(id)),
    updatePostEvent: (post) => dispatch(updatePostEvent(post)),
  }
}

/**
 * The App component does not have access to the router props directly since
 * it is not rendered inside a Route component. To be able to use the router
 * props in our App component we will need to use the withRouter Higher-Order
 * Component (or HOC).
 */
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));