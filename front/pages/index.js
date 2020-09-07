import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePost,
    loadPostsLoading,
    retweetError,
  } = useSelector((state) => state.post);
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({ type: LOAD_POSTS_REQUEST, lastId });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      //리턴해서 다시 삭제 안해주면 메모리에 쌓이게 된다.
    };
  }, [hasMorePost, loadPostsLoading, mainPosts]);
  //redux에서 가져와주기

  return (
    <>
      <AppLayout>
        {me && <PostForm />}

        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AppLayout>
    </>
  );
};
//이렇게 해주면 이부분이 index보다 먼저 실행된다.
//화면을 그리기 전에 서버에서 이부분을 실행
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("getServerSideProps start");
    console.log(context.req.headers);
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
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END); //saga에서 불러옴 (끝날때까지 기다리라고)
    console.log("getServerSideProps end");
    await context.store.sagaTask.toPromise(); //(sagaTask)는 스토어에서 등록함
  }
);

export default Home;
