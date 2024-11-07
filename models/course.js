"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsToMany(models.User, {
        through: models.UserCourse,
        foreignKey: "CourseId",
      });
      Course.hasMany(models.UserCourse, {
        foreignKey: "CourseId"
      })
    }

    get byAuthor() {
      let addBy = `by ${this.author}`
      return addBy
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
  Course.beforeValidate((course, options) => {
    if (!course.name || course.name.trim() === "") {
      throw new Error("Course name is required");
    }

    if (!course.description || course.description.trim() === "") {
      throw new Error("Course description is required");
    }

    if (course.duration == null || course.duration <= 0) {
      throw new Error("Course duration must be a positive number");
    }

    if (!course.videoUrl) {
      throw new Error("Valid video URL is required");
    }

    if (!course.author || course.author.trim() === "") {
      throw new Error("Course author is required");
    }
  });
  return Course;
};
