"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsToMany(models.User, {
        through: models.UserCourse,
      });
      Course.hasMany(models.UserCourse, {
        foreignKey: "CourseId"
      })
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT, // Update tipe data untuk description
      duration: DataTypes.INTEGER,
      videoUrl: DataTypes.STRING,
      author: DataTypes.STRING, // Ditambahkan dari migrasi 6
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
