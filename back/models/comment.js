module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    //대문자 단수가 소문자 복수로 저장
    "Comment",
    //id는 기본으로 들어있음
    { content: { type: DataTypes.TEXT, allowNull: false } },
    {
      charset: "utf8mb4", //mb4-이모티콘
      collate: "utf8mb4_general_ci", //한글,이모티콘저장
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); //댓글은 작성자에 속해있다.
    db.Comment.belongsTo(db.Post); //댓글은 작성자에 속해있다.
  };
  return Comment;
};
