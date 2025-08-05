const express = require("express");
const userRouter = express.Router();
const {
  getProfileData,
  updateUserProfile,
} = require("../app_controllers/user_controller");
const tokenAuthentication = require("../app_middleware/authorization");

userRouter.get("/profile", tokenAuthentication, getProfileData);

userRouter.put("/profile/update", tokenAuthentication, updateUserProfile);

module.exports = userRouter;
