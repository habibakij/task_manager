const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../app_controllers/auth_controller");
const tokenAuthentication = require("../app_middleware/authorization");

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// get profile
router.get("/profile", tokenAuthentication, getProfile);

// profile update
router.put("/profile/:id", tokenAuthentication, updateProfile);

// Export the router
module.exports = router;
