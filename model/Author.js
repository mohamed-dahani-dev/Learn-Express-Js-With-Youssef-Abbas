const mongoose = require("mongoose"); // import mongoose
const Joi = require("joi"); // get library joi this library do the validation perfectly

// crate schema types for author
const authorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      required: true,
    },
    age: {
      type: Number,
      trim: true,
      minLength: 1,
      maxLength: 120,
    },
    address: {
      type: String,
      trim: true,
      minLength: 5,
      maxLength: 200,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      minLength: 8,
      maxLength: 30,
    },
  },
  {
    timestamps: true,
  }
);

// validate create author
const validateCreateAuthor = (bodyParameter) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100).required(),
    lastName: Joi.string().trim().min(3).max(100).required(),
    age: Joi.number().min(1).max(120),
    address: Joi.string().trim().min(5).max(200).required(),
    phone: Joi.string().trim().min(8).max(30),
  });
  // run the validation
  return schema.validate(bodyParameter);
};

// validate update author
const validateUpdateAuthor = (bodyParameter) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100),
    lastName: Joi.string().trim().min(3).max(100),
    age: Joi.number().min(1).max(120),
    address: Joi.string().trim().min(5).max(200),
    phone: Joi.string().trim().min(8).max(30),
  });
  // run the validation
  return schema.validate(bodyParameter);
};

const Author = mongoose.model("Author", authorSchema);
module.exports = { Author, validateCreateAuthor, validateUpdateAuthor };
