import { all, fork, takeEvery, call, put, delay } from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_FAILURE,
  LOG_IN_SUCCESS,
  LOG_IN_REQUEST,
  LOG_OUT_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_REQUEST,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_SUCCESS,
} from "../reducers/user";
async function loadUserAPI() {
  const response = await axios.get("/user");
  return response.data;
}
async function unfollowAPI(data) {
  const response = await axios.delete(`/user/${data}/follow`);
  return response.data;
}
async function followAPI(data) {
  const response = await axios.patch(`/user/${data}/follow`);
  return response.data;
}
async function logInAPI(data) {
  const response = await axios.post("/user/login", data);
  return response.data;
}
function logOutAPI() {
  const response = axios.post("/user/logout");
  return response;
}
function signUpAPI(data) {
  return axios.post("/user", data);
}
async function loadFollowersAPI(data) {
  const response = await axios.get("/user/followers", data);
  return response.data;
}
async function loadFollowingsAPI(data) {
  const response = await axios.get("/user/followings", data);
  return response.data;
}

async function removeFollowerAPI(data) {
  const response = await axios.delete(`user/follower/${data}`);
  return response.data;
}
async function changeNicknameAPI(data) {
  const response = await axios.patch("user/nickname", { nickname: data });
  return response.data;
}

function* loadUser() {
  try {
    const data = yield call(loadUserAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: e.response.data,
    });
  }
}
function* follow(action) {
  try {
    const data = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_FAILURE,
      error: e.response.data,
    });
  }
}
function* unfollow(action) {
  try {
    const data = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_FAILURE,
      error: e.response.data,
    });
  }
}
function* logIn(action) {
  try {
    const data = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response.data,
    });
  }
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: e.response.data,
    });
  }
}
function* signUp(action) {
  try {
    console.log("saga signup");
    const data = yield call(signUpAPI, action.data);
    console.log("saga signup done");
    console.log(data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    console.error(err);

    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}
function* changeNickname(action) {
  try {
    const data = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}
function* loadFollowers(action) {
  try {
    const data = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}
function* loadFollowings(action) {
  try {
    const data = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}
function* removeFollower(action) {
  try {
    const data = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchLoadUser() {
  yield takeEvery(LOAD_MY_INFO_REQUEST, loadUser);
}
function* watchFollow() {
  yield takeEvery(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_REQUEST, unfollow);
}
function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}
function* watchChangeNickname() {
  yield takeEvery(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  yield all([
    fork(watchRemoveFollower),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
    fork(watchChangeNickname),
    fork(watchLoadUser),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
