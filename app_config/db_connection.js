const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
});

const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME || "task_manager";
if (password) {
  db.config.password = password;
}
db.config.database = database;
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

module.exports = db;
