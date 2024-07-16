const mongoose = require("mongoose");
const Joi = require("joi"); // get library joi this library do the validation perfectly

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 255,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // we get the name of author from the collection authors and we make a relation between collection authors and books
      ref: "Author", // name of the collection that we need get data from him
      required: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 10,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      minLength: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["Soft Cover", "Hard Cover"],
    },
  },
  {
    timestamps: true,
  }
);

// validate create book
const validateCreateBook = (bodyParameter) => {
  const schema = Joi.object({
    title: Joi.string().required().trim().min(3).max(255),
    author: Joi.string().required(),
    description: Joi.string().trim().min(10),
    price: Joi.number().min(0).required(),
    cover: Joi.string().required(),
  });
  // run the validation
  return schema.validate(bodyParameter);
};

// validate update book
const validateUpdateBook = (bodyParameter) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(255),
    author: Joi.string(),
    description: Joi.string().trim().min(10),
    price: Joi.number().min(0),
    cover: Joi.string(),
  });
  // run the validation
  return schema.validate(bodyParameter);
};

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book, validateCreateBook, validateUpdateBook };
