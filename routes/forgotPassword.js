const express = require("express");
const router = express.Router();
const { User, validateResetPasswordUser } = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
@desc get forgot password
@route /forgot-password
@method get
@access public
**/
router.get("/", (req, res) => {
  try {
    res.render("forgot-password");
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMessage: "Somthing Wrong please try again" });
  }
});

/**
@desc send forgot Password link
@route /forgot-password
@method post
@access public
**/
router.post("/", async (req, res) => {
  try {
    // check if the user is found
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ errorMessage: "user not found" });
    }
    // create new token
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "10m",
    });
    const link = `http://localhost:${process.env.PORT}/forgot-password/reset-password/${user._id}/${token}`;
    res
      .status(200)
      .json({ message: "Click on the link", resetPasswordLink: link });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "somthing wrong! please try again" });
  }
});

/**
@desc get reset password view
@route /forgot-password/reset-password/:userId/:token
@method get
@access public
**/
router.get("/reset-password/:userId/:token", async (req, res) => {
  try {
    // check if the user is found
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;

    // verify the token
    try {
      jwt.verify(req.params.token, secret);
      res.render("reset-password", { email: user.email });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "somthing wrong! please try again" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "somthing wrong! please try again" });
  }
});

/**
@desc change password
@route /forgot-password/reset-password/:userId/:token
@method post
@access public
**/
router.post("/reset-password/:userId/:token", async (req, res) => {
  try {
    // validate the password
    const { error } = validateResetPasswordUser(req.body);
    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    // check if the user is found
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;

    // verify the the token
    try {
      jwt.verify(req.params.token, secret);
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      user.password = req.body.password;
      await user.save();
      res.render("success-password");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "somthing wrong! please try again" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "somthing wrong! please try again" });
  }
});

module.exports = router;
