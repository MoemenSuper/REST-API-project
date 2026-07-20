const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

// Connects each HTTP method and path to its controller function.
router.get("/",taskController.getAllTasks);
router.get("/:id",taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;