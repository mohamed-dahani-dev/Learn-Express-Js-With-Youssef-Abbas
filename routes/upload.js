
// --------- install multer first from npm ----------------

const express = require("express");
const router = express.Router();
const multer = require("multer"); // get multer
const path = require("path"); // get path

// storage the file or the image in multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.orginalname);
  },
});

const upload = multer({ storage });

// upload images
router.get("/", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({ message: "image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Somthing wrong please try again" });
  }
});

module.exports = router;
