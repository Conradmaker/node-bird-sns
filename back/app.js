const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config();

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("연결성공");
  })
  .catch(console.error());
passportConfig();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //쿠키공유
  })
);
//'/'는 localhost:3030/을 가르킨다.
//path.join하면 __dirname(back)에 'uploads'를 합쳐준다.
//이렇게 하면 서버쪽 폴더구조가 가려져서 보안에 유리하다.
app.use("/", express.static(path.join(__dirname, "uploads")));
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
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

//에러처리 미들웨어 (err,req,res,next) 4개
//에러페이지를 보내주거나, 에러 내용은 바꾼다거나..
//원래는 내부적으로 존재함
app.use((err, req, res, next) => {});

app.listen(3030, () => {
  console.log("실행");
});
