import React, { Component } from "react";
import { Storage } from "aws-amplify";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, Segment, Rating, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import config from "../../config.js";
import "./Post.css";
import { s3Upload } from "../../libs/awsLib.js";
import { updatePost, deletePost } from "../../store/actions/postActions.js";

class Post extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.imageURL = null;

    this.state = {
      isLoading: false,
      isDeleting: null,
      productId: null,
      label: "",
      reviewComment: null,
      rating: 0,
    };
    
  }

  async componentDidMount() {
    if(!this.props.isAuthenticated) {
      return;
    } 

    this.setState({ isLoading: true });

    try {
      const post = this.props.post;
      const { productId, image, label, reviewComment, rating } = post;

      if (image) {
        this.imageURL = await Storage.get(image);
      }

      this.setState({
        productId,
        label,
        reviewComment,
        rating
      })

    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }
  
  validateForm() {
    return this.state.label.trim().length > 0 && this.state.rating !== 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = (selected) => {
    if(selected.length) {
      this.setState({
        productId: selected[0].itemId,
        label: `${selected[0].name}${selected[0].name2 ? '' : ' (' + selected[0].name2 + ')'}`
      });
    } else {
      this.setState({
        label: ""
      })
    }
  }

  handleCommentChange = (e, { value }) => this.setState({ reviewComment: value })
  
  handleFileChange = event => {
    this.file = event.target.files[0];
  }
  
  handleSubmit = async event => {  
    event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_IMAGE_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_IMAGE_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      const image = this.file 
      ? await this.fileUpload(this.file)
      : null;
  
      const updatedPost = {
        ...this.props.post,
        productId: this.state.productId,
        image: image || this.props.post.image,
        label: this.state.label,
        reviewComment: this.state.reviewComment,
        rating: this.state.rating
      };
      await this.props.updatePost(updatedPost);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  async fileUpload(file) {
    try {
      return await s3Upload(file);
    } catch (e) {
      alert(e);
      throw(e);
    }
  }
  
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete these bubbles?"
    );
  
    if (!confirmed) {
      return;
    }
  
    this.setState({ isDeleting: true });
  
    try {
      // As of now, we are not deleting the image when we upload a new one. Could be 
      // changed pretty straightforward by looking at the AWS Amplify API Docs.
      await this.props.deletePost(this.props.post);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  renderMenuItemChildren = (item, index) => {
    return [
      <div key="name">
        <b>{item.name}</b>{item.name2 === '' ? '' : ' (' + item.name2 + ')'}
      </div>,
      <div key="origin">
        <small>
          <b>Price:</b> {item.price} SEK
        </small>
        <small>
          <b> Volume:</b> {item.volume} ml
        </small>
        <small>
          <b> Country:</b> {item.countryOfOrigin === '' ? "Unkown" : item.countryOfOrigin}
        </small>
      </div>,
      <Divider fitted />
    ];
  }

  handleRate = (e, { rating }) => this.setState({ rating })
  
  render() {
    const { isLoading, reviewComment, rating } = this.state;
    const { post, systembolagetData, mobile } = this.props;
    
    return (
      <div>
      {post &&
      <Form style={{marginBottom: 16, width: mobile ? '100%' : '75%'}} className='PostForm' size='small' loading={isLoading}>
        <label>Label</label>
        <Typeahead
          clearButton
          id='EditPostLabel'
          style={{marginBottom: 16}}
          labelKey={(item) => `${item.name}${item.name2 === '' ? '' : ' (' + item.name2 + ')'}`}
          options={systembolagetData}
          defaultInputValue={post.label}
          renderMenuItemChildren={this.renderMenuItemChildren}
          onChange={this.handleChange}
          placeholder="Choose your bubbles..."
        />
        <label>Comment</label>
        <Form.TextArea placeholder='Write a comment...' value={reviewComment || ""} onChange={this.handleCommentChange}/>
        <label>Image</label>
        {post.image 
          ? (<a
              target="_blank"
              rel="noopener noreferrer"
              href={this.imageURL}
            >
              {' '+this.formatFilename(post.image)}
            </a>)
          : (<Form.Input 
              style={{marginBottom: 16}} 
              type="file" 
              accept={config.ACCEPTED_FILE_FORMATS} 
              onChange={this.handleFileChange}/>)
        }
        <center>
          <Segment style={{marginBottom: 16, marginTop: 8}}>
            <center>
              <Rating icon='star' size='massive' rating={rating} onRate={this.handleRate} maxRating={5}/>
              <p> {rating} out of 5</p>
            </center>
          </Segment> 
          <Form.Button style={{width: '50%'}} color='blue' disabled={!this.validateForm()} onClick={this.handleSubmit}>Save</Form.Button>
          <Form.Button style={{width: '50%'}} color='red' onClick={this.handleDelete}>Delete</Form.Button>
        </center>
      </Form>
      }
      </div>
    );
  }  
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const post = state.posts.posts.find((post) => post.postId === id);

  return {
    post: post,
    isAuthenticated: state.auth.isAuthenticated,
    systembolagetData: state.base.systembolagetData,
    history: ownProps.history,
    mobile: state.base.mobile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePost: (post) => dispatch(updatePost(post)),
    deletePost: (post) => dispatch(deletePost(post)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post));