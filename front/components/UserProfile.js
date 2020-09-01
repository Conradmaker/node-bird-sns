import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logOutRequestAction } from "../reducers/user";

export default function UserProfile({ setIsLoggedIn }) {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        //배열이기때문에 키
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="following">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
}
