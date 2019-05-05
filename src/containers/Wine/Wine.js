import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, Segment, Rating } from "semantic-ui-react";

import config from "../../config.js";
import "./Wine.css";
import { s3Upload } from "../../libs/awsLib.js";

/**
 * Load the wine on componentDidMount and save it to the state. We get the id of our wine 
 * from the URL using the props automatically passed to us by React-Router in 
 * this.props.match.params.id. The keyword id is a part of the pattern matching in our 
 * route (/wines/:id). If there is an image, we use the key to get a secure link to 
 * the file we uploaded to S3. We then store this to the component’s state as imageURL.
 * The reason why we have the wine object in the state along with the label and the 
 * imageURL is because we use this when the user edits the wine.
 */
export default class Wines extends Component {
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
      wine: null,
      imageURL: null
    };
    
  }

  async componentDidMount() {
    if(!this.props.isAuthenticated) {
      return;
    } 

    try {
      let imageURL;
      const wine = await this.getWine();
      const { image, label, comment, rating } = wine;

      if (image) {
        imageURL = await Storage.get(image);
      }

      const systembolagetData = await this.getSystembolagetData();

      this.setState({
        systembolagetData,
        label,
        comment,
        rating,
        wine,
        imageURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getSystembolagetData() {
    return API.get("bubbler", "/systembolaget");
  }

  getWine() {
    return API.get("bubbler", `/wines/${this.props.match.params.id}`);
  }
  
  validateForm() {
    return this.state.label.trim().length > 0 && this.state.rating !== 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = (selected) => {
    if(selected.length) {
      const label = `${selected[0].name}${selected[0].name2 === '' ? '' : ' (' + selected[0].name2 + ')'}`;
      this.setState({
        label: label
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
   * We save the wine by making a PUT request with the wine object to /wines/:id where we get the 
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
      await this.saveWine({
        image: image || this.state.wine.image,
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

  saveWine(wine) {
    return API.put("wines", `/wines/${this.props.match.params.id}`, {
      body: wine
    });
  }
  
  deleteWine() {
    return API.del("wines", `/wines/${this.props.match.params.id}`);
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
      await this.deleteWine();
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
          <b>Origin:</b> {item.origin === '' ? "Unkown" : item.origin}
        </small>
        <small>
          <b> Country:</b> {item.countryOfOrigin === '' ? "Unkown" : item.countryOfOrigin}
        </small>
      </div>,
    ];
  }

  handleRate = (e, { rating }) => this.setState({ rating })
  
  /**
   * We render our form only when this.state.wine is available.
   * Inside the form we conditionally render the part where we display the image by 
   * using this.state.wine.image.
   * We format the image URL using formatFilename by stripping the timestamp we had 
   * added to the filename while uploading it.
   * We also added a delete button to allow users to delete the wine. And just like the 
   * submit button it too needs a flag that signals that the call is in progress.
   * We handle images with a file input exactly like we did in the NewWine component.
   * Our delete button also confirms with the user if they want to delete the wine using 
   * the browser’s confirm dialog.
   */
  render() {
    const { isLoading, systembolagetData, label, wine, imageURL } = this.state;

    return (
      <div>
      {wine &&
      <Form loading={isLoading}>
        <label>Label</label>
        <Typeahead
          clearButton
          style={{marginBottom: 16}}
          labelKey={(option) => `${option.name}${option.name2 === '' ? '' : ' (' + option.name2 + ')'}`}
          options={systembolagetData}
          defaultInputValue={label}
          renderMenuItemChildren={this.renderMenuItemChildren}
          onChange={this.handleChange}
          placeholder="Choose your bubbles..."
        />
        <label>Comment</label>
        <Form.TextArea placeholder='Write a comment...' value={this.state.comment || ""} onChange={this.handleCommentChange}/>
        <label>Image</label>
        {wine.image && 
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={imageURL}
          >
            {' '+this.formatFilename(wine.image)}
          </a>
        }
        {!wine.image &&
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
