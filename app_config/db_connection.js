require("dotenv").config();
const mysql = require("mysql2/promise");

let dbConnection;
async function connectDB() {
  try {
    dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "TASK_MANAGER",
      // host: "localhost",
      // user: "root",
      // password: "",
      // database: "TASK_MANAGER",
    });

    console.log("✅ Connected to the database");
    return dbConnection;
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
