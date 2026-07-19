const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
const path = require("path");

async function connectDatabase(){

    // Opens database.sqlite from the project root.
    const db = await open({
        filename: path.join(__dirname,"..","database.sqlite"),
        driver: sqlite3.Database
    });

    await createOrUpdateTasksTable(db);

    const result = await db.get(
        "SELECT COUNT(*) as count FROM tasks"
    );
    /* Add sample tasks only if the table is empty,
     so there is data available when testing the GET routes. */
    if (result.count === 0){   
        await db.run(
            "INSERT INTO tasks(title,description) VALUES(?,?)",
            ["Clean my room","Organize the messy clothes and dust off my gadgets."]
        );
        await db.run(
            "INSERT INTO tasks(title,description) VALUES(?,?)",
            ["Bake cookies", "Start baking cookies at 8pm following that new recipe i found."]
        );
    }
    return db;
}

async function createTasksTable(db) {
    await db.exec(`
        CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        done BOOLEAN DEFAULT 0 CHECK (done IN (0, 1)),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function createOrUpdateTasksTable(db) {
    const table = await db.get(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'tasks'"
    );

    if (!table) {
        await createTasksTable(db);
        return;
    }

    if (table.sql.includes("done BOOLEAN")) {
        return;
    }

    try {
        await db.exec("BEGIN TRANSACTION");
        await db.exec("ALTER TABLE tasks RENAME TO tasks_old");
        await createTasksTable(db);
        await db.exec(`
            INSERT INTO tasks (id, title, description, done, created_at)
            SELECT id, title, description, CASE WHEN done = 1 THEN 1 ELSE 0 END, created_at
            FROM tasks_old
        `);
        await db.exec("DROP TABLE tasks_old");
        await db.exec("COMMIT");
    } catch (error) {
        await db.exec("ROLLBACK");
        throw error;
    }
}
module.exports = connectDatabase;
