import React, { Component } from 'react'
import { Storage } from 'aws-amplify';
import { Link } from "react-router-dom";
import { Card, Rating, Image } from 'semantic-ui-react'

import "./PostListItem.css";

export default class PostListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageURL: null,
    }
  }

  loadimage(image) {
    return Storage.get(image);
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

  render() {
    const post = this.props.item;
    const { postId, image, label, comment, rating, addedAt, updatedAt } = post;
    return (
      <Card raised key={postId} as={Link} to={`/posts/${postId}`}>
        {image && 
        <Image
        centered
        style={{ maxWidth: 200, maxHeight: 200 }}
        src={this.state.imageURL} 
        alt={label}
        />}
        <Card.Content>
          <Card.Header>{label}</Card.Header>
          <Card.Meta>
            <small className='added'>Added: {new Date(addedAt).toLocaleString()}</small>
            {updatedAt && 
            <small className='updated'>Updated: {new Date(updatedAt).toLocaleString()}</small>} 
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
