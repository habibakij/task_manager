const express = require("express");
const taskRoute = express.Router();

const {
  insertTask,
  getAllTask,
  getSingleTask,
  taskUpdate,
  taskDelete,
  deleteAllTask,
} = require("../app_controllers/task_controller");

taskRoute.post("/task", insertTask);

taskRoute.get("/tasks", getAllTask);

taskRoute.get("/task/:id", getSingleTask);

taskRoute.put("/task/:id", taskUpdate);

taskRoute.delete("/task/:id", taskDelete);

taskRoute.delete("/taskAll", deleteAllTask);

module.exports = taskRoute;
