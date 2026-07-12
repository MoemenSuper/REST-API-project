const express = require("express");
const connectDatabase = require("./config/database");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 3000;

app.use(express.json()); // Lets Express read JSON sent in request bodies.
app.use("/api/tasks", taskRoutes);

async function startServer() {
  try {
    await connectDatabase(); // Make sure the database is ready before starting the server.

    app.listen(PORT, function () {
      console.log("Server running on port " + PORT);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
  }
}

startServer();