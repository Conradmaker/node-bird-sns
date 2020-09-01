import React from "react";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons"; //아이콘은 용량이 크기 때문에 따로있다.

export default function FollowList({ header, data }) {
  return (
    <List
      style={{ marginBottom: 20 }}
      //list이지만 grid로
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card actions={[<StopOutlined key="stop" />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
}
