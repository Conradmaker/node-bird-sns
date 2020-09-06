import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

export default function index() {
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
    dispatch({ type: LOAD_MY_INFO_REQUEST });
    dispatch({ type: LOAD_POSTS_REQUEST });
  }, [dispatch]);
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
}
