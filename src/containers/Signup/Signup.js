import React, { Component } from "react";
import { Grid, Form, Segment, Header, Button, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import "./Signup.css";
import { 
  signUpNewUser, 
  confirmSignUp, 
  signInUser 
} from "../../store/actions/authActions.js";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      confirmSignUp: false,
      email: "",
      password: "",
      pwError: false,
      confirmPassword: "",
      pwConfirmError: false,
      confirmationCode: "",
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      !this.state.pwError && !this.state.pwConfirmError
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
    const pwFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!pwFormat.exec(event.target.value)) {
      this.setState({
        password: event.target.value,
        pwError: true
      })
    } else {
      this.setState({
        password: event.target.value,
        pwError: false
      });
    }

  }
  
  handleConfirmPasswordChange = event => {
    if(this.state.password !== event.target.value) {
      this.setState({
        pwConfirmError: true
      })
    } else {
      this.setState({
        confirmPassword: event.target.value,
        pwConfirmError: false
      });
    }
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
                value={this.state.confirmationCode}
                placeholder='Confirmation code'
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
    const pwCriteria = [
      '8 characters',
      '1 number',
      '1 special character (@$!%*?&)',
      '1 uppercase',
      '1 lowercase'
    ]
    
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
                error={this.state.pwError}
                onChange={this.handlePasswordChange}
              />
              {this.state.pwError && <Message negative style={{textAlign: 'left'}} header='Password must contain at least:' list={pwCriteria}/>}
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm password'
                type='password'
                onChange={this.handleConfirmPasswordChange}
              />
              {this.state.pwConfirmError && <Message negative>Password does not match.</Message>}
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