const express = require("express");
const taskRoute = express.Router();

const {insertTask, getTaskList, taskUpdate, taskDelete } = require("../app_controllers/task_controller");

taskRoute.post("/add", insertTask);

taskRoute.get("/get/list", getTaskList);

taskRoute.put("/:id", taskUpdate);

taskRoute.delete("/:id", taskDelete);

module.exports = taskRoute;