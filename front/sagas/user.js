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
} from "../reducers/user";
function unfollowAPI(data) {
  //제네레이터 아님!!
  const response = axios.post("/api/unfollow");
  return response.data;
}
function followAPI(data) {
  //제네레이터 아님!!
  const response = axios.post("/api/follow");
  return response.data;
}
function logInAPI(data) {
  //제네레이터 아님!!
  const response = axios.post("/api/login");
  return response.data;
}
function logOutAPI(data) {
  //제네레이터 아님!!
  const response = axios.post("/api/logOut");
  return response.data;
}
function signUpAPI(data) {
  //제네레이터 아님!!
  const response = axios.post("/api/signUp");
  return response.data;
}
function* follow(action) {
  try {
    console.log("saga follow");
    yield delay(1000);
    //const data = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: FOLLOW_FAILURE,
      error: e.response.data,
    });
  }
}
function* unfollow(action) {
  try {
    console.log("saga unfollow");
    yield delay(1000);
    //const data = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: e.response.data,
    });
  }
}
function* logIn(action) {
  try {
    console.log("saga logIn");
    yield delay(1000);
    //const data = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response.data,
    });
  }
}

function* logOut() {
  try {
    yield delay(1000);
    // const data = yield call(signUpAPI);
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
    yield delay(1000);
    //const data = yield call(logOutAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: e.response.data,
    });
  }
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
export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
