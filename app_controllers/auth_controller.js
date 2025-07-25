const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../app_config/db_connection");

var register = async (req, res) => {
  const { name, email, phone, password, ...extraFields } = req.body;

  // Reject if there are any unexpected fields
  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({
      error: `Unexpected fields: ${Object.keys(extraFields).join(", ")}`,
    });
  }

  // input validation
  if (!name) {
    return res
      .status(400)
      .json({ error: "Name is required, Please enter your name" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email address, Please enter valid email address",
    });
  }
  if (!phone) {
    return res
      .status(400)
      .json({ error: "Phone is required, Please enter your phone number" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: "Password is required, Please enter password" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const dbConnection = await connectDB();

    // Check if email already exists
    const [existing] = await dbConnection.execute(
      "SELECT * FROM USER_TABLE WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Email already exists, Please try with different" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await dbConnection.execute(
      "INSERT INTO USER_TABLE (name, phone, email, userPassword) VALUES (?, ?, ?, ?)",
      [name, phone, email, hashedPassword]
    );

    const response = {
      message: "User registered successfully",
      userInfo: {
        id: result.insertId,
        name: name,
        phone: phone,
        email: email,
      },
    };

    res.status(201).json({ data: response });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

var login = async (req, res) => {
  const { email, password, ...extraFields } = req.body;

  // Reject if there are any unexpected fields
  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({
      error: `Unexpected fields: ${Object.keys(extraFields).join(", ")}`,
    });
  }

  // input validation
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email address, Please enter valid email address",
    });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: "Password is required, Please enter password" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const dbConnection = await connectDB();
    const [findUser] = await dbConnection.execute(
      "SELECT * FROM USER_TABLE WHERE email = ?",
      [email]
    );
    if (findUser.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = findUser[0];
    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export
module.exports = { register, login };
