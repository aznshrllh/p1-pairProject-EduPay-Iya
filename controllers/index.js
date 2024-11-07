const { Course, ProfileUser, User, Usercourse } = require("../models");

exports.home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.courses = async (req, res) => {    
    try {
        const courses = await Course.findAll()
        res.render('courses', { courses })
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
}