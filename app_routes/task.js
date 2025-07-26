const express = require("express");
const taskRoute = express.Router();

const {insertTask, getTaskList } = require("../app_controllers/task_controller");

taskRoute.post("/add", insertTask);

taskRoute.get("/get/list", getTaskList);

module.exports = taskRoute;