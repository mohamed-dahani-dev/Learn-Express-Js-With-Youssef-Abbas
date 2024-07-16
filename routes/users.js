const express = require("express");
const router = express.Router();
const bcrybt = require("bcrypt"); // get bcrypt
const { User, validateUpdateUser } = require("../model/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken"); // get middleware verify token from middlewares folder

/**
@desc update user
@route /users/update/id
@method put
@access private
**/

// we give the verifyTokenAndAuthorization middleware before the (req, res) to check about the token, if the token is correct than continue the update else stop the update
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // validation of update user
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    // hashig the new password
    if (req.body.password) {
      const salt = await bcrybt.genSalt(10); // genSalt(10) is mean the level of hashing
      req.body.password = await bcrybt.hash(req.body.password, salt);
    }

    // update user
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          userName: req.body.userName,
          password: req.body.password,
        },
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error updating user" });
  }
});

/**
@desc get users
@route /users
@method get
@access private (only admin)
**/

// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the get, else stop the get
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const usersList = await User.find().select("-password"); // method select is mean what you want to select but if you write dash(-) before the key that mean not select like this example
    res.status(200).json(usersList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting users" });
  }
});

/**
@desc get user by id
@route /users/id
@method get
@access private (only user hem self and admin)
**/

// we give the verifyTokenAndAuthorization middleware before the (req, res) to check about the token of admin or hem self, if the token of admin or hem self is correct than continue the get, else stop the get
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(200).json({ errorMessage: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting user" });
  }
});

/**
@desc get user
@route /users/delete/id
@method delete
@access private (only admin)
**/

// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the delete, else stop the delete
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "user deleted" });
    } else {
      res.status(404).json({ errorMessage: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error deleting user" });
  }
});

module.exports = router;
