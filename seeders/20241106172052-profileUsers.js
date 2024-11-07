"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/profileUsers.json");

    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("ProfileUsers", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProfileUsers", null, {});
  },
};
