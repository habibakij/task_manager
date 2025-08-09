const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

/// Create new task
const taskWriteSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(2, "Title must be at least 2 characters"),

  description: z
    .string()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters"),

  startDate: z
    .string()
    .nonempty("Start Date is required")
    .min(2, "Start Date must be at least 2 characters"),

  endDate: z
    .string()
    .nonempty("End Date is required")
    .min(2, "End Date must be at least 2 characters"),
});

var insertTask = async (req, res) => {
  try {
    /// Input validation
    const parsed = taskWriteSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    /// create task
    const { title, description, startDate, endDate } = parsed.data;
    const data = await prisma.taskTable.create({
      data: { title, description, startDate, endDate },
    });

    /// Success response
    return res.status(201).json({
      data: {
        message: "Task created successfully",
        task: data,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

// Fetch task list
var getAllTask = async (req, res) => {
  try {
    const data = await prisma.taskTable.findMany({});

    /// Success response
    return res.status(201).json({
      data: {
        message: "Fetch successfully",
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

// Fetch single task
var getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const data = await prisma.taskTable.findUnique({
      where: { id: parseInt(id) },
    });

    /// Check exist task
    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }

    /// Success response
    return res.status(201).json({
      data: {
        message: "Fetch successfully",
        data: data,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

// Update single task
// Schema for task update (all fields optional)
const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  startDate: z.string().min(1, "Start date cannot be empty").optional(),
  endDate: z.string().min(1, "End date cannot be empty").optional(),
});

var taskUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    /// Input validation
    const parsed = taskUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    /// Check if request body is empty
    if (Object.keys(parsed.data).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const data = await prisma.taskTable.findUnique({
      where: { id: parseInt(id) },
    });

    /// Check exist task
    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updateData = await prisma.taskTable.update({
      where: { id: parseInt(id) },
      data: parsed.data,
    });

    /// Success response
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

// Deletes task
var taskDelete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const data = await prisma.taskTable.findUnique({
      where: { id: parseInt(id) },
    });

    /// Check exist task
    if (!data) {
      return res.status(404).json({ error: "Task not found" });
    }
    /// Delete task
    await prisma.taskTable.delete({
      where: { id: parseInt(id) },
    });

    /// Success response
    return res.status(200).json({
      data: {
        message: "Deleted successfully",
        data: data,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

/// Delete all
var deleteAllTask = async (req, res) => {
  try {
    const data = await prisma.taskTable.deleteMany({});

    /// Success response
    return res.status(200).json({
      data: {
        message: "All tasks deleted successfully",
        deletedCount: data.count,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error: " + error.message });
  }
};

module.exports = {
  insertTask,
  getAllTask,
  getSingleTask,
  taskUpdate,
  taskDelete,
  deleteAllTask,
};
