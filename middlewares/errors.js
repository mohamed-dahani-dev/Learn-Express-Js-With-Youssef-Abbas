const notFount = (req, res, next) => {
    const error = new Error(req.originalUrl + " - Not Found");
    res.status(404);
    // next parameter will move the error or data or anything to next middleware
    next(error);
  }

  module.exports = notFount;