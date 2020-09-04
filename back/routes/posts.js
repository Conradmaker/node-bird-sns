//limit & lastId 방식
const express = require("express");
const { Post, Image, User, Comment } = require("../models/");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    //DB여러개 가져올떄
    const posts = await Post.findAll({
      limit: 10, //10개만 가져와라
      order: [
        ["createdAt", "DESC"], //게시글늦게 생성된 순서로
        [Comment, "createdAt", "DESC"], //댓글늦게 생성된 순서로
      ],

      include: [
        { model: User, attributes: ["id", "nickname"] }, //작성자
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른사람
        { model: Image },
        {
          model: Comment, //댓글작성자를 다시
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
//예를들어 20~11까지 가져오면 마지막 id가 11인데 lastId를 11로만들어주고,
//where절에 lastId를 설정해주는 것이다.
