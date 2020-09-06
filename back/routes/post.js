const express = require("express");
const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");
const multer = require("multer");
const path = require("path"); //노드 기본 제공
const fs = require("fs"); //파일시스템 조작 (기본제공)

const router = express.Router();
//폴더 생성
try {
  fs.accessSync("uploads"); //업로드 폴더가 있는지 검사를 하고,
} catch (e) {
  //없으면
  console.log("폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  //어디에 저장
  storage: multer.diskStorage({
    destination(req, res, done) {
      //저장위치
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 같은 이름을 가지게 되면 덮어써지기 때문에 시간을 넣어준다.
      const ext = path.extname(file.originalname); //확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); //파일명만 가져올 수 있다.(conrad)
      done(null, basename + new Date().getTime() + ext); //conrad15184812928.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB로 제한
});
//나중에는 서버로 경로를 바꿔준다.
//컴터로 하게되면 서버를 옮길때마다 복사를 하기 때문에 서버용량을 잡아먹는다.
//왠만하면 서버를 거치면 자원을 먹기 때문에 프론트에서 바로 서버로 올려준다.

//게시글 등록 POST /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    //해쉬태그 추출
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            //있으면 등록 없으면 등록 X
            where: { name: tag.slice(1).toLowerCase() }, //slice로 #때준다.
          })
        )
      ); // [[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }
    //image는 front에서append로 정해준 키
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        //이미지를 여러개 올리면 image:[1.png,2.png]
        const images = await Promise.all(
          //한번에 모두 완료되면 올려준다.
          req.body.image.map((image) => Image.create({ src: image })) //Image 모델에 넣어준다.
        );
        await post.addImages(images); //Sequelize매소드로 images를 넣어준다.
      } else {
        //이미지를 하나만 올리면 image:1.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    //DB에는 IMAGE를 올리지 않고 서버에 가지고 있다가 DB에는 경로만 저장하는게 좋음 (DB는 캐싱 불가)
    //Image 추가해주기
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        { model: Comment },
        { model: User, attributes: ["id", "nickname"] }, //작성자
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른사람
      ],
    });
    res.status(201).json(fullPost); //생성되었다고 프론트로
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//댓글등록
router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  //:id는 parameter
  try {
    //백앤드에서 철저히 검사를 해줘야 한다. (개시글이 있는 개시글인지)
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.send.status(403).send("존재하지 않는 개시글입니다");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.id, 10), //:id 에 있는 정보
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment); //생성되었다고 프론트로
  } catch (e) {
    console.error(e);
    next(e);
  }
});
//삭제 (작성과 삭제는 정검을 철저히!!!)
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      //sequelize에서삭제메소드
      where: {
        id: req.params.id,
        UserId: req.user.id, //보안을위해 자기 자신아이디일경우만
      },
    });
    res.status(200).json({ id: parseInt(req.params.id, 10) }); //params는 문자열
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//좋아요
router.patch("/:id/like", isLoggedIn, async (req, res, next) => {
  //일단 게시글이 있는지 찾는다.
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    //관계데이터를보면 sequlize에서 addLikers, post.removeLikers같은 메서드가 생긴다. post.js참고
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete("/:id/unlike", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//이미지 업로드용 라우터
// router마다 폼을 받는 형식이 다를 수 있기 때문에 post에서만 multer를 사용
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    console.log(req.files); //업로드된 파일들req.files에 담김
    res.json(req.files.map((v) => v.filename));
  }
);

module.exports = router;
