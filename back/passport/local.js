//로그인 전략 세우는 파일
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const { Strategy: LocalStrategy } = require("passport-local");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", //프론트에서 보내는 이름 req.body.email
        passwordField: "password",
      },
      async (email, password, done) => {
        //전략
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // 서버에러, 성공 , 클라이언트에러 (보내는측 잘못보냄)
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }
          const result = await bcrypt.compare(password, user.password); //입력한 비밀번호, db비밀번호
          if (result) {
            return done(null, user);
          }
          //일치하지 않으면
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
