"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProfileUser extends Model {
    static associate(models) {
      ProfileUser.belongsTo(models.User);
    }
  }
  ProfileUser.init(
    {
      UserId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      role: DataTypes.STRING,
      gender: DataTypes.STRING, // Ditambahkan dari migrasi 5
    },
    {
      sequelize,
      modelName: "ProfileUser",
    }
  );
  return ProfileUser;
};
