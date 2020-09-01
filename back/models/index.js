const Sequelize = require("sequelize");
//환경변수
const env = process.env.NODE_ENV || "development";
//env는 현재 development
const config = require("../config/config.json")[env];

//연결
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
