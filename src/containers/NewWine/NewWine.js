import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import { Typeahead } from "react-bootstrap-typeahead";

import LoaderButton from "../../components/LoaderButton/LoaderButton.js";
import config from "../../config.js";
import "./NewWine.css";
import { s3Upload } from "../../libs/awsLib.js";

export default class NewWine extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      systembolagetData: [],
      content: ""
    };
  }

  async componentDidMount() {
    if(!this.props.isAuthenticated) {
      return;
    } 

    try {
      const systembolagetData = await this.getSystembolagetData();
      this.setState({ systembolagetData });
    } catch(e) {
      alert(e);
    }
  }

  getSystembolagetData() {
    return API.get("systembolaget", "/systembolaget");
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    const content = `${event[0].name} ${event[0].name2 === '' ? '' : '- ' + event[0].name2}`
    this.setState({
      content: content
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  /**
   * We make our create call in createWine by making a POST request to /wines and passing 
   * in our wine object. We upload the file using the s3Upload method.
   * We then use the returned key and add that to the wine object when we create a new wine.
   * Finally, after the wine is created we redirect to our homepage.
   */
  handleSubmit = async event => {
    event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : null;
  
      await this.createWine({
        attachment,
        content: this.state.content
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }  
  
  createWine(wine) {
    return API.post("wines", "/wines", {
      body: wine
    });
  }  

  renderMenuItemChildren = (item, index) => {
    return [
      <div key="name">
        <b>{item.name}</b> {item.name2 === '' ? '' : '- ' + item.name2}
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

  /**
   * The file input simply calls a different onChange handler (handleFileChange) that saves 
   * the file object as a class property. We use a class property instead of saving it in 
   * the state because the file object we save does not change or drive the rendering of our 
   * component.
   */
  render() {
    const props = {};
    const options = this.state.systembolagetData;
    props.renderMenuItemChildren = this.renderMenuItemChildren;
    return (
      <div className="NewWine">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <Typeahead
            {...props}
            labelKey={(option) => `${option.name} ${option.name2 === '' ? '' : '- ' + option.name2}`}
            options={options}
            onChange={this.handleChange}
            placeholder="Choose your bubbles..."
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
