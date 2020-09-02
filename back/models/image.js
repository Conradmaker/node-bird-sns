module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    //대문자 단수가 소문자 복수로 저장
    "Image",
    //id는 기본으로 들어있음
    { src: { type: DataTypes.STRING(200), allowNull: false } },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글,이모티콘저장
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
