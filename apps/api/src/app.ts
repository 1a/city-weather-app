import express from "express";
import cors from "cors";
import type Database from "better-sqlite3";
import { migrate } from "./db/migrate.js";
import { citiesRouter } from "./routes/cities.js";
import { countriesRouter } from "./routes/countries.js";

export function createApp(db: Database.Database) {
  migrate(db);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/cities", citiesRouter(db));
  app.use("/api/countries", countriesRouter());

  return app;
}
