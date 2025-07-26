const connectDB = require("../app_config/db_connection");

// Inserts a new task into the database
var insertTask = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({
      error: "All fields are required, Please fill all fields",
    });
  }

  try{
    const dbConnection = await connectDB();
    const [tasks] = await dbConnection.execute(
      "INSERT INTO TASK_TABLE (title, description, startDate, endDate) VALUES (?, ?, ?, ?)",
      [title, description, startDate, endDate]
    );

    const result = {
      id: tasks.insertId,
      title,
      description,
      startDate: startDate,
      endDate: endDate,
    }
    res.status(201).json({
      message: "Task created successfully",
      task: result, 
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error: "+ error.message });
  }
};

// Fetches the list of tasks from the database
var getTaskList = async (req, res) => {
  try {
    const dbConnection = await connectDB();
    const [tasks] = await dbConnection.execute("SELECT * FROM TASK_TABLE");
    res.status(200).json({ message: "Task list", tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

var taskUpdate = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, startDate, endDate } = req.body;
   if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }
  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const dbConnection = await connectDB();
    const [result] = await dbConnection.execute(
      "UPDATE TASK_TABLE SET title = ?, description = ?, startDate = ?, endDate = ? WHERE id = ?",
      [title, description, startDate, endDate, taskId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

// Deletes a task by ID
var taskDelete = async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }
  try {
    const dbConnection = await connectDB();
    const [result] = await dbConnection.execute(
      "DELETE FROM TASK_TABLE WHERE id = ?", [taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(201).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

module.exports = { insertTask, getTaskList, taskUpdate, taskDelete };
