const express = require("express"); // get express
const app = express(); // stored express in app
app.use(express.json()); // read the body parameters + apply middleware and you have to get him on the top
app.set("view engine", "ejs"); // set the default view engine like ejs or pug
app.use(express.urlencoded({ extended: false })); // define the urlencoded to define the data fom ejs file
const path = require("path");
app.use("/", express.static(path.join(__dirname, "images"))); // read the static file like images
const bookPath = require("./routes/book"); // import book from routes files
const authorPath = require("./routes/authors"); // import auther from routes files
const authPath = require("./routes/auth"); // import auth from routes files
const usersPath = require("./routes/users"); // import auth from routes files
const forgotpasswordPath = require("./routes/forgotPassword"); // import forgotPassword from routes files
const uploadPath = require("./routes/upload"); // import upload from routes files
const notFound = require("./middlewares/errors"); // get middleware error from middlewares folder
const dotenv = require("dotenv"); // get dotenv
const connectToMongoDB = require("./config/db");
dotenv.config(); // run dotenv in app.js

// connect with database
connectToMongoDB();

// if you want to import books or authors from routes you have to use this function
app.use("/books", bookPath);
app.use("/authors", authorPath);
app.use("/auth", authPath);
app.use("/users", usersPath);
app.use("/forgot-password", forgotpasswordPath);
app.use("/upload", uploadPath);

// Error handler Middleware
// the middleware must be always under of the path or routes
// this middleware will create the error and moved to the other middleware to show it
app.use(notFound);

// that middleware he show the errors and he receives the next paramter from the middleware
app.use((err, req, res, next) => {
  // err middleware he show the error to frontend or the client
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ errorMessage: err.message });
});

// listen on port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `the server is running in ${process.env.NODE_ENV} and listening on port ${port}`
  );
});
