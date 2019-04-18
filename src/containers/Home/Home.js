import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";

import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      wines: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const wines = await this.wines();
      this.setState({ wines });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
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
    return [{}].concat(wines).map(
      (wine, i) =>
        i !== 0
          ? <LinkContainer
              key={wine.wineId}
              to={`/wines/${wine.wineId}`}
            >
              <ListGroupItem header={wine.content.trim().split("\n")[0]}>
                {"Created: " + new Date(wine.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/wines/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Add a new wine
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }  

  renderLander() {
    return (
      <div className="lander">
        <h1 style={{fontFamily: 'Bungee Inline'}}>BUBBLER</h1>
        <p>It's all in the <b>bubbles</b></p>
      </div>
    );
  }

  renderWines() {
    return (
      <div className="wines">
        <PageHeader>Your Wines</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderWinesList(this.state.wines)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderWines() : this.renderLander()}
      </div>
    );
  }
}
