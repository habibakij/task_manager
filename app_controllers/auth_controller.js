const bcrypt = require("bcryptjs");
const { tokenGenerate } = require("../utils/jwt_token");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Registration schema validation
const registerSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is required",
    })
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email format"),

  phone: z
    .string({
      required_error: "Phone is required",
      invalid_type_error: "Phone is required",
    })
    .min(10, "Phone must be at least 10 characters"),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),

  // Optional fields
  profilePic: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  profession: z.string().optional(),
  nationality: z.string().optional(),
});

const register = async (req, res) => {
  try {
    // Input Validate
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    const {
      name,
      email,
      phone,
      password,
      profilePic,
      gender,
      birthDate,
      address,
      profession,
      nationality,
    } = parsed.data;

    // Check user exists
    const existingUser = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists, Please try with different" });
    }

    // Password Hashing and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.userRegistration.create({
      data: {
        name,
        email,
        phone,
        userPassword: hashedPassword,
        profilePic: profilePic ?? null,
        gender: gender ?? null,
        birthDate: birthDate ?? null,
        address: address ?? null,
        profession: profession ?? null,
        nationality: nationality ?? null,
      },
    });

    // Token generate
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
      await prisma.userRegistration.delete({
        where: { id: newUser.id },
      });

      return res.status(500).json({
        error: "Failed to generate auth token",
      });
    }

    // Success response
    return res.status(201).json({
      data: {
        message: "User registered successfully",
        token,
        userInfo: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          profilePic: newUser.profilePic,
          gender: newUser.gender,
          birthDate: newUser.birthDate,
          address: newUser.address,
          profession: newUser.profession,
          nationality: newUser.nationality,
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

// login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(3, "Email is required")
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

    // Find user
    const user = await prisma.userRegistration.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
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
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

// get profile
var getProfile = async (req, res) => {
  try {
    const data = await prisma.userRegistration.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePic: true,
        gender: true,
        birthDate: true,
        address: true,
        profession: true,
        nationality: true,
      },
    });

    // Success response
    return res.status(201).json({
      data: {
        message: "User Profile",
        count: data.length,
        data: data,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

// profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone must be at least 10 characters").optional(),

  // Other optional fields
  email: z
    .string()
    .min(3, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email format")
    .optional(),
  password: z.string().optional(),
  profilePic: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  profession: z.string().optional(),
  nationality: z.string().optional(),
});

var updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    const findUser = await prisma.userRegistration.findUnique({
      where: { id: parseInt(id) },
    });
    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Destructure to remove password from update
    const { password, email, ...updateFields } = parsed.data;

    await prisma.userRegistration.update({
      where: { id: parseInt(id) },
      data: updateFields,
    });

    return res.status(201).json({
      data: {
        message: "Update successfully",
        data: updateFields,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

// Export
module.exports = { register, login, getProfile, updateProfile };
