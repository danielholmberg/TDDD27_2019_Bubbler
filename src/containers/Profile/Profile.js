import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Segment, Header } from "semantic-ui-react";

import PostList from "../../components/PostList/PostList.js";
import "./Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      posts: [],
      user: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const posts = await this.getPosts();
      const user = await Auth.currentAuthenticatedUser()
      .then(user => user)
      .catch(e => {
        alert(e);
        this.props.history.push("/login");
      });
      this.setState({ posts, user });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  getPosts() {
    return API.get("bubbler", "/posts");
  }

  renderPostList(posts) {
    return <PostList items={posts}/>;
  }

  renderHeaderSection() {
    const { user } = this.state;
    return (
      <div className="header">
        <Segment>
          <Header as='h1'><center>Profile</center></Header>
          <center>{user && user.attributes.email}</center>
        </Segment>
        <Header as='h2'><center>Your Cellar</center></Header>
        {this.renderPostList(this.state.posts)}
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
