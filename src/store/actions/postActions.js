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
  ADD_NEW_POST_EVENT: 'ADD_NEW_POST_EVENT',
  ADD_NEW_POST_EVENT_ERROR: 'ADD_NEW_POST_EVENT_ERROR',
  REMOVE_POST_EVENT: 'REMOVE_POST_EVENT',
  REMOVE_POST_EVENT_ERROR: 'REMOVE_POST_EVENT_ERROR',
  UPDATE_POST_EVENT: 'UPDATE_POST_EVENT',
  UPDATE_POST_EVENT_ERROR: 'UPDATE_POST_EVENT_ERROR',
}

export const createPost = (post) => {
  return async (dispatch, getState) => {
    try {
      const newPost = await getState().base.wss.json({
        action: 'addNewPost',
        data: post
      });

      if(newPost) {
        dispatch({
          type: PostActionTypes.CREATE_POST,
          post: newPost
        });
      } 
    } catch (error) {
      dispatch({
        type: PostActionTypes.CREATE_POST_ERROR,
        error: error
      });
    }
  }
}

export const deletePost = (post) => {
  return async (dispatch, getState) => {
    try {
      await getState().base.wss.json({
        action: 'deletePost',
        data: post
      })

      dispatch({
        type: PostActionTypes.DELETE_POST,
        id: post.postId
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
      await getState().base.wss.json({
        action: 'updatePost',
        data: post
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
      const posts = await API.get("REST", "/feed-history");

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

export const addNewPostEvent = (post) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: PostActionTypes.ADD_NEW_POST_EVENT,
        post: post
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.ADD_NEW_POST_EVENT_ERROR,
        error: error
      });
    }
  }
}

export const removePostEvent = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: PostActionTypes.REMOVE_POST_EVENT,
        id: id
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.REMOVE_POST_EVENT_ERROR,
        error: error
      });
    }
  }
}

export const updatePostEvent = (post) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: PostActionTypes.UPDATE_POST_EVENT,
        post: post
      });
    } catch (error) {
      dispatch({
        type: PostActionTypes.UPDATE_POST_EVENT_ERROR,
        error: error
      });
    }
  }
}