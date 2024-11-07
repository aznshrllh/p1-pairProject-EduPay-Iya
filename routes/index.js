const { home, register, login, logout, dashboard } = require("../controllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.redirect("/home");
}); //untuk menampilkan home
router.get("/home", home); // login dan register, jika sudah login masuk ke /dashboard/:userId, jika tidak ke register

router.get("/register", register); // untuk melakukan register/addStudent
router.post("/regiter", register); // untuk mengambil data dari register

// ! bisa di akses secara umum (teacher & student)
router.get("/dashBoard/:userId", isAuthenticated, dashboard); // untuk menampilkan dashBoard, menampilkan dashboard dengan nama, profile, dan tombol course yang nanti mengarah ke /course/add
router.get("/dashBoard/:userId/course"); // untuk mengakses course yang sudah dipilih atau mematikan (semacam fitur on dan off boolean)

// ! hanya bisa diakses oleh teacher
router.get("/dashBoard/:userId/course/add"); // untuk mengakses course yang ingin ditambahkan
router.post("/dashBoard/:userId/course/add"); // untuk mengirim pilihan course yang sudah ditambahkan
router.get("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.post("/dashBoard/:userId/course/:courseId/edit"); // untuk mengakses
router.get("/dashBoard/:userId/course/:courseId/delete"); // untuk mengakses

router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
