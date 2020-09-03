const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post } = require("../models"); //db.User를 가져온다
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

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

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logOut();
  req.session.destroy();
  res.send("OK");
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
