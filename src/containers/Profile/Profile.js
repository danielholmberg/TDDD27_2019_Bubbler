import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Segment, Header } from "semantic-ui-react";

import WineList from "../../components/WineList/WineList.js";
import "./Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      wines: [],
      user: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const wines = await this.wines();
      const user = await Auth.currentAuthenticatedUser()
      .then(user => user)
      .catch(e => {
        alert(e);
        this.props.history.push("/login");
      });
      this.setState({ wines, user });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  wines() {
    return API.get("wines", "/wines");
  }

  renderWineList(wines) {
    return <WineList items={wines}/>;
  }

  renderHeaderSection() {
    const { user } = this.state;
    return (
      <div className="header">
        <Segment>
          <Header as='h1'><center>Profile</center></Header>
          <center>{user && user.attributes.email}</center>
        </Segment>
        <Header as='h2'><center>Your Cellar</center></Header>
        {this.renderWineList(this.state.wines)}
      </div>
    );
  }

  render() {
    return (
      <div className="Profile">
        {this.props.isAuthenticated
          ? this.renderHeaderSection()
          : this.props.history.push("/login")}
      </div>
    );
  }
}
