import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Form, Segment, Header, Button, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import "./Login.css";
import { signInUser } from "../../store/actions/authActions.js";

class Login extends Component {
  constructor(props) {
    super(props);

    // It’s important that we give the user some feedback while we are logging them in. 
    // So they get the sense that the app is still working, as opposed to being unresponsive.
    // To do this we are adding an isLoading flag to the state, which we will use to update
    // the loading state of the form component. 
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      errorMessage: "",
    };
    
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true, errorMessage: '' });
  
    try {
      await this.props.signInUser(this.state.email, this.state.password);
    } catch (e) {
      this.setState({ errorMessage: e.message })
    }

    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div className="Login">
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
              Log in to your account
            </Header>
            {this.state.errorMessage &&
            <Message warning attached>
              {this.state.errorMessage}
            </Message>}
            <Form size='large' loading={this.state.isLoading}>
              <Segment stacked>
                <Form.Input 
                  autoFocus 
                  fluid 
                  icon='user' 
                  iconPosition='left' 
                  placeholder='E-mail address' 
                  onChange={this.handleEmailChange}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={this.handlePasswordChange}
                />
                <Button 
                  color='blue' 
                  fluid 
                  size='large' 
                  disabled={!this.validateForm()}
                  onClick={this.handleSubmit}
                  >
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <Link to='/signup'>Sign up</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signInUser: (email, password) => dispatch(signInUser(email, password))
  }
}

export default connect(null, mapDispatchToProps)(Login);