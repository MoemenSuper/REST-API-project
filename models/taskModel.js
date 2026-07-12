const connectDB = require("../config/database");

//this returns every task from the database.
async function getAllTasks(done, sort, order) {
    const db = await connectDB();
    const allowedSortFields = ["id", "title", "created_at"];
    const allowedOrders = ["asc", "desc"];
    const values = [];
    let query = "SELECT * FROM tasks";

    if (done !== undefined) {
        query += " WHERE done = ?";
        values.push(Number(done));
    }

    // Only add sorting values from the allowlists.
    if (sort && allowedSortFields.includes(sort) && allowedOrders.includes(order)) {
        query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
    }

    const tasks = await db.all(query, values);

    return tasks;
}

/* Returns one task using its ID.
 db.get() returns undefined if no matching row is found. */
async function getTaskById(id) {
    const db = await connectDB();

    const task = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    return task;
}
// Inserts a new task then returns the complete row created by SQLite.
async function createTask(title, description) {
    const db = await connectDB();

    const result = await db.run(
        "INSERT INTO tasks (title, description) VALUES (?,?)",
        [title, description]
    );
    // lastID is the ID automatically generated for the new task.
    const newTask = await getTaskById(result.lastID);

    return newTask;
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask
};
