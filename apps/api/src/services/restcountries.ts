import type { CountryInfo } from "@city-weather/shared";

interface CacheEntry {
  data: CountryInfo;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 10 * 60 * 1000; // 10 minutes

export async function getCountryInfo(countryName: string): Promise<CountryInfo | null> {
  const cacheKey = countryName.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=cca2,cca3,currencies`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const country = data[0];
    if (!country) return null;

    const currencyKey = Object.keys(country.currencies ?? {})[0] ?? "";
    const currencyObj = country.currencies?.[currencyKey];

    const info: CountryInfo = {
      twoLetterCode: country.cca2 ?? "",
      threeLetterCode: country.cca3 ?? "",
      currency: currencyKey,
      currencySymbol: currencyObj?.symbol ?? "",
    };

    cache.set(cacheKey, { data: info, expiresAt: Date.now() + TTL });
    return info;
  } catch {
    return null;
  }
}
