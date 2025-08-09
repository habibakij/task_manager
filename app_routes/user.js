const express = require("express");
const userRouter = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../app_controllers/user_controller");
const tokenAuthentication = require("../app_middleware/authorization");

userRouter.post("/profile", tokenAuthentication, createProfile);

userRouter.get("/profile", tokenAuthentication, getProfile);

userRouter.put("/profile/:id", tokenAuthentication, updateProfile);

module.exports = userRouter;
