const { Course, ProfileUser, User, Usercourse } = require("../models");
const bcrypt = require("bcryptjs");

exports.home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.register = async (req, res) => {
  if (req.method === "POST") {
    const { email, password, confirmPassword, name, age, gender, role } =
      req.body;

    // Validasi apakah password dan confirmPassword cocok
    if (password !== confirmPassword) {
      return res.status(400).render("register", {
        message: "Password dan konfirmasi password tidak cocok!",
      });
    }

    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .render("register", { message: "Email sudah digunakan." });
      }

      // Enkripsi password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user baru
      const user = await User.create({ email, password: hashedPassword, role });

      // Simpan profil pengguna
      await ProfileUser.create({
        UserId: user.id,
        name,
        age,
        gender,
        role,
      });

      // Redirect ke halaman dashboard setelah registrasi sukses
      res.redirect(`/dashBoard/${user.id}`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("register", { message: "Terjadi kesalahan saat registrasi." });
    }
  } else {
    res.render("register"); // Render halaman register untuk GET request
  }
};

exports.addCourse = async (req, res) => {
  const { userId } = req.params;
  const { name, description, duration, videoUrl, author } = req.body;

  try {
    await Course.create({ name, description, duration, videoUrl, author });
    res.redirect(`/dashBoard/${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Jika password cocok, set session user
      req.session.userId = user.id;
      req.session.role = user.role;

      // console.log("Session UserId:", req.session.userId);
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
  // Cek apakah ada session yang aktif
  if (req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Could not log out.");
      }
      res.redirect("/home"); // Arahkan kembali ke halaman home setelah logout
    });
  } else {
    res.redirect("/home"); // Jika tidak ada session aktif, langsung redirect ke home
  }
};

exports.dashboard = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: [ProfileUser, Course], // Ambil data profile dan courses
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const profile = user.ProfileUser;
    const role = profile.role;
    const courses = user.Courses; // Daftar kursus yang diambil oleh user

    // Render dashboard dan kirim data userId, role, dan courses ke template
    res.render("dashboard", {
      userId: userId,
      role: role,
      name: profile.name,
      age: profile.age,
      courses: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving dashboard data");
  }
};

exports.editCourse = async (req, res) => {
  const { userId, courseId } = req.params;
  const { name, description, duration, videoUrl, author } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (course) {
      course.name = name;
      course.description = description;
      course.duration = duration;
      course.videoUrl = videoUrl;
      course.author = author;
      await course.save();
      res.redirect(`/dashBoard/${userId}`);
    } else {
      res.status(404).send("Course not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.deleteCourse = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (course) {
      await course.destroy();
      res.redirect(`/dashBoard/${userId}`);
    } else {
      res.status(404).send("Course not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
