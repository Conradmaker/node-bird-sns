const express = require("express");
const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

//게시글 등록 POST /post
router.post("/", async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, //deserializeUser에서 가져오는 것.(req.user로 접근)
    });
    //Image 추가해주기
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        { model: Comment },
        { model: User, attributes: ["id", "nickname"] }, //작성자
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른사람
      ],
    });
    res.status(201).json(fullPost); //생성되었다고 프론트로
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//댓글등록
router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  //:id는 parameter
  try {
    //백앤드에서 철저히 검사를 해줘야 한다. (개시글이 있는 개시글인지)
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.send.status(403).send("존재하지 않는 개시글입니다");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.id, 10), //:id 에 있는 정보
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment); //생성되었다고 프론트로
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.patch("/:id/like", async (req, res, next) => {
  //일단 게시글이 있는지 찾는다.
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    //관계데이터를보면 sequlize에서 addLikers, post.removeLikers같은 메서드가 생긴다. post.js참고
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete("/:id/unlike", async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
