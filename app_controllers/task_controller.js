const connectDB = require("../app_config/db_connection");

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

module.exports = { insertTask, getTaskList };
