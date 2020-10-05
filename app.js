require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require('md5');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// console.log(process.env.SECRET);

const userSchema = new mongoose.Schema({
  user: String,
  password: String
});
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"]
// });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  const newUser = new User({
    user: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
      console.log(err);
    }
  });

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({
    user: username
  }, function(err, results) {
    if (!err) {
      if (results.password === password) {
        res.render("secrets");
      } else {
        res.send("Enter correct passworrd");
      }
    } else {
      res.send(err);
      console.log(err);
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
