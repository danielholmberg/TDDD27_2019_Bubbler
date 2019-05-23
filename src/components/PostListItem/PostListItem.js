import React, { Component } from 'react'
import { Storage } from 'aws-amplify';
import { Link, withRouter } from "react-router-dom";
import { Card, Rating, Image } from 'semantic-ui-react';
import { connect } from "react-redux";

import "./PostListItem.css";

class PostListItem extends Component {
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
    const user = this.props.user;
    const { userId, postId, image, label, comment, rating, addedAt, updatedAt } = post;
    return (
      <Card raised key={postId} as={Link} to={userId === user.id ? `/posts/${postId}` : this.props.location.pathname}>
        {image &&
          <center>
            <Image 
              rounded 
              style={{ margin: 10, maxWidth: 200, maxHeight: 200 }}
              src={this.state.imageURL} 
              alt={label}
            />
          </center>}
        <Card.Content>
          <Card.Header>{label}</Card.Header>
          <Card.Meta>
            <Rating icon='star' style={{ paddingRight: 10, paddingTop: 10 }} rating={rating} maxRating={5} disabled />
            {rating ? rating : 0}
          </Card.Meta>
          {comment && <Card.Description>{comment}</Card.Description>}
        </Card.Content>
        <Card.Content extra>
          <small>Added: {new Date(addedAt).toLocaleString()}</small>
          <small>{updatedAt && `Updated: ${new Date(updatedAt).toLocaleString()}`}</small>
        </Card.Content>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(withRouter(PostListItem));
