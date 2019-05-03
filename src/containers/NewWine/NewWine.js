import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
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
      label: ""
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
    return this.state.label.length > 0;
  }

  handleChange = (selected) => {
    if(selected.length) {
      const label = `${selected[0].name}${selected[0].name2 === '' ? '' : ' (' + selected[0].name2 + ')'}`;
      this.setState({
        label: label
      });
    }
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
  
    if (this.file && this.file.size > config.MAX_IMAGE_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_IMAGE_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      const image = this.file
        ? await this.fileUpload(this.file)
        : null;
  
      await this.createWine({
        image,
        label: this.state.label
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
  
  createWine(wine) {
    return API.post("wines", "/wines", {
      body: wine
    });
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

  /**
   * The file input simply calls a different onChange handler (handleFileChange) that saves 
   * the file object as a class property. We use a class property instead of saving it in 
   * the state because the file object we save does not change or drive the rendering of our 
   * component.
   */
  render() {
    const options = this.state.systembolagetData;

    return (
      <div className="NewWine">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="label">
            <Typeahead
            clearButton
            labelKey={(option) => `${option.name}${option.name2 === '' ? '' : ' (' + option.name2 + ')'}`}
            options={options}
            renderMenuItemChildren={this.renderMenuItemChildren}
            onChange={this.handleChange}
            placeholder="Choose your bubbles..."
            />
          </FormGroup>
          <FormGroup controlId="file">
            <FormControl type="file" accept={config.ACCEPTED_FILE_FORMATS} onChange={this.handleFileChange}/>
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
