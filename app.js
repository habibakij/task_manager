const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

const {
  notFoundMiddleware,
  errorHandlerMiddleware,
} = require("./app_middleware/error_handler");
const authRouter = require("./app_routes/auth");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(multer().none());

// routes
app.get("/api/v1/task_list", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", authRouter);

// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

// export the app for testing purposes
module.exports = app;
