import { PostActionTypes } from "../actions/postActions";

const initState = {
  posts: [],
  hasFeedHistory: false,
}

const postReducer = (state = initState, action) => {
  switch(action.type) {

    // CREATE
    case PostActionTypes.CREATE_POST:
      console.log(PostActionTypes.CREATE_POST);
      return {
        ...state,
        posts: [...state.posts, action.post]
      }

    case PostActionTypes.CREATE_POST_ERROR:
      console.log('Create post error', action.error);
      return state;

    // DELETE
    case PostActionTypes.DELETE_POST:
      console.log(PostActionTypes.DELETE_POST, action.id);
      return {
        ...state,
        posts: state.posts.filter((post) => post.postId !== action.id)
      }

    case PostActionTypes.DELETE_POST_ERROR:
      console.log('Delete post error', action.error);
      return state;

    // UPDATE
    case PostActionTypes.UPDATE_POST:
      console.log(PostActionTypes.UPDATE_POST, action.post.postId);
      return {
        ...state,
        posts: [...state.posts, action.post]
      }

    case PostActionTypes.UPDATE_POST_ERROR:
      console.log('Update post error', action.error);
      return state;
     
    // GET FEED HISTORY
    case PostActionTypes.GET_FEED_HISTORY:
      console.log(PostActionTypes.GET_FEED_HISTORY);
      return {
        ...state,
        posts: action.posts,
        hasFeedHistory: true
      }

    case PostActionTypes.GET_FEED_HISTORY_ERROR:
      console.log('Get feed history error', action.error);
      return state;

    // ADD NEW POST
    case PostActionTypes.ADD_NEW_POST:
      console.log(PostActionTypes.ADD_NEW_POST);
      return {
        ...state,
        posts: [...state.posts, action.post]
      }

    case PostActionTypes.ADD_NEW_POST_ERROR:
      console.log('Add new post error', action.error);
      return state;

    // ADD NEW POST
    case PostActionTypes.REMOVE_POST:
      console.log(PostActionTypes.REMOVE_POST, action.id);
      return {
        ...state,
        posts: state.posts.filter((post) => post.postId !== action.id)
      }

    case PostActionTypes.REMOVE_POST_ERROR:
      console.log('Remove post error', action.error);
      return state;
  
    // DEFAULT
    default:
      return state;
  }
}

export default postReducer;
