import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Database.Database;

export function getDb(filePath?: string): Database.Database {
  if (!db) {
    const dbPath = filePath ?? path.join(__dirname, "../../data.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

export function setDb(instance: Database.Database) {
  db = instance;
}
