import React from "react";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import LoginForm from "./loginForm";
import styled from "styled-components";
import UserProfile from "./UserProfile";
import { useSelector } from "react-redux";

const SearchInput = styled(Input.Search)`
  vertical-align: center;
`;
export default function AppLayout({ children }) {
  const { me, logInDone } = useSelector((state) => state.user);

  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput
            enterButton
            style={{ verticalAlign: "middle" }}
          ></SearchInput>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {logInDone ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://ant.design/components/grid/"
            target="_blank"
            rel="noreferrer noopener"
          >
            made by Conrad
          </a>
        </Col>
      </Row>
    </>
  );
}
