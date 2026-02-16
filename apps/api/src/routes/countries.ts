import { Router } from "express";

interface CountryEntry {
  name: string;
}

let cachedCountries: CountryEntry[] | null = null;

export function countriesRouter(): Router {
  const router = Router();

  router.get("/", async (_req, res) => {
    if (cachedCountries) {
      res.json(cachedCountries);
      return;
    }

    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name"
      );
      if (!response.ok) {
        res.status(502).json({ error: "Failed to fetch countries" });
        return;
      }

      const data = await response.json();
      cachedCountries = (data as { name: { common: string } }[])
        .map((c) => ({ name: c.name.common }))
        .sort((a, b) => a.name.localeCompare(b.name));

      res.json(cachedCountries);
    } catch {
      res.status(502).json({ error: "Failed to fetch countries" });
    }
  });

  return router;
}
