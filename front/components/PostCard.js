import React, { useState } from "react";
import { Card, Button, Avatar, Popover, List, Comment } from "antd";

import {
  RetweetOutlined,
  HeartTwoTone,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import { REMOVE_POST_REQUEST } from "../reducers/post";
import FollowButton from "./FollowButton";
//14분 21초
export default function PostCard({ post }) {
  const { removePostLoading } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me && state.user.me.id);
  const dispatch = useDispatch();
  // const id = useSelector((state) => state.user.me?.id); //옵셔널 체이닝
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [liked, setLiked] = useState(false);
  const onToggleLike = () => {
    setLiked(!liked);
  };
  const onToggleComment = () => {
    setCommentFormOpened(!commentFormOpened);
  };
  const onRemovePost = () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          //배열
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="red" onClick={onToggleLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
      {/* <CommentForm />
      <Comment /> */}
    </div>
  );
}
