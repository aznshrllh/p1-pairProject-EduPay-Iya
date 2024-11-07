exports.isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/home"); // Arahkan ke halaman home jika belum login
  }
  next(); // Lanjutkan ke controller berikutnya jika sudah login
};

// Middleware untuk memastikan pengguna adalah teacher
exports.isTeacher = (req, res, next) => {
  if (req.session.role !== "teacher") {
    return res.redirect(`/dashBoard/${req.session.userId}`); // Redirect ke dashboard jika bukan teacher
  }
  next(); // Lanjutkan ke controller berikutnya jika role adalah teacher
};
