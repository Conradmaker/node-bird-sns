//다이나믹 라우팅 /post/[id].js
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { END } from "redux-saga";
import axios from "axios";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";
import AppLayout from "../../components/AppLayout";
import { useEffect } from "react";

const Post = () => {
  const { singlePost, loadPostError } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query; //이렇게 URI데이터를 가져온다 .

  useEffect(() => {
    if (loadPostError) {
      alert(loadPostError);
    }
  }, [loadPostError]);
  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : "https://nodebird.com/favicon.ico"
          }
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      {singlePost ? (
        <PostCard post={singlePost} />
      ) : (
        <div>해당글이 존재하지 않습니다.</div>
      )}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    console.log(context);
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
