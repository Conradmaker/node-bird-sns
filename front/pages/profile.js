import React, { useEffect } from "react";
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

export default function profile() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  }, [dispatch]);
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/"); //넥스트라우터
    }
  }, [me && me.id]);
  if (!me) {
    return null;
  }
  return (
    <div>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
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
