const {
  home,
  courses,
  myCourse,
  detailCourse,
  learnCourse,
  finishCourse,
  register,
  login,
  logout,
  dashboard,
  addCourse,
  addCoursePage,
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
router.get("/dashBoard/:userId/course/all", courses);
router.get("/dashBoard/:userId", isAuthenticated, dashboard); // untuk menampilkan dashBoard, menampilkan dashboard dengan nama, profile, dan tombol course yang nanti mengarah ke /course/add
router.get("/dashBoard/:userId/course", myCourse); // untuk mengakses course yang sudah dipilih atau mematikan (semacam fitur on dan off boolean)
router.get("/dashBoard/:userId/course/:courseId/detail", detailCourse); 
router.get("/dashBoard/:userId/course/:courseId/learn", learnCourse); 
router.get("/dashBoard/:userId/course/:courseId/finish", finishCourse); 

// ! hanya bisa diakses oleh teacher
router.get(
  "/dashBoard/:userId/course/add",
  isAuthenticated,
  isTeacher,
  addCoursePage
); // untuk mengakses course yang ingin ditambahkan
router.post(
  "/dashBoard/:userId/course/add",
  isAuthenticated,
  isTeacher,
  addCourse
); // untuk mengirim pilihan course yang sudah ditambahkan
router.get("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.post("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.get("/dashBoard/:userId/course/:courseId/delete"); // untuk mengakses

router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
