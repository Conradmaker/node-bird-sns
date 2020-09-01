import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import useInput from "../hooks/useInput";
import { addPost } from "../reducers/post";

export default function PostForm() {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput(text);

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const onSubmit = () => {
    dispatch(addPost(text));
  };
  const onClickImageUpload = () => {
    imageInput.current.click(); //파일 업로드
  };
  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤일이 있었나요?"
      />
      <div>
        <input type="file" mutiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          쨱
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v} style={{ width: "200px" }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}
