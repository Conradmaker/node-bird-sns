import { Button, Form, Input } from "antd";
import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST, addComment } from "../reducers/post";

export default function CommentForm({ post }) {
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);
  const onSubmitComment = () => {
    console.log(commentText, post.id, id);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  };

  const onChangeCommentText = (e) => {
    setCommentText(e.target.value);
  };
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea
          rows={4}
          value={commentText}
          onChange={onChangeCommentText}
        />
        <Button
          style={{ position: "absolute", right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
}
