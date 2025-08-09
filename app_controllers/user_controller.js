const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

/// create profile
const profileCreateSchema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .min(2, "First Name must be at least 2 characters"),

  lastName: z
    .string()
    .nonempty("Last Name is required")
    .min(2, "Last Name must be at least 2 characters"),

  gender: z
    .string()
    .nonempty("Gender is required")
    .min(1, "Gender must be at least 1 characters"),

  birthDate: z
    .string()
    .nonempty("Birth Date is required")
    .min(4, "Birth Date must be at least 4 characters"),

  phone: z
    .string()
    .nonempty("Phone is required")
    .min(10, "Phone must be at least 10 characters"),

  email: z
    .string()
    .min(3, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), "Invalid email format"),

  address: z
    .string()
    .nonempty("Address is required")
    .min(4, "Address must be at least 4 characters"),

  profession: z
    .string()
    .nonempty("Profession is required")
    .min(2, "Profession must be at least 2 characters"),

  nationality: z
    .string()
    .nonempty("Nationality is required")
    .min(2, "Nationality must be at least 2 characters"),
});

var createProfile = async (req, res) => {
  try {
    // Validate input data
    const parsed = profileCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message);
      return res.status(400).json({
        message: "Validation failed",
        error: errorMessage[0],
      });
    }

    // Check if email already exists (optional - if you want unique emails)
    const existingUser = await prisma.userProfile.findFirst({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists, Please try with different",
      });
    }

    // Create new user
    const newUser = await prisma.userProfile.create({
      data: parsed.data,
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error: " + error.message,
    });
  }
};

/// get profile
var getProfile = async (req, res) => {
  try {
    const data = await prisma.userProfile.findMany({});

    /// Success response
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

// Schema for task update (all fields optional)
const profileUpdateSchema = z.object({
  firstName: z.string().trim().min(1, "First name cannot be empty").optional(),
  lastName: z.string().trim().min(1, "Last name cannot be empty").optional(),
  gender: z.string().trim().min(1, "Gender cannot be empty").optional(),
  birthDate: z.string().trim().min(1, "Birth Date cannot be empty").optional(),
  phone: z.string().trim().min(1, "Phone cannot be empty").optional(),
  email: z.string().trim().email("Valid email is required").optional(),
  address: z.string().trim().min(1, "Address cannot be empty").optional(),
  profession: z.string().trim().min(1, "Profession cannot be empty").optional(),
  nationality: z
    .string()
    .trim()
    .min(1, "Nationality cannot be empty")
    .optional(),
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
      return res.status(400).json({
        error: errorMessage,
      });
    }

    /// Check if request body is empty
    if (Object.keys(parsed.data).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const findUser = await prisma.userProfile.findUnique({
      where: { id: parseInt(id) },
    });
    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = await prisma.userProfile.update({
      where: { id: parseInt(id) },
      data: parsed.data,
    });

    return res.status(201).json({
      data: {
        message: "Update successfully",
        data: updateData,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile };
