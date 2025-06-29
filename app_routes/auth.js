const express = require("express");
const router = express.Router();

const { register, login } = require("../app_controllers/auth_controller");

// Register route
router.post("/auth/register", register);

// Login route
router.post("/auth/login", login);

// Export the router
module.exports = router;
