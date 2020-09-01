module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    //대문자 단수가 소문자 복수로 저장
    "User",
    //id는 기본으로 들어있음
    {
      //데이터 타입              Null값 불허        고유값
      email: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      nickname: { type: DataTypes.STRING(30), allowNull: false },
      password: { type: DataTypes.STRING(100), allowNull: false }, //암호화하면 길이 늘어나서 넉넉히
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글저장
    }
  );
  User.associate = (db) => {};
  return User;
};
