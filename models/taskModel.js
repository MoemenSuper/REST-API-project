const connectDB = require("../config/database");

async function getAllTasks() {
    const db = await connectDB();
    const tasks = await db.all("SELECT * from tasks");

    return tasks;
}

module.exports = {
    getAllTasks
};