const express = require("express");
const router = express.Router();
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../model/Book");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// get method
// get all books
// get method
/**
@desc get all books
@route /books
@method get
@access public
**/
router.get("/", async (req, res) => {
  try {
    // populate is mean replace the id of author to name or lastName or anything  you want from collection author
    const bookList = await Book.find().populate("author", [
      "_id",
      "firstName",
      "lastName",
    ]);
    res.status(200).json(bookList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMessage: "Books not found" });
  }
});

// get book by id or get one book
// get one by id
/**
@desc get a book by id
@route /books/:id
@method get
@access public
**/
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book); // status(200) is mean no error or success
    } else {
      res.status(404).json({ errorMessage: "Book not found" }); // status(404) is mean error
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMessage: "Book not found" });
  }
});

// post method
/**
@desc post a book
@route /books/createbook
@method post
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the create, else stop the create
router.post("/createbook", verifyTokenAndAdmin, async (req, res) => {
  try {
    // validation of create book
    const { error } = validateCreateBook(req.body);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message }); // status 400 is mean the problem from the client
    }
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMessage: "Somthing Wrong" });
  }
});

// put method
/**
@desc update a book
@route /books/update/:id
@method update
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the update, else stop the update
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // validation of upadte book
    const { error } = validateUpdateBook(req.body);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error updating book" });
  }
});

// delete method
/**
@desc delete a book
@route /books/delete/:id
@method delete
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the delete, else stop the delete
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const book = Book.find(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Book Deleted" }); // status(200) is mean no error or success
    } else {
      res.status(404).json({ errorMessage: "Book not found" }); // status(404) is mean error
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMessage: "Book not deleted" });
  }
});

module.exports = router;
