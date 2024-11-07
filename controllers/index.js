const { formatDateRelative } = require("../helpers/formatDate");
const { formatDurationToHours } = require("../helpers/formatDuration");
const { Course, ProfileUser, User, UserCourse } = require("../models");
const bcrypt = require("bcryptjs");

exports.home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.courses = async (req, res) => {
  const { userId } = req.params;

  try {
    const courses = await Course.findAll();

    courses.forEach((course) => {
      course.durationFormatted = formatDurationToHours(course.duration); // Menambahkan field baru dengan duration yang sudah diformat
    });

    const user = await User.findByPk(userId, {
      include: UserCourse,
    });

    res.render("courses", { courses, userId, user });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

exports.myCourse = async (req, res) => {
  const { userId } = req.params;

  try {
    const courses = await UserCourse.findAll({
      include: [
        {
          model: User,
          where: {
            id: userId,
          },
        },
        {
          model: Course,
        },
      ],
    });
    res.render("myCourse", { courses, userId });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

exports.detailCourse = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    res.render("detailCourse", { course, userId });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

exports.learnCourse = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Simpan data course baru ke database
    await UserCourse.create({
      UserId: userId,
      CourseId: courseId,
      statusLearning: false,
    });

    // Redirect kembali ke halaman dashboard user
    res.redirect(`/dashBoard/${userId}/course`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while adding course.");
  }
};

exports.finishCourse = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Simpan data course baru ke database
    await UserCourse.update(
      {
        statusLearning: true,
      },
      {
        where: {
          CourseId: courseId,
        },
      }
    );

    // Redirect kembali ke halaman dashboard user
    res.redirect(`/dashBoard/${userId}/course`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while adding course.");
  }
};

exports.register = async (req, res) => {
  if (req.method === "POST") {
    const { email, password, confirmPassword, name, age, gender, role } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).render("register", {
        message: "Invalid password!",
      });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .render("register", { message: "Email has been used" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, role });
      await ProfileUser.create({
        UserId: user.id,
        name,
        age,
        gender,
        role,
      });

      res.redirect(`/dashBoard/${user.id}`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("register", { message: "Terjadi kesalahan saat registrasi." });
    }
  } else {
    res.render("register");
  }
};

exports.addCoursePage = (req, res) => {
  const userId = req.params.userId;

  if (req.session.userId !== parseInt(userId)) {
    return res.redirect("/login");
  }
  res.render("addCourse", { userId });
};

exports.addCourse = async (req, res) => {
  const { userId } = req.params;
  const { name, description, duration, videoUrl, author } = req.body;
  // console.log(req.body);
  try {
    if (!name || !description || !duration || !author) {
      return res.status(400).send("All fields are required.");
    }

    const newCourse = await Course.create({
      name,
      description,
      duration,
      videoUrl,
      author,
    });

    res.redirect(`/dashBoard/${userId}`);
  } catch (error) {
    console.error("Error while saving course:", error);
    res.status(500).send("Error while adding course.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [ProfileUser],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.id;
      req.session.role = user.ProfileUser.role;
      // console.log("Session after login:", req.session);
      res.redirect(`/dashBoard/${user.id}`);
    } else {
      res.render("home", { message: "Invalid email or password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during login.");
  }
};

exports.logout = (req, res) => {
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Could not log out.");
      }
      res.redirect("/home");
    });
  } else {
    res.redirect("/home");
  }
};

exports.dashboard = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (req.session.userId !== parseInt(userId)) {
      return res.status(403).send("Unauthorized access");
    }

    const user = await User.findByPk(userId, {
      include: [
        ProfileUser,
        {
          model: Course,
          through: { attributes: ["statusLearning"] },
        },
      ],
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const profile = user.ProfileUser;
    const courses = user.Courses;
    const role = req.session.role || profile.role;

    res.render("dashboard", {
      userId: userId,
      role: role,
      name: profile.name,
      age: profile.age,
      courses: courses,
    });
  } catch (error) {
    console.log("Dashboard error:", error);
    res.status(500).send("Error retrieving dashboard data");
  }
};

exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    await course.destroy();
    res.redirect("/dashBoard/:userId/manageCourses");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting course");
  }
};

exports.editCoursePage = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.render("editCourse", { course, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving course data for editing.");
  }
};

exports.editCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, description, duration, videoUrl, author } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    await course.update({
      name,
      description,
      duration,
      videoUrl,
      author,
    });

    res.redirect(`/dashBoard/${req.params.userId}/manageCourses`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating course");
  }
};

exports.manageCoursesPage = async (req, res) => {
  const { userId } = req.params;
  try {
    const courses = await Course.findAll();

    if (!courses || courses.length === 0) {
      console.log("No courses found");
    }

    courses.forEach((course) => {
      course.duration = formatDurationToHours(course.duration);
      course.uploadedAt = formatDateRelative(course.createdAt);
    });

    res.render("manageCourses", { courses, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching courses.");
  }
};
