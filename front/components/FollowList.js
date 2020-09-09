import React from "react";
import { List, Button, Card } from "antd";
import { StopOutlined } from "@ant-design/icons"; //아이콘은 용량이 크기 때문에 따로있다.
import { useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";

export default function FollowList({ header, data, onClickMore, loading }) {
  const dispatch = useDispatch();
  const onCancel = (id) => {
    if (header === "팔로잉") {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    } else {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    }
  };
  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, xs: 2, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <Button onClick={onClickMore} loading={loading}>
            더 보기
          </Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          {/*반복문 안에서 온클릭같은게 있다면 반복문에 대한 데이터를 넘겨줄때가 있는데 이때 고차함수 유용 */}
          <Card
            actions={[
              <StopOutlined key="stop" onClick={() => onCancel(item.id)} />,
              //     onClick={onCencel(item.id)}이렇게 하고, const onCencel=(id)=>()=>{}이렇게도 가능
            ]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
}
