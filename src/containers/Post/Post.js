import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, Segment, Rating, Divider } from "semantic-ui-react";

import config from "../../config.js";
import "./Post.css";
import { s3Upload } from "../../libs/awsLib.js";

/**
 * Load the post on componentDidMount and save it to the state. We get the id of our post 
 * from the URL using the props automatically passed to us by React-Router in 
 * this.props.match.params.id. The keyword id is a part of the pattern matching in our 
 * route (/posts/:id). If there is an image, we use the key to get a secure link to 
 * the file we uploaded to S3. We then store this to the component’s state as imageURL.
 * The reason why we have the post object in the state along with the label and the 
 * imageURL is because we use this when the user edits the post.
 */
export default class Post extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      systembolagetData: [],
      label: "",
      comment: null,
      rating: 0,
      post: null,
      imageURL: null
    };
    
  }

  async componentDidMount() {
    if(!this.props.isAuthenticated) {
      return;
    } 

    try {
      let imageURL;
      const post = await this.getPost();
      const { image, label, comment, rating } = post;

      if (image) {
        imageURL = await Storage.get(image);
      }

      const systembolagetData = await this.getSystembolagetData();

      this.setState({
        systembolagetData,
        label,
        comment,
        rating,
        post,
        imageURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getSystembolagetData() {
    return API.get("bubbler", "/systembolaget");
  }

  getPost() {
    return API.get("bubbler", `/posts/${this.props.match.params.id}`);
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

  handleCommentChange = (e, { value }) => this.setState({ comment: value })
  
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
      await this.savePost({
        image: image || this.state.post.image,
        label: this.state.label,
        comment: this.state.comment,
        rating: this.state.rating
      });
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

  savePost(post) {
    return API.put("bubbler", `/posts/${this.props.match.params.id}`, {
      body: post
    });
  }
  
  deletePost() {
    return API.del("bubbler", `/posts/${this.props.match.params.id}`);
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
      await this.deletePost();
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
    const { isLoading, systembolagetData, label, post, imageURL } = this.state;

    return (
      <div>
      {post &&
      <Form loading={isLoading}>
        <label>Label</label>
        <Typeahead
          clearButton
          style={{marginBottom: 16}}
          labelKey={(item) => `${item.name}${item.name2 === '' ? '' : ' (' + item.name2 + ')'}`}
          options={systembolagetData}
          defaultInputValue={label}
          renderMenuItemChildren={this.renderMenuItemChildren}
          onChange={this.handleChange}
          placeholder="Choose your bubbles..."
        />
        <label>Comment</label>
        <Form.TextArea placeholder='Write a comment...' value={this.state.comment || ""} onChange={this.handleCommentChange}/>
        <label>Image</label>
        {post.image && 
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={imageURL}
          >
            {' '+this.formatFilename(post.image)}
          </a>
        }
        {!post.image &&
          <Form.Input 
            style={{marginBottom: 16}} 
            type="file" 
            accept={config.ACCEPTED_FILE_FORMATS} 
            onChange={this.handleFileChange}/>
        }
        <center>
          <Segment style={{marginBottom: 16, marginTop: 8}}>
            <center>
              <Rating icon='star' size='huge' rating={this.state.rating} onRate={this.handleRate} maxRating={10}/>
              <p> {this.state.rating}/10</p>
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
