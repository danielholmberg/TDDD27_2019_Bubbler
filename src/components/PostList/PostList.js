import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import './PostList.css';
import PostListItem from '../PostListItem/PostListItem';

export default class PostList extends Component {
  
  renderPostList(posts) {
    return posts.map(post => (
      <PostListItem key={post.postId} item={post} />
    ))
  }
  
  render() {
    const posts = this.props.items;
    return (
      <Card.Group centered fluid>
        {this.renderPostList(posts)}
      </Card.Group>
    )
  }
}
