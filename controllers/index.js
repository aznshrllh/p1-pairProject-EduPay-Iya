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

exports.courses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    console.log("courses", courses);
    res.render("courses", { courses });
  } catch (error) {
    console.log(error);
    res.send(error.message);
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

exports.addCoursePage = (req, res) => {
  const userId = req.params.userId;

  // Validasi user ID sesuai dengan session
  if (req.session.userId !== parseInt(userId)) {
    return res.redirect("/login"); // Redirect jika ID tidak sesuai
  }
  // res.send("testing");
  res.render("addCourse", { userId }); // Render halaman addCourse.ejs dan kirimkan userId
};

exports.addCourse = async (req, res) => {
  const { userId } = req.params;
  const { name, description, duration, videoUrl, author } = req.body;
  console.log(req.body);
  try {
    // Validasi input
    if (!name || !description || !duration || !author) {
      return res.status(400).send("All fields are required.");
    }

    // Simpan data course baru ke database
    const newCourse = await Course.create({
      name,
      description,
      duration,
      videoUrl,
      author,
    });

    // Jika berhasil disimpan, redirect ke dashboard
    res.redirect(`/dashBoard/${userId}`);
  } catch (error) {
    console.error("Error while saving course:", error);
    res.status(500).send("Error while adding course.");
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
      console.log("Session:", req.session);
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

exports.manageCourses = async (req, res) => {
  try {
    // Mengambil semua course dari database
    const courses = await Course.findAll();

    // Render halaman untuk menampilkan semua course
    res.render("manageCourses", { courses });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving courses");
  }
};

exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Hapus course berdasarkan id
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    await course.destroy();
    res.redirect("/manageCourses"); // Redirect kembali ke halaman manage courses
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting course");
  }
};

exports.editCoursePage = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.render("editCourse", { course });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving course data");
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

    res.redirect("/manageCourses"); // Redirect ke halaman manage courses setelah update
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating course");
  }
};

// exports.manageCoursesPage = async (req, res) => {
//   const { userId } = req.params; // Ambil userId dari URL parameter

//   try {
//     // Mengambil kursus yang dimiliki oleh user (teacher)
//     const courses = await Course.findAll({
//       include: {
//         model: User,
//         where: { id: userId }, // Pastikan hanya kursus milik user yang diambil
//         through: { attributes: [] }, // Tidak mengambil kolom dari tabel pivot
//       },
//     });

//     // Cek apakah kursus ditemukan
//     if (courses.length === 0) {
//       return res.render("manageCourses", {
//         courses: [],
//         userId,
//         message: "No courses found",
//       });
//     }

//     // Render halaman manageCourses.ejs dan kirimkan data courses
//     res.render("manageCourses", { courses, userId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error fetching courses.");
//   }
// };

exports.manageCoursesPage = async (req, res) => {
  const { userId } = req.params; // Ambil userId dari URL parameter

  try {
    // Mengambil semua kursus
    const courses = await Course.findAll();

    // Render halaman manageCourses.ejs dan kirimkan data courses dan userId
    res.render("manageCourses", { courses, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching courses.");
  }
};
