import React, { Component } from "react";
import { Segment, Header, Label, Icon, Image, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import PostList from "../../components/PostList/PostList.js";
import "./Profile.css";

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

  renderProfile() {
    const { posts, user } = this.props;
    const EMPTY_LIST_TEXT = 'No ratings added yet!';
    const profilePic = null // TODO - Add posibility to change profile avatar
    let totalCost = 0;
    posts.map((post) => totalCost = totalCost + Number(post.price) );

    return (
      <div className="Content">
        <Segment padded className="ProfileSegment">

          <Header as='h2' icon dividing textAlign='center'>
            {profilePic ?  
              <Image circular src={profilePic} /> :
              <Image bordered circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' /> 
            }
            <Header.Content>
              {user && (user.attributes.name || user.attributes.email)}
            </Header.Content>
          </Header>
          <Grid padded >
            <Grid.Column textAlign='center'>
              <Label horizontal basic>
                <Icon name='star' color='yellow' style={{height: '10px'}}/> <b>{posts.length}</b>
              </Label>
              <Label horizontal basic>
                <Icon name='dollar' color='green' style={{height: '10px'}}/> <b>{totalCost}</b>
              </Label>
            </Grid.Column>        
          </Grid>

        </Segment>

        <Header as='h2' textAlign='center'>Your reviews</Header>
        {posts.length !== 0 ? this.renderPostList(posts) : <center style={{color:'grey'}}>{EMPTY_LIST_TEXT}</center>}
      </div>
    );
  }

  render() {
    return (
      <div className="Profile">
        {this.props.isAuthenticated
          ? this.renderProfile()
          : this.props.history.push("/login")}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const user = state.auth.user;
  const userPosts = state.posts.posts.filter((post) => post.userId === user.username);

  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: user,
    posts: userPosts,
    history: ownProps.history,
    mobile: state.base.mobile,
  }
}

export default connect(mapStateToProps)(Profile);
