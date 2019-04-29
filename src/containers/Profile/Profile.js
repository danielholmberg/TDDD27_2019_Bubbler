import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      wines: [],
      useremail: ""
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const wines = await this.wines();
      const useremail = await this.userInfo();
      this.setState({ wines, useremail });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  userInfo() {
    return "test@example.com";
  }

  wines() {
    return API.get("wines", "/wines");
  }

  /**
   * This method always renders a Create a new wine button as the first item in the list 
   * (even if the list is empty). We do this by concatenating an array with an 
   * empty object with our wines array. We render the first line of each wine as 
   * the ListGroupItem header by doing wine.content.trim().split('\n')[0].

And the LinkContainer component directs our app to each of the items.
   */
  renderWinesList(wines) {
    return wines.map((wine, i) => (
      <LinkContainer key={wine.wineId} to={`/wines/${wine.wineId}`}>
        <ListGroupItem header={wine.content.trim().split("\n")[0]}>
          {"Created: " + new Date(wine.createdAt).toLocaleString()}
        </ListGroupItem>
      </LinkContainer>
    ));
  }

  renderWines() {
    return (
      <div className="wines">
        <PageHeader>Your Bubbles</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderWinesList(this.state.wines)}
        </ListGroup>
      </div>
    );
  }

  renderProfile() {
    return (
      <div className="header">
        <div>{this.state.useremail}</div>
        {this.renderWines()}
      </div>
    );
  }

  render() {
    return (
      <div className="Profile">
        {this.props.isAuthenticated
          ? this.renderProfile()
          : this.props.history.push("/")}
      </div>
    );
  }
}
