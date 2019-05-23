import React, { Component } from "react";
import { Grid, Form, Segment, Header, Button, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import "./Signup.css";
import { 
  signUpNewUser, 
  confirmSignUp, 
  signInUser 
} from "../../store/actions/authActions.js";

/**
 *  - Since we need to show the user a form to enter the confirmation code, we are conditionally 
 *    rendering two forms based on if we have a user object or not. 
 *  - We are using the LoaderButton component that we created earlier for our submit buttons.
 *  - Since we have two forms we have two validation methods called validateForm and validateConfirmationForm.
 *  - We are setting the autoFocus flags on the email and the confirmation code fields.
 */

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      confirmSignUp: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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
  
  handleConfirmPasswordChange = event => {
    this.setState({
      confirmPassword: event.target.value
    });
  }

  handleConfirmationCodeChange = event => {
    this.setState({
      confirmationCode: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await this.props.signUpNewUser({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({ confirmSignUp: true });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  /**
   * Use the confirmation code to confirm the user. With the user now confirmed, 
   * Cognito now knows that we have a new user that can login to our app. Use the 
   * email and password to authenticate exactly the same way we did in the login page.
   * Finally, redirect to the homepage.
   */
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await this.props.confirmSignUp(this.state.email, this.state.confirmationCode);
      await this.props.signInUser(this.state.email, this.state.password);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }
  

  renderConfirmationForm() {
    return (
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' textAlign='center'>
            Verify account
          </Header>
          <Form size='large' loading={this.state.isLoading}>
            <Segment stacked>
              <Form.Input 
                autoFocus 
                fluid
                type='tel'
                onChange={this.handleConfirmationCodeChange}
              />
              <Message>Please check your email for the confirmation code.</Message>
              <Button 
                color='blue' 
                fluid 
                size='large' 
                disabled={!this.validateConfirmationForm()}
                onClick={this.handleConfirmationSubmit}
                >
                Verify
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }

  renderForm() {
    return (
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' textAlign='center'>
            Sign up
          </Header>
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
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm password'
                type='password'
                onChange={this.handleConfirmPasswordChange}
              />
              <Button 
                color='blue' 
                fluid 
                size='large' 
                disabled={!this.validateForm()}
                onClick={this.handleSubmit}
                >
                Sign up
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    console.log(this.state.confirmSignUp)
    return (
      <div className="Signup">
        {!this.state.confirmSignUp
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUpNewUser: ({ username, password }) => dispatch(signUpNewUser(username, password)),
    confirmSignUp: (email, confirmationCode) => dispatch(confirmSignUp(email, confirmationCode)),
    signInUser: (email, password) => dispatch(signInUser(email, password))
  }
}

export default connect(null, mapDispatchToProps)(Signup);