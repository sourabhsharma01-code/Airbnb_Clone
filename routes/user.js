const express = require('express');
const router = express.Router();
const User = require("../models/user")
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const userConroller = require("../controllers/users")


router.get("/signup", userConroller.signUpForm);

router.post("/signup", wrapAsync(userConroller.signUp));


router.get("/login", userConroller.loginForm);

//failureRedirect means if user not authentcate failed to login for any reason redirect to login page and fauilreflash means user not login forn any reason this is used for flash a message
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
//   , async (req, res) => {
//     res.redirect("/listings")
//   })

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userConroller.login
);

router.get("/logout", userConroller.logout)



module.exports = router;
