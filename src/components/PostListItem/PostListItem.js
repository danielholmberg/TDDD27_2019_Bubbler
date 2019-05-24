import React, { Component } from 'react'
import { Storage } from 'aws-amplify';
import { Link, withRouter } from "react-router-dom";
import { Card, Rating, Image, Modal, Icon, Header, Button, Segment, Item, Divider, Label } from 'semantic-ui-react';
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

  renderItem() {
    const post = this.props.item;
    const { postId, image, label, comment, rating, addedAt, updatedAt } = post;

    return (
      <Card style={{ overflowWrap: 'break-word' }} raised key={postId} >
        <Header style={{position: 'relative', margin: 0, padding: 10, backgroundColor: '#57B4D5', color: 'white'}} as='h4'>
          <Image bordered circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' /> {this.props.user.attributes.email.split('@')[0]}
        </Header>
        <Card.Content>
          <Card.Header>{label}</Card.Header>
          <Card.Meta>
            <Rating icon='star' style={{ paddingRight: 10, paddingTop: 10 }} rating={rating} maxRating={5} disabled />
            {rating ? rating : 0}
          </Card.Meta>
          {comment && <Card.Description>{comment}</Card.Description>}
        </Card.Content>
        <Card.Content extra>
          {image &&
            <Image 
              rounded 
              floated='left'
              style={{ margin: 0, marginRight: 10, maxWidth: 100, maxHeight: 100 }}
              src={this.state.imageURL} 
              alt={label}
            />}
          <small>Added: {new Date(addedAt).toLocaleString()}</small>
          <small>{updatedAt && `Updated: ${new Date(updatedAt).toLocaleString()}`}</small>
        </Card.Content>
      </Card>
    )
  }

  render() {
    const post = this.props.item;
    const user = this.props.user;
    const { userId, postId, image, label, comment, rating, addedAt, updatedAt } = post;

    const CardItem = this.renderItem();

    return (
      <Modal 
        closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }} // Workaround for button not showing on larger screen sizes.
        size='small' trigger={CardItem} style={{position: 'relative'}} // postition: 'relative' to get the modal centered and wrapped.
        >

        <Header content='Review details' />
        <Modal.Content>
          <Modal.Description style={{ margin: 'auto', overflowWrap: 'break-word' }}>
            <Segment>
              <Item>
                <Item.Content>
                  
                  <Header>{label}</Header>
                  <Item.Meta>
                    <Rating 
                      icon='star' 
                      style={{ paddingRight: 10, paddingTop: 0 }} 
                      rating={rating} 
                      maxRating={5} 
                      disabled />{rating ? rating : 0}
                  </Item.Meta>
                  <Item.Description>
                    {comment}
                  </Item.Description>
                  <Divider></Divider>
                  <Item.Extra>
                    <small>Added: {new Date(addedAt).toLocaleString()}</small>
                    <small>{updatedAt && `Updated: ${new Date(updatedAt).toLocaleString()}`}</small>
                  </Item.Extra>

                </Item.Content>
              </Item>
            </Segment>
          </Modal.Description>
          {image &&
            <Image 
              rounded 
              style={{ margin: 'auto', paddingTop: 10, maxHeight: 400, maxWidth: 400 }}
              src={this.state.imageURL} 
              alt={label}
            />}
        </Modal.Content>

        {user.id === userId ?
          <Modal.Actions>
            <Button as={Link} to={`/posts/${postId}`} primary>
              <Icon name='edit' /> Edit
            </Button>
          </Modal.Actions> : null}

      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(withRouter(PostListItem));
