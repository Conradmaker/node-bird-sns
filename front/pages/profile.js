import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import { useSelector } from "react-redux";
import Router from "next/router";

export default function profile() {
  const { me } = useSelector((state) => state.user);
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
