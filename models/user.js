"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.ProfileUser, {
        foreignKey: "UserId",
      });
      User.hasMany(models.UserCourse, {
        foreignKey: "UserId"
      })
      User.belongsToMany(models.Course, {
        through: models.UserCourse,
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
