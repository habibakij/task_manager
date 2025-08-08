// notFoundMiddleware.js
// This middleware handles requests to routes does not exist in the application.
const notFoundMiddleware = (req, res) => {
  res.status(404).json({ msg: "Route does not exist" });
};

// errorHandlerMiddleware.js
// This middleware handles errors that occur in the application.
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("error_middleware: " + err.message);
  const defaultError = {
    statusCode: 500,
    msg: "Something went wrong, please try again later",
  };

  if (err.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.msg = err.message;
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

// Export
module.exports = { notFoundMiddleware, errorHandlerMiddleware };
