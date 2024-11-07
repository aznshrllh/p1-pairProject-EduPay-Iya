const {
  home,
  courses,
  register,
  login,
  logout,
  dashboard,
  addCourse,
  addCoursePage,
  editCoursePage,
  manageCourses,
  deleteCourse,
  editCourse,
  manageCoursesPage,
} = require("../controllers");
const { isAuthenticated, isTeacher } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.redirect("/home");
}); //untuk menampilkan home

router.get("/login", (req, res) => {
  res.redirect("/home");
}); //untuk menampilkan home

router.get("/home", home); // login dan register, jika sudah login masuk ke /dashboard/:userId, jika tidak ke register

router.get("/register", register); // untuk melakukan register/addStudent
router.post("/register", register); // untuk mengambil data dari register

// ! bisa di akses secara umum (teacher & student)
router.get("/dashBoard/courses", courses);
router.get("/dashBoard/:userId", isAuthenticated, dashboard); // untuk menampilkan dashBoard, menampilkan dashboard dengan nama, profile, dan tombol course yang nanti mengarah ke /course/add
router.get("/dashBoard/:userId/course"); // untuk mengakses course yang sudah dipilih atau mematikan (semacam fitur on dan off boolean)

// ! hanya bisa diakses oleh teacher
router.get(
  "/dashBoard/:userId/course/add",
  isAuthenticated,
  // isTeacher,
  addCoursePage
); // untuk mengakses course yang ingin ditambahkan
router.post(
  "/dashBoard/:userId/course/add",
  isAuthenticated,
  // isTeacher,
  addCourse
); // untuk mengirim pilihan course yang sudah ditambahkan

router.get("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.post("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.get(
  "/dashBoard/:userId/course/:courseId/delete",
  isAuthenticated,
  // isTeacher,
  deleteCourse
); // untuk mengakses

router.post("/login", login);
router.get("/logout", logout);

router.get("/manageCourses", isAuthenticated, isTeacher, manageCourses);

// Route untuk menghapus course
router.get(
  "/manageCourses/delete/:courseId",
  isAuthenticated,
  // isTeacher,
  deleteCourse
);

// Route untuk halaman edit course
router.get(
  "/manageCourses/edit/:courseId",
  isAuthenticated,
  // isTeacher,
  editCoursePage
);

// Route untuk mengupdate course
router.post(
  "/manageCourses/edit/:courseId",
  isAuthenticated,
  // isTeacher,
  editCourse
);

router.get(
  "/dashBoard/:userId/manageCourses",
  isAuthenticated,
  // isTeacher,
  manageCoursesPage
);
module.exports = router;
