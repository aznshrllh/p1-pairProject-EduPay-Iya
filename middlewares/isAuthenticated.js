const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login"); // Jika tidak ada session, arahkan ke login
  }
  next(); // Jika sudah login, lanjutkan ke controller berikutnya
};

module.exports = isAuthenticated;
