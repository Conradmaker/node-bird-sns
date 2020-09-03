//미들웨어는 (req,res,next)  중복을 제거하기 위해 생김

//로그인 유무 확인

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //passport에서 제공하는 로그인 유무 확인
    //next()만 쓰면 다음 미들웨어로, 안에 뭔가를 넣으면 에러처리로
    next();
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};

//에러처리 미들웨어로 간다는것은 다음 미들웨어로 가지 않고, app.js router다 거치고 마지막
