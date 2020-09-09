import React from "react";
import Head from "next/head";
import "antd/dist/antd.css";
import wrapper from "../store/configureStore";
//import withReduxSaga from "next-redux-saga"; //next와 redux-saga를 연결해주는 library
//필요없어짐
const _app = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>Wongeun</title>
      </Head>
      <Component />
    </>
  );
};
//감싸준다.

//wrapper로 서버사이드 렌더링 진행
export default wrapper.withRedux(_app); //saga로 한번더 덮어준다.
