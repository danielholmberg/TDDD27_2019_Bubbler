import React, { Component } from 'react'
import { Storage } from 'aws-amplify';
import { Card, Rating, Image } from 'semantic-ui-react'

import "./WineListItem.css";

export default class WineListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageURL: null,
    }
  }

  loadimage(image) {
    return Storage.vault.get(image);
  }

  async componentDidMount() {
    try {
      const imageURL = await this.loadimage(this.props.item.image);
      console.log("imageURL: ", imageURL);
      this.setState({ imageURL });
    } catch(e) {
      alert(e);
    }
  }

  handleRate

  render() {
    const wineItem = this.props.item;
    const { wineId, label, addedAt, comment, rating } = wineItem;
    return (
      <Card raised key={wineId} href={`/wines/${wineId}`}>
        {wineItem.image && 
        <Image
        centered
        style={{ maxWidth: 200, maxHeight: 200 }}
        src={this.state.imageURL} 
        alt={label}
        />}
        <Card.Content>
          <Card.Header>{label}</Card.Header>
          <Card.Meta>
            <small className='added'>{new Date(addedAt).toLocaleString()}</small>
          </Card.Meta>
          {comment && <Card.Description>{comment}</Card.Description>}
        </Card.Content>
        <Card.Content extra>
          <center>
            <Rating icon='star' rating={rating} maxRating={10} disabled/>
            <p> {rating ? rating : 0}/10</p>
          </center>
        </Card.Content>
      </Card>
    )
  }
}
