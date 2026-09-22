import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

export async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            studentNumber TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            course TEXT NOT NULL
        )
    `);
    return db;
}
