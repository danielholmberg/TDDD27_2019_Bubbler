import React, { Component } from "react";
<<<<<<< HEAD
import { Container, Segment, Header, Label, Icon, Image, Modal, Form, Button } from "semantic-ui-react";
=======
import { Container, Segment, Header, Label, Icon, Image } from "semantic-ui-react";
>>>>>>> 2ee04e2... Added Name attribute to user, and updated Post item design.
import { connect } from "react-redux";

import PostList from "../../components/PostList/PostList.js";
import "./Profile.css";
import { updateUserAttributes } from "../../store/actions/baseActions.js";

class Profile extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      modalOpen: false
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  }

  renderPostList(posts) {
    return <PostList items={posts}/>;
  }

  toggleModal = () => {
    const temp = this.state.modalOpen;
    this.setState({
      modalOpen: !temp
    })
  }

  submitSettings = () => {
    
  }

  validateForm() {
    return this.state.name.trim().length > 0;
  }

  renderHeaderSection() {
    const { posts, user } = this.props;
    const EMPTY_LIST_TEXT = 'No ratings added yet!';
<<<<<<< HEAD
    const profilePic = null;
=======
    const profilePic = null // TODO - Add posibility to change profile avatar
>>>>>>> 2ee04e2... Added Name attribute to user, and updated Post item design.

    return (
      <Container>
        <Segment padded style={{ marginLeft: '10%', marginRight: '10%', overflowWrap: 'break-word'}}>
          <Header as='h2' icon dividing textAlign='center'>
            {profilePic ?  
              <Image circular src={profilePic} /> :
<<<<<<< HEAD
              <Icon name='user' circular /> 
            }
            <Header.Content>
              {user && (user.attributes.nickname || user.attributes.email)}
            </Header.Content>
          </Header>
          <Label style={{float: 'right'}} horizontal basic>
            <Icon name='star' color='yellow' style={{height: '10px'}}/> <b>{posts.length}</b>
          </Label>

          <Icon name='edit' size='large' onClick={() => this.toggleModal()}/>
          <Modal style={{position: 'relative'}}
            closeOnDimmerClick={false}
            open={this.state.modalOpen}>
            <Modal.Header>
              Edit profile
            </Modal.Header>
            <Modal.Content>
            <Form>
              <Form.Field onChange={() => console.log('name changed')}>
                <label>Name</label>
                <input placeholder='Name' />
              </Form.Field>
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button negative icon='remove' content='Cancel' onClick={() => this.toggleModal()}/>
              <Button positive disabled={!this.validateForm()} icon='save' content='Save' onClick={() => this.submitSettings()}/>
            </Modal.Actions>
          </Modal>
=======
              <Image bordered circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' /> 
            }
            <Header.Content>
              {user && (user.attributes.name || user.attributes.email)}
            </Header.Content>
          </Header>
          <Container>
            <Label style={{float: 'right'}} horizontal basic>
              <Icon name='star' color='yellow' style={{height: '10px'}}/> <b>{posts.length}</b>
            </Label>
          </Container>
>>>>>>> 2ee04e2... Added Name attribute to user, and updated Post item design.
        </Segment>

        <Header as='h2'><center>Your reviews</center></Header>
        {posts.length !== 0 ? this.renderPostList(posts) : <center style={{color:'grey'}}>{EMPTY_LIST_TEXT}</center>}
      </Container>
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

const mapStateToProps = (state, ownProps) => {
  console.log('Profile state:', state);
  console.log('Profile ownProps:', ownProps);
  const user = state.auth.user;
  const userPosts = state.posts.posts.filter((post) => post.userId === user.username);

  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: user,
    posts: userPosts,
    history: ownProps.history,
  }
}

<<<<<<< HEAD
const mapDisptachToProps = (dispatch) => {
  return {
    updateUserAttributes: (attributes) => dispatch(updateUserAttributes(attributes))
  }
}

export default connect(mapStateToProps, mapDisptachToProps)(Profile);
=======
export default connect(mapStateToProps)(Profile);
>>>>>>> 2ee04e2... Added Name attribute to user, and updated Post item design.
