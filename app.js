const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");

app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
