import React, { Component } from "react";
import { Segment, Header } from "semantic-ui-react";
import { connect } from "react-redux";

import PostList from "../../components/PostList/PostList.js";
import "./Profile.css";

class Profile extends Component {

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  }

  renderPostList(posts) {
    return <PostList items={posts}/>;
  }

  renderHeaderSection() {
    const { posts, user } = this.props;
    const EMPTY_LIST_TEXT = 'No ratings added yet!';

    return (
      <div className="header">
        <Segment>
          <Header as='h1'><center>Profile</center></Header>
          <center>{user && user.attributes.email}</center>
        </Segment>
        <Header as='h2'><center>Your rated bubbles</center></Header>
        {posts.length !== 0 ? this.renderPostList(posts) : <center style={{color:'grey'}}>{EMPTY_LIST_TEXT}</center>}
      </div>
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
  const userPosts = state.posts.posts.filter((post) => post.userId === user.id);

  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: user,
    posts: userPosts,
    history: ownProps.history,
  }
}

export default connect(mapStateToProps)(Profile);