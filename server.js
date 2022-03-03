const express = require("express");
const body_parser = require("body-parser");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const url_parser = body_parser.urlencoded({ extended: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
const URI = process.env.Mongo_URI;
mongoose.connect(URI, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected");
});
const formschema = {
  user: String,
  email: String,
  password: String,
};
const Note = mongoose.model("note", formschema);

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
      let newNote = new Note({
        user: req.body.username,
        email: req.body.Email,
        password: req.body.Password,
      });
      newNote.save();
      res.send("<h1>Credentials added to the database!!</h1>");
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
