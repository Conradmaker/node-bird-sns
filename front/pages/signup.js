import React, { useCallback, useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button } from "antd";
import Head from "next/head";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from "../reducers/user";
import Router from "next/router";
import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";

const PasswordError = styled.div`
  color: red;
`;

export default function signup() {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (me && me.id) {
      Router.replace("/");
    }
  }, [me && me.id]);
  useEffect(() => {
    if (signUpDone) {
      Router.replace("/");
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");

  const [check, setCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);

  const onChangeCheck = (e) => {
    setCheck(e.target.value);
    setPasswordError(e.target.value !== password); //이부분이 달라서 못한다.
  };

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  //한번더 체크
  const onSubmit = useCallback(() => {
    if (password !== check) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [password, check, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird </title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            value={email}
            onChange={onChangeEmail}
            type={email}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-check">비밀번호확인</label>
          <br />
          <Input
            name="user-check"
            type="password"
            value={check}
            onChange={onChangeCheck}
          />
        </div>
        {passwordError && (
          <PasswordError>비밀번호가 맞지 않습니다.</PasswordError>
        )}
        <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
          동의합니다.
        </Checkbox>
        {termError && <div style={{ color: "red" }}>약관에 동의해주세요</div>}
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps start");
    //쿠키 전달
    const cookie = context.req ? context.req.headers.cookie : ""; //이 안에 쿠키 들어있음.
    //쿠키 공유 방지
    axios.defaults.headers.Cookie = ""; //아닐때는 쿠키 제거
    if (context.req && cookie) {
      //서버일때 & 쿠키가 있을때만
      axios.defaults.headers.Cookie = cookie; //쿠키를 넣어주고
    }

    console.log(context); //context에는 무엇이 들어있을까?
    //기존에 useEffect에 있던걸 가져옴
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END); //saga에서 불러옴 (끝날때까지 기다리라고)
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise(); //(sagaTask)는 스토어에서 등록함
  }
);
