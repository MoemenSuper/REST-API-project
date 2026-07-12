const express = require("express");
const connectDatabase = require("./config/database");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/tasks", taskRoutes);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, function () {
      console.log("Server running on port " + PORT);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
  }
}

startServer();