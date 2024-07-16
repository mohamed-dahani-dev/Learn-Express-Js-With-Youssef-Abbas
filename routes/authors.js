const express = require("express");
const router = express.Router();
const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../model/Author");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// get method
/**
@desc get all authors
@route /authors
@method get
@access public
**/

router.get("/", async (req, res) => {
  try {
    const authorsList = await Author.find().sort({ firstName: 1 });
    res.status(200).json(authorsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting authors" });
  }
});

// get one by id
/**
@desc get a author by id
@route /authors/:id
@method get
@access public
**/
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ errorMessage: "Author not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting author" });
  }
});

// post method
/**
@desc post a author
@route /authors/createauthor
@method post
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the create, else stop the create
router.post("/createauthor", verifyTokenAndAdmin, async (req, res) => {
  try {
    // validation of create author
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      address: req.body.address,
      phone: req.body.phone,
    });
    const result = await author.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong" }); // status(500) is mean somthing wrong in server
  }
});

// put method
/**
@desc update a author
@route /authors/update/:id
@method update
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the update, else stop the update
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // validation of update author
    const { error } = validateUpdateAuthor(req.body);

    if (error) {
      return res.status(400).json({ errorMessage: error.details[0].message });
    }

    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          age: req.body.age,
          address: req.body.address,
          phone: req.body.phone,
        },
      },
      { new: true } // this parameter is mean the update he show in frontend but if not use this parameter the update will be only in database
    );
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error  in updating" });
  }
});

// delete method
/**
@desc delete a author
@route /authors/delete/:id
@method delete
@access private
**/
// we give the verifyTokenAndAdmin middleware before the (req, res) to check about the token of admin, if the token of admin is correct than continue the delete, else stop the delete
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const author = Author.find(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author deleted" });
    } else {
      res.status(404).json({ message: "Author not deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error in deleting" });
  }
});

module.exports = router;
