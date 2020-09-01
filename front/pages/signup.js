import React, { useCallback, useState } from "react";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button } from "antd";
import Head from "next/head";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";

const PasswordError = styled.div`
  color: red;
`;

export default function signup() {
  const dispatch = useDispatch();
  const { signUpLoading } = useSelector((state) => state.user);

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
