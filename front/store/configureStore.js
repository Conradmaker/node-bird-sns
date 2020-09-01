import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware, compose } from "redux";
import reducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas"; //미리 import

function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware(); //만드들기
  const middlewares = [sagaMiddleware]; //적용
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares)) //배포용
      : composeWithDevTools(applyMiddleware(...middlewares)); //개발용
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga); //추가(rootSaga는 직접 작성)
  return store;
};
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});
export default wrapper;
