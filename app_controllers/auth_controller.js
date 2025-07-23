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
    return res
      .status(400)
      .json({ error: "Name is required, Please enter your name" });
  }

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }

  if (!phone) {
    return res.status(400).json({
      error: "Phone number is required, Please enter your phone number",
    });
  }

  if (!password) {
    return res.status(400).json({
      error: "Password is required, Please enter your password",
    });
  }

  var userInfo = {
    name: name,
    email: email,
    phone: phone,
  };
  res.status(201).json({ message: "Registration success", user: { userInfo } });
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

  res
    .status(200)
    .json({ message: "User logged in successfully", user: { email, password } });
};

// Export the functions
module.exports = { register, login };
