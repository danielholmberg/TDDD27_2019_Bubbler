import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import './WineList.css';
import WineListItem from '../WineListItem/WineListItem';

export default class WineList extends Component {
  
  renderWineList(wines) {
    return wines.map(wine => (
      <WineListItem key={wine.wineId} item={wine} />
    ))
  }
  
  render() {
    const wines = this.props.items;
    return (
      <Card.Group centered>
        {this.renderWineList(wines)}
      </Card.Group>
    )
  }
}
