import React, { useState, useCallback } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Link from "next/link";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { logInRequestAction } from "../reducers/user";

const FormWrapper = styled(Form)`
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

export default function LoginForm({ setIsLoggedIn }) {
  const { logInLoading } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(logInRequestAction(email, password));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          name="user-email"
          value={email}
          onChange={onChangeEmail}
          type={email}
          required
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
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>

        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
}
