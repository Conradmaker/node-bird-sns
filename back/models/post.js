module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    //대문자 단수가 소문자 복수로 저장
    "Post",
    //id는 기본으로 들어있음
    { content: { type: DataTypes.TEXT, allowNull: false } },
    {
      charset: "utf8mb4", //mb4-이모티콘
      collate: "utf8mb4_general_ci", //한글,이모티콘저장
    }
  );
  Post.associate = (db) => {
    //belongsTo는 UserId칼럼을 만들어줘서 참조관계를 만들어준다.
    db.Post.belongsTo(db.User); //개시글은 작성자에 속해있다. //post.addUser,post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //다대다 관계 //post.addHashtags
    db.Post.hasMany(db.Comment); //게시글이 Comment를 많이 가질 수 있다.//post.addComments,post.getComments
    db.Post.hasMany(db.Image); //post.addImages,post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //다대다 관계 (Like 이름설정,별칭: 좋아요누른사람)
    db.Post.belongsTo(db.Post, { as: "Retweet" }); //addRetweet
  };
  return Post;
};
