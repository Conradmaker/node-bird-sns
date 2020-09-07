//다이나믹 라우팅 /post/[id].js

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
    alert(loadPostError);
  }, [loadPostError]);
  return (
    <>
      {singlePost ? (
        <AppLayout>
          <PostCard post={singlePost} />
        </AppLayout>
      ) : (
        <AppLayout>해당 아이디에 해당하는 글이 없네요..</AppLayout>
      )}
    </>
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
