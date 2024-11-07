"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    static associate(models) {}
  }
  UserCourse.init(
    {
      CourseId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      statusLearning: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserCourse",
    }
  );
  return UserCourse;
};
