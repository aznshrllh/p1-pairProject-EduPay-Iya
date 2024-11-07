const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));
app.use(
  session({
    secret: "123", // Gantilah dengan kunci yang aman
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Gunakan secure: true jika Anda menggunakan HTTPS
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
