import { API } from "aws-amplify"; 

export const PostActionTypes = {
  CREATE_POST: 'CREATE_POST',
  CREATE_POST_ERROR: 'CREATE_POST_ERROR',
  DELETE_POST: 'DELETE_POST',
  DELETE_POST_ERROR: 'DELETE_POST_ERROR',
  UPDATE_POST: 'UPDATE_POST',
  UPDATE_POST_ERROR: 'UPDATE_POST_ERROR',
  GET_FEED_HISTORY: 'GET_FEED_HISTORY',
  GET_FEED_HISTORY_ERROR: 'GET_FEED_HISTORY_ERROR',
}

export const createPost = (post) => {
  return async (dispatch, getState) => {
    try {
      const newPost = await API.post("bubbler", "/posts", {
        body: post
      });

      dispatch({
        type: PostActionTypes.CREATE_POST,
        post: newPost
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.CREATE_POST_ERROR,
        error: error
      });
    }
  }
}

export const deletePost = (id) => {
  return async (dispatch, getState) => {
    try {
      await API.del("bubbler", `/posts/${id}`);

      dispatch({
        type: PostActionTypes.DELETE_POST,
        id: id
      })
    } catch (error) {
      dispatch({
        type: PostActionTypes.DELETE_POST_ERROR,
        error: error
      })
    }
  }
}

export const updatePost = (post) => {
  return async (dispatch, getState) => {
    try {
      await API.put("bubbler", `/posts/${post.postId}`, {
        body: post
      });

      dispatch({
        type: PostActionTypes.UPDATE_POST,
        post: post
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.UPDATE_POST_ERROR,
        error: error
      })
    }
  }
}

export const getFeedHistory = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await API.get("bubbler", "/feed");
      console.log('getFeedHistory:', posts);
      dispatch({
        type: PostActionTypes.GET_FEED_HISTORY,
        posts: posts
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.GET_FEED_HISTORY_ERROR,
        error: error
      });
    }
  }
}