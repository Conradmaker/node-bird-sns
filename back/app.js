const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const cors = require("cors");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");

const app = express();

db.sequelize.sync().then(() => {
  console.log("연결성공").catch(console.error());
});

passportConfig();

app.use(
  cors({
    origin: "*",
  })
);
//req.body를 읽기 위해
app.use(express.json()); // json형식받기
app.use(express.urlencoded({ extended: true })); //form-submit을 했을때
app.use(session());
app.use(passport.initialize());
app.use(passport.session);

app.get("/", (req, res) => {
  res.send("asdasd");
});

app.get("/api", (req, res) => {
  res.send("helloapi");
});
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3030, () => {
  console.log("실행");
});
