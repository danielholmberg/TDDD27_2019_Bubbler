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

/**
 * Load the post on componentDidMount and save it to the state. We get the id of our post 
 * from the URL using the props automatically passed to us by React-Router in 
 * this.props.match.params.id. The keyword id is a part of the pattern matching in our 
 * route (/posts/:id). If there is an image, we use the key to get a secure link to 
 * the file we uploaded to S3. We then store this to the component’s state as imageURL.
 * The reason why we have the post object in the state along with the label and the 
 * imageURL is because we use this when the user edits the post.
 */
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
  
  /**
   * If there is a file to upload we call s3Upload to upload it and save the key we get from S3.
   * We save the post by making a PUT request with the post object to /posts/:id where we get the 
   * id from this.props.match.params.id. We use the API.put() method from AWS Amplify.
   * And on success we redirect the user to the homepage.
   */
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
  
      // As of now, we are not deleting the old image when we upload a new one. Could be 
      // changed pretty straightforward by looking at the AWS Amplify API Docs.
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
  
  /**
   * We render our form only when this.state.post is available.
   * Inside the form we conditionally render the part where we display the image by 
   * using this.state.post.image.
   * We format the image URL using formatFilename by stripping the timestamp we had 
   * added to the filename while uploading it.
   * We also added a delete button to allow users to delete the post. And just like the 
   * submit button it too needs a flag that signals that the call is in progress.
   * We handle images with a file input exactly like we did in the NewPost component.
   * Our delete button also confirms with the user if they want to delete the post using 
   * the browser’s confirm dialog.
   */
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