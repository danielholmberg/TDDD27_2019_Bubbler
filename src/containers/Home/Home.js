import React, { Component } from "react";
import { API } from "aws-amplify";
import { Header, Icon, Button } from "semantic-ui-react";

import "./Home.css";
import WineList from "../../components/WineList/WineList";

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
      const wines = await this.getWines();
      this.setState({ wines });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  getWines() {
    return API.get("bubbler", "/feed");
  }  

  renderWineList(wines) {
    return <WineList items={wines} />
  }  

  renderLander() {
    return (
      <div className="lander">
        <h1>BUBBLER</h1>
        <p>It's all in the <b>bubbles</b></p>
      </div>
    );
  }

  renderWines() {
    return (
      <div className="wines">
        <Header as='h1'><center>Shared Bubbles</center></Header>
        <center>
          <Button primary href="/wines/new" style={{ marginBottom: 16, width: this.props.mobile ? '100%' : '50%', backgroundColor: 'green' }}>
            <Icon name='add'/> Add more bubbles
          </Button>
        </center>
        {!this.state.isLoading && this.renderWineList(this.state.wines)}
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
