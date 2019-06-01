import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, Icon, Button, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import "./Home.css";
import PostList from "../../components/PostList/PostList.js";

class Home extends Component {

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
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
    const { posts, mobile } = this.props;
    const EMPTY_LIST_TEXT = 'Be the FIRST to add them bubbles!';

    return (
      <div className="posts">
        <Header as='h1' textAlign='center'>All Bubbles</Header>
        <Button as={Link} to="/posts/new" primary fluid
          style={{ 
            marginBottom: 16,
            width: mobile ? '100%' : '50%',
            backgroundColor: 'green' 
          }}
        >
          <Icon name='add'/> Add more bubbles
        </Button>
        {posts.length !== 0 ? this.renderPostList(posts) : <center><Message compact info>{EMPTY_LIST_TEXT}</Message></center>}
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

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
    isAuthenticated: state.auth.isAuthenticated,
    mobile: state.base.mobile,
  }
}

export default connect(mapStateToProps)(Home);
