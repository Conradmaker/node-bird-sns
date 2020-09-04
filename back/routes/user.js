const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post } = require("../models"); //db.User를 가져온다
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

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

module.exports = router;
