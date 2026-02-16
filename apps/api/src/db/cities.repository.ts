import type Database from "better-sqlite3";
import type { City, CreateCityInput, UpdateCityInput } from "@city-weather/shared";

interface CityRow {
  id: number;
  name: string;
  state: string;
  country: string;
  tourist_rating: number;
  date_established: string;
  estimated_population: number;
  created_at: string;
  updated_at: string;
}

function rowToCity(row: CityRow): City {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    country: row.country,
    touristRating: row.tourist_rating,
    dateEstablished: row.date_established,
    estimatedPopulation: row.estimated_population,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createCity(db: Database.Database, input: CreateCityInput): City {
  const stmt = db.prepare(`
    INSERT INTO cities (name, state, country, tourist_rating, date_established, estimated_population)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.name,
    input.state,
    input.country,
    input.touristRating,
    input.dateEstablished,
    input.estimatedPopulation
  );
  return getById(db, result.lastInsertRowid as number)!;
}

export function getById(db: Database.Database, id: number): City | undefined {
  const row = db.prepare("SELECT * FROM cities WHERE id = ?").get(id) as CityRow | undefined;
  return row ? rowToCity(row) : undefined;
}

// In real project I would probably use a query builder or an ORM to make this more elegant, but for this simple example raw SQL is fine.
export function updateCity(db: Database.Database, id: number, input: UpdateCityInput): City | undefined {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.touristRating !== undefined) {
    fields.push("tourist_rating = ?");
    values.push(input.touristRating);
  }
  if (input.dateEstablished !== undefined) {
    fields.push("date_established = ?");
    values.push(input.dateEstablished);
  }
  if (input.estimatedPopulation !== undefined) {
    fields.push("estimated_population = ?");
    values.push(input.estimatedPopulation);
  }

  if (fields.length === 0) return getById(db, id);

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE cities SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return getById(db, id);
}

export function deleteCity(db: Database.Database, id: number): boolean {
  const result = db.prepare("DELETE FROM cities WHERE id = ?").run(id);
  return result.changes > 0;
}

export function searchByName(db: Database.Database, name: string): City[] {
  const rows = db.prepare("SELECT * FROM cities WHERE name LIKE ? COLLATE NOCASE").all(`%${name}%`) as CityRow[];
  return rows.map(rowToCity);
}
