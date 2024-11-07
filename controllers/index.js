const { Course, ProfileUser, User, Usercourse } = require("../models");

exports.home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
