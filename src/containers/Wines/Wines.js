import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton.js";
import config from "../../config.js";
import "./Wines.css";
import { s3Upload } from "../../libs/awsLib.js";

/**
 * Load the wine on componentDidMount and save it to the state. We get the id of our wine 
 * from the URL using the props automatically passed to us by React-Router in 
 * this.props.match.params.id. The keyword id is a part of the pattern matching in our 
 * route (/wines/:id). If there is an attachment, we use the key to get a secure link to 
 * the file we uploaded to S3. We then store this to the component’s state as attachmentURL.
 * The reason why we have the wine object in the state along with the content and the 
 * attachmentURL is because we use this when the user edits the wine.
 */
export default class Wines extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      wine: null,
      content: "",
      attachmentURL: null
    };
    
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const wine = await this.getWine();
      const { content, attachment } = wine;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        wine,
        content,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getWine() {
    return API.get("wines", `/wines/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }
  
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleFileChange = event => {
    this.file = event.target.files[0];
  }
  
  saveWine(wine) {
    return API.put("wines", `/wines/${this.props.match.params.id}`, {
      body: wine
    });
  }
  
  /**
   * If there is a file to upload we call s3Upload to upload it and save the key we get from S3.
   * We save the wine by making a PUT request with the wine object to /wines/:id where we get the 
   * id from this.props.match.params.id. We use the API.put() method from AWS Amplify.
   * And on success we redirect the user to the homepage.
   */
  handleSubmit = async event => {
    let attachment;
  
    event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }
  
      // As of now, we are not deleting the old attachment when we upload a new one. Could be 
      // changed pretty straightforward by looking at the AWS Amplify API Docs.
      await this.saveWine({
        content: this.state.content,
        attachment: attachment || this.state.wine.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  deleteWine() {
    return API.del("wines", `/wines/${this.props.match.params.id}`);
  }
  
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this wine?"
    );
  
    if (!confirmed) {
      return;
    }
  
    this.setState({ isDeleting: true });
  
    try {
      // As of now, we are not deleting the attachment when we upload a new one. Could be 
      // changed pretty straightforward by looking at the AWS Amplify API Docs.
      await this.deleteWine();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }
  
  
  /**
   * We render our form only when this.state.wine is available.
   * Inside the form we conditionally render the part where we display the attachment by 
   * using this.state.wine.attachment.
   * We format the attachment URL using formatFilename by stripping the timestamp we had 
   * added to the filename while uploading it.
   * We also added a delete button to allow users to delete the wine. And just like the 
   * submit button it too needs a flag that signals that the call is in progress.
   * We handle attachments with a file input exactly like we did in the NewWine component.
   * Our delete button also confirms with the user if they want to delete the wine using 
   * the browser’s confirm dialog.
   */
  render() {
    return (
      <div className="Wines">
        {this.state.wine &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.wine.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.wine.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.wine.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }  
}
