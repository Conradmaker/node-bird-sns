//limit & offset 방식의 infiniti scrolling
const express = require("express");
const { Post } = require("../models/");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    //DB여러개 가져올떄
    const posts = await Post.fingAll({
      limit: 10, //10개만 가져와라
      offset: 10, //11~20만큼 가져와라
      order: [["createdAt", "DESC"]], //늦게 생성된 순서로
    });
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//치명적인 단점이, 중간에 이용자가 게시글을 지워버리거나 새로 작성하면 큰일나게 된다.
//예를들면 새로운 게시글을 추가하면, 하나가 중복되어서 가져와지며,
//하나를 삭제하면 하나가 안불러와질 수 있다.
//그래서 이 방식은 잘 이용하지 않는다. 대신 lastid를 사용한다.
