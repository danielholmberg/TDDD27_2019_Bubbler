import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, Rating, Segment, Divider } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import config from "../../config.js";
import "./NewPost.css";
import { s3Upload } from "../../libs/awsLib.js";
import { createPost } from "../../store/actions/postActions.js";

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      productId: null,
      price: 0,
      country: null,
      volume: 0,
      label: "",
      comment: null,
      rating: 0,
    };
  }

  async componentDidMount() {
    if(!this.props.isAuthenticated) {
      return;
    } 
  }

  validateForm() {
    return this.state.label.trim().length > 0 && this.state.rating !== 0;
  }

  handleChange = (selected) => {
    console.log('selected:',selected[0]);
    if(selected.length) {
      this.setState({
        productId: selected[0].itemId, // Artikel-id
        price: selected[0].price,
        country: selected[0].countryOfOrigin === '' ? "Unkown" : selected[0].countryOfOrigin,
        volume: selected[0].volume,
        label: `${selected[0].name}${selected[0].name2 === '' ? '' : ' (' + selected[0].name2 + ')'}`
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
   * We make our create call in createPost by making a POST request to /posts and passing 
   * in our Post object. We upload the file using the s3Upload method.
   * We then use the returned key and add that to the Post object when we create a new post.
   * Finally, after the post is created we redirect to our homepage.
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
  
      const newPost = {
        userId: this.props.user.username,
        productId: this.state.productId,
        price: this.state.price,
        country: this.state.country,
        volume: this.state.volume,
        image: image,
        label: this.state.label,
        comment: this.state.comment,
        rating: this.state.rating,
      };

      await this.props.createPost(newPost);
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
   * The file input simply calls a different onChange handler (handleFileChange) that saves 
   * the file object as a class property. We use a class property instead of saving it in 
   * the state because the file object we save does not change or drive the rendering of our 
   * component.
   */
  render() {
    const { isLoading, rating } = this.state;
    const { systembolagetData, mobile } = this.props;

    return (
      <Form style={{marginBottom: 16, width: mobile ? '100%' : '75%'}} className='NewPostForm' size='small' loading={isLoading}>
        <label>Label</label>
        <Typeahead
          clearButton
          style={{marginBottom: 16}}
          labelKey={(item) => `${item.name}${item.name2 === '' ? '' : ' (' + item.name2 + ')'}`}
          options={systembolagetData}
          renderMenuItemChildren={this.renderMenuItemChildren}
          onChange={this.handleChange}
          placeholder="Choose your bubbles..."
        />
        <label>Comment</label>
        <Form.TextArea placeholder='Write a comment...' onChange={this.handleCommentChange}/>
        <label>Image</label>
        <Form.Input style={{marginBottom: 16}} type="file" accept={config.ACCEPTED_FILE_FORMATS} onChange={this.handleFileChange}/>
        <center>
          <Segment style={{marginBottom: 16}}>
            <center>
              <Rating icon='star' size='massive' rating={rating} onRate={this.handleRate} maxRating={5}/>
              <p> {rating} out of 5</p>
            </center>
          </Segment>
          <Form.Button style={{width: '50%'}} color='blue' disabled={!this.validateForm()} onClick={this.handleSubmit}>Add</Form.Button> 
        </center>
      </Form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('NewPost state:', state);
  console.log('NewPost ownProps:', ownProps);
  return {
    isAuthenticated: state.auth.isAuthenticated,
    systembolagetData: state.base.systembolagetData,
    user: state.auth.user,
    mobile: state.base.mobile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (post) => dispatch(createPost(post)),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewPost));