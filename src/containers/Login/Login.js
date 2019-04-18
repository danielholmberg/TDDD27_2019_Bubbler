import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

import LoaderButton from '../../components/LoaderButton/LoaderButton.js';
import "./Login.css";


export default class Login extends Component {
  constructor(props) {
    super(props);

    // It’s important that we give the user some feedback while we are logging them in. 
    // So they get the sense that the app is still working, as opposed to being unresponsive.
    // To do this we are adding an isLoading flag to the state, which we will use to update
    // the state of the LoaderButton component. 
    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
    
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
  
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}
