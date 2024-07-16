const express = require("express");
const router = express.Router();
const bcrybt = require("bcrypt"); // get bcrypt
const jwt = require("jsonwebtoken"); // get jsonwebtoken
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../model/User");

/**
@desc register new user
@route /auth/register
@method post
@access public
**/

router.post("/register", async (req, res) => {
  try {
    // validation of register user
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    let user = await User.findOne({
      email: req.body.email,
      userName: req.body.userName,
    });
    if (user) {
      return res
        .status(400)
        .json({ errorMessage: "this user is already registered" });
    }
    // hashig the password
    const salt = await bcrybt.genSalt(10); // genSalt(10) is mean the level of hashing
    req.body.password = await bcrybt.hash(req.body.password, salt);

    // create new user
    user = new User({
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
    });

    const result = await user.save();

    // create a jsonwebtoken with method sign() this method has three parameters the 1st is the payload (the data) 2st is the token or the secret key and 3rd is the expire of token ex: { expiresIn: "1d" }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    const { password, ...others } = result._doc;
    res.status(201).json({ ...others, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong please try again" });
  }
});

/**
@desc login user
@route /auth/login
@method post
@access public
**/

router.post("/login", async (req, res) => {
  try {
    // validation of login user
    const { error } = validateLoginUser(req.body);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ errorMessage: "email or password incorrect or invalid" });
    }

    // unhash the password before login
    // the compare you have give here two parameters the 1st is password of client and 2st the password of the database to be compared between the two
    const isPasswordMatch = await bcrybt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        errorMessage: "email or password incorrect or invalid",
      });
    }

    // create a jsonwebtoken with method sign() this method has three parameters the 1st is the payload (the data) 2st is the token or the secret key and 3rd is the expire of token ex: { expiresIn: "1d" }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong please try again" });
  }
});

module.exports = router;
