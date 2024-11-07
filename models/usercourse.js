'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCourse.init({
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    statusLearning: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserCourse',
  });
  return UserCourse;
};