import React, { useMemo } from "react";
import { Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import useInput from "../hooks/useInput";

function NicknameEditForm() {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChange] = useInput(me?.nickname || "");
  const dispatch = useDispatch();
  const onSubmit = () => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  };
  const style = useMemo(
    () => ({
      marginBottom: "28px",
      border: "1px solid #d9d9d9",
      padding: "30px",
    }),
    []
  );
  return (
    <Form style={style}>
      <Input.Search
        addonBefore="닉네임"
        enterButton="수정"
        value={nickname}
        onSearch={onSubmit}
        onChange={onChange}
      />
    </Form>
  );
}

export default NicknameEditForm;
