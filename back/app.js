const express = require("express");
const postRouter = require("./routes/post");

const app = express();

app.get("/", (req, res) => {
  res.send("asdasd");
});

app.get("/api", (req, res) => {
  res.send("helloapi");
});
app.use("/post", postRouter);

app.listen(3030, () => {
  console.log("실행");
});
