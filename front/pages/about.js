import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>Conrad | NodeBird</title>
      </Head>
      {userInfo ? ( //SSR이 되야만 userInfo가 들어있다.
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch({
      type: LOAD_USER_REQUEST, //특정한 사용자정보를 가져오는 것.
      data: 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Profile;

//getStaticProps는 한번 만들면 왠만하면 바뀌지 않는 데이터를 SSR할때
//getSetverSideProps는 동적 데이터를 다룰때 사용한다 .
//getStaticProps는 빌드할때 처음부터 html로만들어주기 때문에 쓸수 있으면 쓰는게 좋지만, 쓰는 환경은 까다롭다.
//getStaticProps는 서버로 요청할때 html로만들어주기 때문에 서버에 부하가 조금 더하다 .
