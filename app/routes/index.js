require("dotenv").config();
var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");

const passport = require("passport");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register", { title: "Express" });
  })
  .post(function (req, res, next) {
    try {
      const userData = new userModel({
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
      });

      userModel.register(userData, req.body.password).then(function () {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/home");
        });
      });
    } catch (err) {
      console.log(err);
      next(new Error("somthing went Wrong"));
    }
  });

router
  .route("/")
  .get(function (req, res, next) {
    res.render("login", { error: req.flash("error") });
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
    }),
    function (req, res) {}
  );

router
  .route("/home")
  .get(isLoggedIn, async (req, res, next) => {
    try {
      const user = await userModel.findOne({
        username: req.session.passport.user,
      });

      res.render("home", { user });
    } catch (err) {
      console.log(err);
      next(new Error("somthing went Wrong"));
    }
  })

router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
