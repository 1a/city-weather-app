import type Database from "better-sqlite3";

export function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT NOT NULL,
      tourist_rating INTEGER NOT NULL CHECK(tourist_rating BETWEEN 1 AND 5),
      date_established TEXT NOT NULL,
      estimated_population INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name COLLATE NOCASE);
  `);
}
