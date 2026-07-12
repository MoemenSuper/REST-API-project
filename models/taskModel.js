const connectDB = require("../config/database");

async function getAllTasks() {
    const db = await connectDB();
    const tasks = await db.all("SELECT * FROM tasks");

    return tasks;
}

async function getTaskById(id) {
    const db = await connectDB();

    const task = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    return task;
}

async function createTask(title, description) {
    const db = await connectDB();

    const result = await db.run(
        "INSERT INTO tasks (title, description) VALUES (?,?)",
        [title, description]
    );

    const newTask = await getTaskById(result.lastID);

    return newTask;
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask
};