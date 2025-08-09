const bcrypt = require("bcryptjs");
const { tokenGenerate } = require("../utils/jwt_token");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Schema Validation
const registerSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .min(3, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email format"),

  phone: z
    .string()
    .nonempty("Phone is required")
    .min(10, "Phone must be at least 10 characters"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const register = async (req, res) => {
  try {
    /// Input Validate
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    const { name, email, phone, password } = parsed.data;

    /// Check user exists
    const existingUser = await prisma.userAuth.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists, Please try with different" });
    }

    /// Password Hashing and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.userAuth.create({
      data: {
        name,
        email,
        phone,
        userPassword: hashedPassword,
      },
    });

    /// Generate token
    let token;
    try {
      token = tokenGenerate({
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      });
    } catch (tokenError) {
      // If token generation fails, delete the created user
      await prisma.userAuth.delete({
        where: { id: newUser.id },
      });

      return res.status(500).json({
        error: "Failed to generate auth token",
      });
    }

    /// Success response
    return res.status(201).json({
      data: {
        message: "User registered successfully",
        token,
        userInfo: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email format"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

var login = async (req, res) => {
  try {
    var parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    const { email, password } = parsed.data;

    /// Find user
    const user = await prisma.userAuth.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    /// Check password
    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let token;
    try {
      token = tokenGenerate({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error, Token generation failed." });
    }

    return res.status(200).json({
      data: {
        message: "Login successful",
        token,
        userInfo: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};

// Export
module.exports = { register, login };
