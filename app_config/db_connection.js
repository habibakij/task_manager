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

// Function to create a new user
const createUser = (userData, callback) => {
  const { name, email, phone, password } = userData;
  const query =
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, phone, password], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};
