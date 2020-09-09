const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post, Image, Comment } = require("../models"); //db.User를 가져온다
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");

const router = express.Router();

//로그인 풀리지 않도록   (useEffect써주면 되겠지?)
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      //사용자가 있으면
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        //가져올 데이터
        //attributes:['id','nickname','email'] //id,nickname, email만 가져오겠다.
        attributes: { exclude: ["password"] }, //비밀번호 빼고
        //관계데이터
        include: [
          { model: Post, attributes: ["id"] }, // 개시글 말고 아이디만 (몇개 몇명인지만 세니까)
          { model: User, as: "Followings", attributes: ["id"] }, //as 써줬으면 여기서도 써줘야함
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      res.status(200).json(fullUserWithoutPassword); //쿠키 있으면 보내고
    } else {
      res.status(200).json(null); //없으면 안보내고
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//미들웨어 확장 (req,res,next를 쓰기 위해)
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    //done에서 설정한 3개
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      //원하는 로그인 데이터 넣고 빼주기
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        //가져올 데이터
        //attributes:['id','nickname','email'] //id,nickname, email만 가져오겠다.
        attributes: { exclude: ["password"] }, //비밀번호 빼고
        //관계데이터
        include: [
          { model: Post },
          { model: User, as: "Followings" }, //as 써줬으면 여기서도 써줘야함
          { model: User, as: "Followers" },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

//팔로우  patch post/:id/follow
router.patch("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    //유저가 있는 유저인지 확인
    const exUser = await User.findOne({
      where: { id: req.params.id },
    });
    if (!exUser) {
      res.status(403).send("없는 유저인데요?");
    }
    await exUser.addFollower(req.user.id); //sequelize에서 만들어준 관계메소드
    res.status(200).json({ id: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//닉네임 수정
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      //update= sequelize수정메소드
      {
        nickname: req.body.nickname, //닉네임 수정
      },
      { where: { id: req.user.id } } //로그인된 사용자의 User
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    //중복값 조회 (없으면 exUser = null)
    const exUser = await User.findOne({
      where: {
        //조건
        email: req.body.email, //email이 같은게 있는지
      },
    });
    if (exUser) {
      //exUser가 있다면 (403=상태코드(금지) ,return을 해줘야 try문 벗어난다.)
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    //암호화 (두번째 인자가 높으면 암호가 강하지만, 성능과 타협)
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok"); //status (201) = 잘 생성됨
  } catch (e) {
    console.error(e);
    next(e); //status(500)
  }
});

//프로필 페이지 팔로워 목록 가져오기  GET/user/followers
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send("없는 유저인데요?");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//프로필 페이지 팔로잉 목록 가져오기  GET/user/following
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    //조회요청 보낸 로그인된 유저 정보먼저 찾고
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send("없는 유저인데요?");
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    }); //sequelize에서 만들어준 관계메소드
    res.status(200).json(followings);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//프로필 팔로워 제거 (상대방 차단의 의미)
router.delete("/follower/:id", isLoggedIn, async (req, res, next) => {
  try {
    //나를 먼저 찾고
    const user = await User.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      res.status(403).send("없는 유저인데요?");
    }
    // 내 팔로워중 그 사람 제거  내가 끊는거랑 반대의 관계
    await user.removeFollowing(req.user.id); //sequelize에서 만들어준 관계메소드
    res.status(200).json({ id: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//언팔로우  delete post/:id/unfollow
router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    //유저가 있는 유저인지 확인
    const exUser = await User.findOne({
      where: { id: req.params.id },
    });
    if (!exUser) {
      res.status(403).send("없는 유저인데요?");
    }
    await exUser.removeFollowers(req.user.id); //sequelize에서 만들어준 관계메소드
    res.status(200).json({ id: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//특정 사용자를 가져오는 라우터
router.get("/:id", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] }, //비밀번호 빼고
      //관계데이터
      include: [
        { model: Post, attributes: ["id"] }, // 개시글 말고 아이디만 (몇개 몇명인지만 세니까)
        { model: User, as: "Followings", attributes: ["id"] }, //as 써줬으면 여기서도 써줘야함
        { model: User, as: "Followers", attributes: ["id"] },
      ],
    });
    if (fullUserWithoutPassword) {
      //다른 사람의 데이터이기 때문에 개신정보를 잘 숨겨서 보내준다.
      const data = fullUserWithoutPassword.toJSON(); // Sequelize에서 보내준 데이터를 수정하기 위해
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data); //쿠키 있으면 보내고
    } else {
      res.status(403).send("그런 유저 없습니다."); //user/10000이런경우를 위해
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//사용자의 게시글들
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐경우 이부분(초기로딩이면 0) lastId보다 작은걸 불러와라
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //보다 작은걸 불러오면 된다.
    }
    //DB여러개 가져올떄
    const posts = await Post.findAll({
      where,
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
