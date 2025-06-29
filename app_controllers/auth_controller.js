export const register = async (req, res) => {
  const { name, userEmail, userPhone, password } = req.body;

  // Validate input
  if (!name) {
    return res
      .status(400)
      .json({ error: "Name is required, Please enter your name" });
  }

  if (!userEmail) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }

  if (!userPhone) {
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
    email: userEmail,
    phone: userPhone,
  };
  res.status(201).json({ message: "Registration success", user: { userInfo } });
};

export const login = async (req, res) => {
  const { userEmail, password } = req.body;

  // Validate input
  if (!userEmail) {
    return res
      .status(400)
      .json({ error: "Email is required, Please enter your email" });
  }

  if (!userEmail.includes("@")) {
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
    .json({ message: "User logged in successfully", user: { userEmail } });
};
