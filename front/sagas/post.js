import axios from "axios";
import {
  all,
  fork,
  takeEvery,
  call,
  put,
  delay,
  throttle,
} from "redux-saga/effects";
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
  generateDummyPost,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortid from "shortid";

function loadPostAPI(data) {
  const response = axios.post("/api/post");
  return response.data;
}

function addPostAPI(data) {
  const response = axios.post("/api/post");
  return response.data;
}
function removePostAPI(data) {
  const response = axios.delete("/api/post");
  return response.data;
}
function addCommentAPI(data) {
  const response = axios.post(`/api/post/${data.postId}/comment`, data);
  return response.data;
}
function* loadPost(action) {
  try {
    yield delay(1000);
    const id = shortid.generate();
    // const data = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
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
    yield delay(1000);
    const id = shortid.generate();
    // const data = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: id,
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
    yield delay(1000);
    const id = shortid.generate();
    // const data = yield call(addPostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
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
    console.log("asdasd");
    yield delay(1000);
    console.log("asdasd2");
    // const data = yield call(addCOMMENTAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    console.log("asdasd3");
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: e.response.data,
    });
  }
}
function* watchLoadPost() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPost);
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

export default function* postSaga() {
  yield all([
    fork(watchAddComment),
    fork(watchAddPost),
    fork(watchLoadPost),
    fork(watchRemovePost),
  ]);
}
