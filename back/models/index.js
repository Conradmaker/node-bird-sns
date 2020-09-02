const Sequelize = require("sequelize");
//환경변수
const env = process.env.NODE_ENV || "development";
//env는 현재 development
const config = require("../config/config.json")[env];
const db = {};

//연결
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
//태이블 생성
db.Comment = require("./comment")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
//관계설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
