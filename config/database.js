const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
const path = require("path");

async function connectDatabase(){
    const db = await open({
        filename: path.join(__dirname,"..","database.sqlite"),
        driver: sqlite3.Database
    });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        done INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    return db;
}
module.exports = connectDatabase;