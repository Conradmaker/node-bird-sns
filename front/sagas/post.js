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
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

async function loadPostAPI(data) {
  const response = await axios.get("/posts");
  return response.data;
}

async function addPostAPI(data) {
  const response = await axios.post("/post", { content: data });
  return response.data;
}
function removePostAPI(data) {
  const response = axios.delete("/api/post");
  return response.data;
}
async function addCommentAPI(data) {
  const response = await axios.post(`/post/${data.postId}/comment`, data);
  return response.data;
}
function* loadPost() {
  try {
    const data = yield call(loadPostAPI);
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
