const jwt = require("jsonwebtoken"); // get jsonwebtoken

// verify the token
const verifyToken = (req, res, next) => {
  // take the token and stock him in variable
  const token = req.headers.token;
  // if the token is valid
  if (token) {
    try {
      // decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // the methode verify has two parameters 1st is the token from headers and 2nd is the secret key
      // stock the decoded in user
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ errorMessage: "Invalid token" });
    }
  } else {
    res.status(401).json({ errorMessage: "no token provided" }); // status(401) is mean your not allowed or not authorized
  }
};

// verify the token and authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // validate of matching token
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ errorMessage: "you are not allowed" }); // status(403) means forbidden
    }
  });
};

// verify the token and admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // validate of matching token
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ errorMessage: "you are not allowed, only admin allowed" }); // status(403) means forbidden
    }
  });
};

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin };
