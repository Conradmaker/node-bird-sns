import React, { useState, useRef, useEffect, useCallback } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import useInput from "../hooks/useInput";
import { addPost, UPLOAD_IMAGES_REQUEST } from "../reducers/post";

export default function PostForm() {
  const { imagePath, addPostDone } = useSelector((state) => state.post);
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
  const onChangeImages = useCallback((e) => {
    console.log("images", e.target.files); //e.target.files안에 선택한 이미지가 들어있다.
    const imageFormData = new FormData();
    //배열이 아니기 때문에 배열의 forEach를 빌려쓰는것
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });
  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
      name="image"
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤일이 있었나요?"
      />
      <div>
        <input
          type="file"
          mutiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          쨱
        </Button>
      </div>
      <div>
        {imagePath.map((v) => (
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
