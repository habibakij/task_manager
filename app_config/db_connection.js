require("dotenv").config();
const mysql = require("mysql2/promise");

let dbConnnection;
async function connectDB() {
  try {
    dbConnnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "TASK_MANAGER",
    });

    console.log("✅ Connected to the database");
    return dbConnnection;
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
