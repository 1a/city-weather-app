import type { City, CreateCityInput, UpdateCityInput, CitySearchResult } from "./types";

const BASE = "/api/cities";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? body.errors?.join(", ") ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function getCity(id: number): Promise<City> {
  return request(`${BASE}/${id}`);
}

export function searchCities(name: string): Promise<CitySearchResult[]> {
  return request(`${BASE}/search?name=${encodeURIComponent(name)}`);
}

export function createCity(input: CreateCityInput): Promise<City> {
  return request(BASE, { method: "POST", body: JSON.stringify(input) });
}

export function updateCity(id: number, input: UpdateCityInput): Promise<City> {
  return request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export function deleteCity(id: number): Promise<void> {
  return request(`${BASE}/${id}`, { method: "DELETE" });
}

export function fetchCountries(): Promise<{ name: string }[]> {
  return request("/api/countries");
}
