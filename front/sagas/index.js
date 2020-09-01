//function* = generator함수

//generator함수는 .next()를 붙여줘야 실행된다.
//yeild가 있는곳에서 멈추기 때문에 중단점이 있는 함수이다.
//그래서 saga에서는 while(true) 반복문도 무한반복이 되지 않는다.
//실제로 JS에서 무한의 개념을 표현하고 싶을 때 generator를 사용한다.
//또한 특정 이벤트(.next())가 실행되었을때 실행되기 때문에 EventListner로 볼수있다.
import { all, fork } from "redux-saga/effects";
import postSaga from "./post";
import userSaga from "./user";

export default function* rootSaga() {
  // all은 배열을 받아 한방에 실행해준다
  yield all([
    //fork는 함수를 실행한다.
    fork(userSaga),
    fork(postSaga), //call이랑 구분되지만 지금은 상관없다..
    //차이점은 call은 비동기 실행이지만, fork는 동기이다.
    //한마디로 fork, call은 함수를 실행할 수 있게 해주는데 all은 그것들을 동시에 실행할 수 있게 만듬.
  ]);
}
