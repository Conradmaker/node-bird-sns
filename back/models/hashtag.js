module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    //대문자 단수가 소문자 복수로 저장
    "Hashtag",
    //id는 기본으로 들어있음
    { name: { type: DataTypes.STRING(20), allowNull: false } },
    {
      charset: "utf8mb4", //mb4-이모티콘
      collate: "utf8mb4_general_ci", //한글,이모티콘저장
    }
  );
  Hashtag.associate = (db) => {};
  return Hashtag;
};
