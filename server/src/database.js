import Database from "better-sqlite3";

// Creates database.db file in server/ root if it doesn't exist
const db = new Database("database.db");

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ads (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      type        TEXT NOT NULL,
      area_name   TEXT NOT NULL,
      place_id    TEXT NOT NULL,
      price       REAL NOT NULL,
      description TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database initialized");
};

export { db, initDb };