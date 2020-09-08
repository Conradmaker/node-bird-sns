const express = require("express");
const { Hashtag, User, Post, Image, Comment } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  //hashtag ?
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      //이조건도 만족하고
      //초기 로딩이 아닐경우 이부분(초기로딩이면 0) lastId보다 작은걸 불러와라
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //보다 작은걸 불러오면 된다.
    }
    //DB여러개 가져올떄
    const posts = await Post.findAll({
      where, //이조건도 만족하고
      limit: 10, //10개만 가져와라
      order: [
        ["createdAt", "DESC"], //게시글늦게 생성된 순서로
        [Comment, "createdAt", "DESC"], //댓글늦게 생성된 순서로
      ],

      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        }, // 한글을 변환해서 보내줬기 떄문에 다시 변화 이조건도 만족하고
        { model: User, attributes: ["id", "nickname"] }, //작성자
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른사람
        { model: Image },
        {
          model: Comment, //댓글작성자를 다시
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        {
          //리트윗 게시글 포함하도록
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
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
