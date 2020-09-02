const passport = require("passport");
const local = require("./local");

//passport설정
module.exports = () => {
  passport.serializeUser(() => {});
  passport.deserializeUser(() => {});

  local();
};
