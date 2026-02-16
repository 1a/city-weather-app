"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import CityCard from "@/components/CityCard";
import { searchCities } from "@/lib/api";
import type { CitySearchResult } from "@/lib/types";

export default function HomePage() {
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  async function handleSearch(query: string) {
    setLoading(true);
    setLastQuery(query);
    try {
      const data = await searchCities(query);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }

  function handleCityDeleted() {
    if (lastQuery) handleSearch(lastQuery);
  }

  return (
    <div className="space-y-6">
      <SearchForm onSearch={handleSearch} />

      {loading && <p className="text-center text-gray-500">Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-gray-500">No cities found.</p>
      )}

      <div className="space-y-4">
        {results.map((city) => (
          <CityCard key={city.id} city={city} onDeleted={handleCityDeleted} />
        ))}
      </div>
    </div>
  );
}
