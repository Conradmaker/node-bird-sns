import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "../reducers";
import rootSaga from "../sagas";

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
  debug: false, //process.env.NODE_ENV === "development",
});
export default wrapper;
