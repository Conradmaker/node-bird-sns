import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import {
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import useSWR from "swr"; //swr불러오기
// 이부분을 axios가 아닌 다른걸로 하면 graphQL도 불러올 수 있습니다.
const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

export default function profile() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  //버튼 누를때마다 limit 3씩 올려주자
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  //useSWR은 훅이에요
  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3030/user/followers?limit=${followersLimit}`, //한번에 3개씩 가져오기 위해 다음은 6 다음은 9
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3030/user/followings?limit=${followingsLimit}`,
    fetcher
  );
  //data, error 둘다 없으면 로딩중

  //이걸 바꾸는 거에요
  // useEffect(() => {
  //   dispatch({ type: LOAD_FOLLOWERS_REQUEST });
  //   dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  // }, [dispatch]);
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/"); //넥스트라우터
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit(followersLimit + 3);
  });
  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit(followingsLimit + 3);
  });
  if (!me) {
    return null;
  }
  //hooks는 항상 같은 횟수, 즉 모두 실행되야 하기 때문에 hooks를 다 끝내고 return이 있는걸
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로링/팔로워 로딩중 에러 발생</div>;
  }
  return (
    <div>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </div>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps start");
    //쿠키 전달
    const cookie = context.req ? context.req.headers.cookie : ""; //이 안에 쿠키 들어있음.
    //쿠키 공유 방지
    axios.defaults.headers.Cookie = ""; //아닐때는 쿠키 제거
    if (context.req && cookie) {
      //서버일때 & 쿠키가 있을때만
      axios.defaults.headers.Cookie = cookie; //쿠키를 넣어주고
    }

    console.log(context); //context에는 무엇이 들어있을까?
    //기존에 useEffect에 있던걸 가져옴
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END); //saga에서 불러옴 (끝날때까지 기다리라고)
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise(); //(sagaTask)는 스토어에서 등록함
  }
);
//이 페이지도 동적 데이터를 보여주기 때문에 ServerSideProps
