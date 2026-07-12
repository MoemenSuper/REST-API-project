const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
const path = require("path");

async function connectDatabase(){

    // Opens database.sqlite from the project root.
    const db = await open({
        filename: path.join(__dirname,"..","database.sqlite"),
        driver: sqlite3.Database
    });

    // Creates the tasks table automatically if it does not exist yet.
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        done INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

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
module.exports = connectDatabase;