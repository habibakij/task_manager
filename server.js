require("dotenv").config();
const app = require("./app");

// Middleware
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Start the server
start();
