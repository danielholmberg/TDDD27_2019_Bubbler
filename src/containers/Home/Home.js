import React, { Component } from "react";
import { API } from "aws-amplify";
import { Header, Icon, Button } from "semantic-ui-react";

import "./Home.css";
import PostList from "../../components/PostList/PostList.js";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      posts: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const posts = await this.getPosts();
      this.setState({ posts });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  getPosts() {
    return API.get("bubbler", "/feed");
  }  

  renderPostList(posts) {
    return <PostList items={posts} />
  }  

  renderLander() {
    return (
      <div className="lander">
        <h1>BUBBLER</h1>
        <p>It's all in the <b>bubbles</b></p>
      </div>
    );
  }

  renderPosts() {
    return (
      <div className="posts">
        <Header as='h1'><center>Shared Bubbles</center></Header>
        <center>
          <Button primary href="/posts/new" style={{ marginBottom: 16, width: this.props.mobile ? '100%' : '50%', backgroundColor: 'green' }}>
            <Icon name='add'/> Add more bubbles
          </Button>
        </center>
        {!this.state.isLoading && this.renderPostList(this.state.posts)}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPosts() : this.renderLander()}
      </div>
    );
  }
}
