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
  //관계설정
  User.associate = (db) => {
    db.User.hasMany(db.Post); //User가 Post를 많이 가질 수 있다.
    db.User.hasMany(db.Comment); //User가 Comment를 많이 가질 수 있다.
    //다대다관계는 태이블이 생성됨
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); //다대다 관계(태이블 따로) (Like 이름설정,별칭: 좋아요눌러진 게시물)
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
