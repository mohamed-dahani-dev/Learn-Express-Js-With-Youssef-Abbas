const mongoose = require("mongoose");
const Joi = require("joi"); // get library joi this library do the validation perfectly

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 255,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 4,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// validation register user
const validateRegisterUser = (bodyparameter) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().min(5).max(255).required(),
    userName: Joi.string().trim().min(4).max(255).required(),
    password: Joi.string().trim().min(6).max(255).required(),
  });
  // run the validation
  return schema.validate(bodyparameter);
};

// validation login user
const validateLoginUser = (bodyparameter) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().min(5).max(255).required(),
    password: Joi.string().trim().min(6).max(255).required(),
  });
  // run the validation
  return schema.validate(bodyparameter);
};

// validation Reset Password
const validateResetPasswordUser = (bodyparameter) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).max(255).required(),
  });
  // run the validation
  return schema.validate(bodyparameter);
};

// validation update user
const validateUpdateUser = (bodyparameter) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().min(5).max(255),
    userName: Joi.string().trim().min(4).max(255),
    password: Joi.string().trim().min(6).max(255),
  });
  return schema.validate(bodyparameter);
};

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateResetPasswordUser,
  validateUpdateUser,
};
