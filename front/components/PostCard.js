import React, { useState, useCallback, useEffect } from "react";
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
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export default function PostCard({ post }) {
  const { removePostLoading, retweetError } = useSelector(
    (state) => state.post
  );
  const id = useSelector((state) => state.user.me && state.user.me.id);
  const dispatch = useDispatch();
  // const id = useSelector((state) => state.user.me?.id); //옵셔널 체이닝
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  //직접 만들자
  const liked = post.Likers.find((v) => v.id === id); //개시글 좋아요 사람들중 내가 있는지
  const onLike = () => {
    dispatch({ type: LIKE_POST_REQUEST, data: post.id });
  };
  const onUnLike = () => {
    dispatch({ type: UNLIKE_POST_REQUEST, data: post.id });
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
  const onRetweet = useCallback(() => {
    if (!id) {
      //로그인 안한사람 막기
      return alert("로그인 해주세요");
    }
    return dispatch({ type: RETWEET_REQUEST, data: post.id });
  });

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          //배열
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone twoToneColor="red" onClick={onUnLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
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
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗` : null}
        extra={id && <FollowButton post={post} />}
      >
        {/* 리트윗 된 게시글인지 아닌지에 따른 렌더링 */}
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div style={{ float: "right" }}>
              {dayjs(post.createdAt).format("YYYY.MM.DD")}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: "right" }}>
              {dayjs(post.createdAt).format("YYYY.MM.DD")}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
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
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
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
