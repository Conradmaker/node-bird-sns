import React, { useMemo } from "react";
import { Form, Input } from "antd";

function NicknameEditForm() {
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
      <Input.Search addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
}

export default NicknameEditForm;
