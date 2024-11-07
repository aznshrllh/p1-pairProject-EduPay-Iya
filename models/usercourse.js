"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    static associate(models) {
      UserCourse.belongsTo(models.Course)
      UserCourse.belongsTo(models.User)
    }
  }

  UserCourse.init(
    {
      // Kolom referensi ke tabel User
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Nama tabel di database
          key: "id", // Kolom primary key pada tabel User
        },
        allowNull: false, // Tidak boleh kosong
      },

      // Kolom referensi ke tabel Course
      CourseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Courses", // Nama tabel di database
          key: "id", // Kolom primary key pada tabel Course
        },
        allowNull: false, // Tidak boleh kosong
      },

      // Kolom statusLearning untuk menyimpan status belajar
      statusLearning: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Defaultnya adalah false
      },
    },
    {
      sequelize,
      modelName: "UserCourse",
    }
  );

  return UserCourse;
};
