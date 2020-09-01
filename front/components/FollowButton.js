import React, { useCallback } from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST, FOLLOW_REQUEST } from "../reducers/user";

export default function FollowButton({ post }) {
  const { me, followLoading, unfollowLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  //팔로잉 여부
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  const onFollow = useCallback(() => {
    if (isFollowing) {
      dispatch({ type: UNFOLLOW_REQUEST, data: post.User.id });
    } else {
      dispatch({ type: FOLLOW_REQUEST, data: post.User.id });
    }
  }, [isFollowing]);
  return (
    <Button onClick={onFollow}>{isFollowing ? "언팔로우" : "팔로우"}</Button>
  );
}
