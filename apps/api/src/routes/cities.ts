import { Router } from "express";
import type Database from "better-sqlite3";
import * as repo from "../db/cities.repository.js";
import { validateCreateCity, validateUpdateCity } from "../middleware/validation.js";
import { getCountryInfo } from "../services/restcountries.js";
import { getWeather } from "../services/openweathermap.js";
import type { CitySearchResult } from "@city-weather/shared";

export function citiesRouter(db: Database.Database): Router {
  const router = Router();

  router.post("/", validateCreateCity, (req, res) => {
    const city = repo.createCity(db, req.body);
    res.status(201).json(city);
  });

  router.get("/search", async (req, res) => {
    const name = req.query.name as string;
    if (!name) {
      res.status(400).json({ error: "name query parameter is required" });
      return;
    }

    const cities = repo.searchByName(db, name);

    const uniqueCountries = [...new Set(cities.map((c) => c.country))];

    const [countryInfoMap, weatherResults] = await Promise.all([
      Promise.all(
        uniqueCountries.map(async (country) => {
          const info = await getCountryInfo(country);
          return [country, info] as const;
        })
      ).then((entries) => new Map(entries)),

      Promise.all(
        cities.map(async (city) => {
          const weather = await getWeather(city.name);
          return [city.id, weather] as const;
        })
      ).then((entries) => new Map(entries)),
    ]);

    const results: CitySearchResult[] = cities.map((city) => ({
      ...city,
      countryInfo: countryInfoMap.get(city.country) ?? null,
      weather: weatherResults.get(city.id) ?? null,
    }));

    res.json(results);
  });

  router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const city = repo.getById(db, id);
    if (!city) {
      res.status(404).json({ error: "City not found" });
      return;
    }
    res.json(city);
  });

  router.put("/:id", validateUpdateCity, (req, res) => {
    const id = Number(req.params.id);
    const city = repo.updateCity(db, id, req.body);
    if (!city) {
      res.status(404).json({ error: "City not found" });
      return;
    }
    res.json(city);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const deleted = repo.deleteCity(db, id);
    if (!deleted) {
      res.status(404).json({ error: "City not found" });
      return;
    }
    res.status(204).end();
  });

  return router;
}
