const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("연결성공");
  })
  .catch(console.error());
passportConfig();

app.use(
  cors({
    origin: "*",
  })
);
//req.body를 읽기 위해
app.use(express.json()); // json형식받기
app.use(express.urlencoded({ extended: true })); //form-submit을 했을때
//로그인위해
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("asdasd");
});

app.get("/api", (req, res) => {
  res.send("helloapi");
});
app.use("/post", postRouter);
app.use("/user", userRouter);

//에러처리 미들웨어 (err,req,res,next) 4개
//에러페이지를 보내주거나, 에러 내용은 바꾼다거나..
//원래는 내부적으로 존재함
app.use((err, req, res, next) => {});

app.listen(3030, () => {
  console.log("실행");
});
