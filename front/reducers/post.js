import shortId from "shortid";
import { ADD_POST_TO_ME } from "./user";
import produce from "immer";
import faker from "faker";
import shortid from "shortid";

export const initialState = {
  mainPosts: [],
  imagePath: [],

  hasMorePost: true,

  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  likePostDone: false,
  likePostError: null,
  likePostLoading: false,

  unlikePostDone: false,
  unlikePostError: null,
  unlikePostLoading: false,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
};
//concat에는 항상대입을!

//액션생성
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const LIKE_POST_REQUEST = "users/LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "users/LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "users/LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "users/UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "users/UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "users/UNLIKE_POST_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});
export default function reducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS:
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.uploadImagesError = null;
        draft.imagePath = action.data; //백앤드에서 파일명을 보내줌
        break;
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = action.error;
        break;

      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.loadPostsError = null;
        draft.mainPosts = action.data.concat(draft.mainPosts); //앞에 추가해야 게시글이 위에 나타난다.
        draft.hasMorePost = draft.mainPosts.length < 50;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = false;
        draft.loadPostsError = action.error;
        break;
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.addPostError = null;
        draft.mainPosts.unshift(action.data); //앞에 추가해야 게시글이 위에 나타난다.
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostDone = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.removePostError = null;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;

      case UNLIKE_POST_REQUEST:
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        draft.unlikePostError = null;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unlikePostError = action.error;
        draft.unlikePostLoading = false;
        draft.unlikePostDone = false;
        break;

      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS: {
        //받아온 데이터중 게시글아이디로 게시글을 찾아서
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId }); //Likets에 추가
        draft.likePostLoading = false;
        draft.likePostDone = true;
        draft.likePostError = null;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostError = action.error;
        draft.likePostLoading = false;
        draft.likePostDone = false;
        break;
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentDone = false;
        draft.addCommentError = action.error;
        break;

      default:
        break;
    }
  });
}
