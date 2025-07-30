const express = require("express");
const cors = require("cors");
const multer = require("multer");
const helmet = require("helmet");
const limit = require("express-rate-limit");

const app = express();
const limiter = limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

const {
  notFoundMiddleware,
  errorHandlerMiddleware,
} = require("./app_middleware/error_handler");
const authRouter = require("./app_routes/auth");
const taskRouter= require("./app_routes/task");
const userRouter = require("./app_routes/user");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(multer().none());
app.use(helmet());
app.use(limiter);

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/user", userRouter);

// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// export the app for testing purposes
module.exports = app;
