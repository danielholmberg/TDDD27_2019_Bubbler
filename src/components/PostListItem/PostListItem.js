import React, { Component } from 'react'
import { Storage } from 'aws-amplify';
import { Link, withRouter } from "react-router-dom";
import { Card, Rating, Image, Modal, Icon, Header, Button, Segment, Item, Divider, Label } from 'semantic-ui-react';
import { connect } from "react-redux";
import { Auth } from "aws-amplify";
import AWS from "aws-sdk";

import "./PostListItem.css";
import config from "../../config.js";

class PostListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageURL: null,
      postUser: null,
    }
  }

  loadimage(image) {
    return Storage.get(image);
  }

  async getPostUser(userId) {

    if(userId === this.props.user.username) {
      return this.props.user
    }

    AWS.config.update({ region: config.prod.cognito.REGION });
    AWS.config.update({ credentials: await Auth.currentCredentials() })

    const params = {
      UserPoolId: config.prod.cognito.USER_POOL_ID,
      AttributesToGet: [ 'name' ],
      Filter: `sub = \"${userId}\"`
    }

    const cognitoProvider = await new AWS.CognitoIdentityServiceProvider()

    const data = await new Promise((resolve, reject) => {
      cognitoProvider.listUsers(params, (err, data) => {
        if (err) {
          console.log('err:', err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const user = data.Users[0];
    return user;
  }
  

  async componentDidMount() {
    let imageURL, postUser;

    try {
      imageURL = await this.loadimage(this.props.item.image);
      postUser = await this.getPostUser(this.props.item.userId);
    } catch(e) {
      if(e.toString().includes('InvalidParameterException')) {
        postUser = null;
      } else {
        alert(e);
      }
    }

    this.setState({ imageURL, postUser });
}

  renderItem() {
    const { postUser } = this.state;
    const post = this.props.item;
    const { postId, productId, image, label, reviewComment, rating, addedAt } = post;

    return (
      <Card style={{ overflowWrap: 'break-word' }} raised key={postId} >
        <Header style={{position: 'relative', margin: 0, padding: 10, backgroundColor: '#57B4D5', color: 'white'}} as='h4'>
          <Image bordered circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' /> 
          {postUser !== null ? (postUser.Attributes ? postUser.Attributes[0].Value : postUser.attributes.name) : 'Anonymous'}
        </Header>
        <Card.Content>
          <Card.Header>{label}</Card.Header>
          <Card.Meta>
            <small>Art.nr. {productId}</small> | <small>{new Date(addedAt).toLocaleString()}</small>
            <Rating icon='star' style={{ paddingRight: 10, paddingTop: 10 }} rating={rating} maxRating={5} disabled />
            {rating ? rating : 0}
          </Card.Meta>
          {reviewComment && <Card.Description>{reviewComment}</Card.Description>}
        </Card.Content>
        {image &&
        <Card.Content extra>
          <center>
            <Image 
              rounded 
              style={{ maxWidth: 100, maxHeight: 100 }}
              src={this.state.imageURL}
            />
          </center>
        </Card.Content>}
      </Card>
    )
  }

  render() {
    const post = this.props.item;
    const user = this.props.user;
    const { userId, productId, postId, price, image, label, reviewComment, rating, addedAt, updatedAt } = post;

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
                  
                  <Header>
                    {label}
                    <Header.Subheader>
                      Art.nr. {productId}
                    </Header.Subheader>
                  </Header>
                  <Item.Meta className='ModalMeta'>
                    <Rating 
                      icon='star' 
                      style={{ paddingRight: 10 }} 
                      rating={rating} 
                      maxRating={5} 
                      disabled />{rating ? rating : 0}
                    <Label style={{ marginLeft: 10 }} horizontal basic>
                      <Icon name='dollar' color='green' style={{height: '10px'}}/> <b>{price}</b>
                    </Label>
                  </Item.Meta>
                  <Item.Description style={{paddingTop: 10}}>
                    {reviewComment}
                  </Item.Description>
                  <Divider></Divider>
                  <Item.Extra className='ModalExtra'>
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

        {user.username === userId ?
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
