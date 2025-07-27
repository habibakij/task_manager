const express = require("express");
const userRouter = express.Router();
const getProfile = require("../app_controllers/user_controller");
const tokenAuthentication = require("../app_middleware/authorization");


userRouter.get("/profile", tokenAuthentication, getProfile);

module.exports = userRouter;