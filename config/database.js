const sqlite3 = require("sqlite3")
const {open} = require("sqlite")

async function connectDatabase(){
    const db = await open({
        filename: "database.sqlite",
        driver: sqlite3.Database
    });
    return db;
}
module.exports = connectDatabase;