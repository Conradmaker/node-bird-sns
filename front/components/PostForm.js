import React, { useState, useRef, useEffect, useCallback } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import useInput from "../hooks/useInput";
import {
  addPost,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from "../reducers/post";

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
    //게시글 없으면 경고
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요");
    }
    const formData = new FormData();
    imagePath.forEach((q) => {
      formData.append("image", q); //키가 image 백에서 req.body.image
    });
    formData.append("content", text); //키가 content 백에서 req.body.content
    //이미지가 없으면 formData를 쓸 필요가 없지만, multer nono을 써보기 위해
    dispatch({ type: ADD_POST_REQUEST, data: formData });
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
  const onRemoveImage = useCallback((index) => {
    dispatch({
      type: REMOVE_IMAGE, //동기액션
      data: index,
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
        {imagePath.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img
              src={`http://localhost:3030/${v}`} //미리보기 경로(서버에 있는 이미지)
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              {/* 맵 안에 콜백에 데이터를 넣고 싶으면 고차함수로 */}
              <Button onClick={() => onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}
