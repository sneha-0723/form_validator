const express = require("express");
const body_parser = require("body-parser");
const app = express();
const { check, validationResult } = require("express-validator");
const url_parser = body_parser.urlencoded({ extended: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("signup");
});
app.post(
  "/result",
  url_parser,
  [
    check("username", "This username must be atleast 3 characters long")
      .exists()
      .isLength({ min: 3 }),
    check("Email", "Email is not valid").isEmail(),
    check("Password", "password must be atleast 8 characters long").isLength({
      min: 8,
    }),
  ],
  (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("signup", { alert });
    } else {
      res.send("<h1>Credentials accepted</h1>");
    }
  }
);
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
