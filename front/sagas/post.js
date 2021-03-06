import axios from "axios";
import { all, fork, takeEvery, call, put, throttle } from "redux-saga/effects";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_REQUEST,
  ADD_POST_FAILURE,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_REQUEST,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_POST_FAILURE,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

async function loadUserPostsAPI(data, lastId) {
  const response = await axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
  return response.data;
}
async function loadHashtagPostsAPI(data, lastId) {
  const response = await axios.get(
    `/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}` //encodeURIComponent = 한글들어가면 에러기 때문에
  );
  return response.data;
}
async function loadPostsAPI(lastId) {
  //data가 undifined인 경우 0
  const response = await axios.get(`/posts?lastId=${lastId || 0}`); //queryString (data 캐싱도 할 수 있다.)
  return response.data;
}
function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}
async function addPostAPI(data) {
  const response = await axios.post("/post", data);
  return response.data;
}
async function removePostAPI(data) {
  const response = await axios.delete(`post/${data}`);
  return response.data;
}
async function addCommentAPI(data) {
  const response = await axios.post(`/post/${data.postId}/comment`, data);
  return response.data;
}
async function likePostAPI(data) {
  const response = await axios.patch(`/post/${data}/like`);
  return response.data;
}
async function unlikePostAPI(data) {
  const response = await axios.delete(`/post/${data}/unlike`);
  return response.data;
}
async function uploadImagesAPI(data) {
  const response = await axios.post("post/images", data); //formData를 그대로 넣어줘야 함.
  return response.data;
}
async function retweetAPI(data) {
  const response = await axios.post(`/post/${data}/retweet`); //formData를 그대로 넣어줘야 함.
  return response.data;
}
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* loadPosts(action) {
  try {
    console.log(action.lastId);
    const data = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data,
    });
  } catch (e) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: e.response.data,
    });
  }
}
function* addPost(action) {
  try {
    const data = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: data.id, //DB등록된 게시글아이디
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      data: e.response.data,
    });
  }
}

function* removePost(action) {
  try {
    const data = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: data,
    });
  } catch (e) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: e.response.data,
    });
  }
}
function* addComment(action) {
  try {
    const data = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e.response.data,
    });
  }
}
function* likePost(action) {
  try {
    const data = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e.response.data,
    });
  }
}
function* unlikePost(action) {
  try {
    const data = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e.response.data,
    });
  }
}
function* uploadImages(action) {
  try {
    const data = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e.response.data,
    });
  }
}
function* retweet(action) {
  try {
    const data = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e.response.data,
    });
  }
}
function* loadUserPosts(action) {
  try {
    const data = yield call(loadUserPostsAPI, action.data, action.lastId);
    console.log(data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* loadHashtagPosts(action) {
  try {
    const data = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    console.log(data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}
function* watchLoadPost() {
  yield takeEvery(LOAD_POST_REQUEST, loadPost);
}
function* watchAddPost() {
  yield takeEvery(ADD_POST_REQUEST, addPost);
}
function* watchAddComment() {
  yield takeEvery(ADD_COMMENT_REQUEST, addComment);
}
function* watchRemovePost() {
  yield takeEvery(REMOVE_POST_REQUEST, removePost);
}
function* watchLikePost() {
  yield takeEvery(LIKE_POST_REQUEST, likePost);
}
function* watchunlikePost() {
  yield takeEvery(UNLIKE_POST_REQUEST, unlikePost);
}
function* watchuploadImages() {
  yield takeEvery(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchRetweet() {
  yield takeEvery(RETWEET_REQUEST, retweet);
}
function* watchLoadUserPosts() {
  yield takeEvery(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
  yield takeEvery(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchLoadPost),
    fork(watchRetweet),
    fork(watchuploadImages),
    fork(watchLikePost),
    fork(watchunlikePost),
    fork(watchAddComment),
    fork(watchAddPost),
    fork(watchLoadPosts),
    fork(watchRemovePost),
  ]);
}
