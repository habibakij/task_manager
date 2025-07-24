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

   // Validate input
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!phone) {
    return res.status(400).json({ error: "Phone is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const dbConnection = await connectDB();

    // Check if email already exists
    const [existing] = await dbConnection.execute(
      "SELECT * FROM USER_TABLE WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await dbConnection.execute(
      "INSERT INTO USER_TABLE (name, phone, email, userPassword) VALUES (?, ?, ?, ?)",
      [name, phone, email, hashedPassword]
    );

    const response = {
      message: "User registered successfully",
      userId: result.insertId,
      userInfo: {
        name: name,
        phone: phone,
        email: email,
        password: hashedPassword,
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

  // Validate input
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }

  if (!email.includes("@")) {
    return res
      .status(400)
      .json({ error: "Invalid email format, Please enter a valid email" });
  }

  if (!password) {
    return res.status(400).json({
      error: "Password is required, Please enter your password",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if(!isPasswordValid){
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10minutes",
  });

  res
    .status(200)
    .json({ message: "User logged in successfully", user: { email, password } });
};

// Export the functions
module.exports = { register, login };
