"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { City, CreateCityInput, UpdateCityInput } from "@/lib/types";
import { fetchCountries } from "@/lib/api";

interface CityFormProps {
  initialData?: City;
  onSubmit: (data: CreateCityInput | UpdateCityInput) => Promise<void>;
  mode: "add" | "edit";
}

export default function CityForm({ initialData, onSubmit, mode }: CityFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData?.name ?? "");
  const [state, setState] = useState(initialData?.state ?? "");
  const [country, setCountry] = useState(initialData?.country ?? "");
  const [touristRating, setTouristRating] = useState(initialData?.touristRating ?? 3);
  const [dateEstablished, setDateEstablished] = useState(initialData?.dateEstablished ?? "");
  const [estimatedPopulation, setEstimatedPopulation] = useState(
    initialData?.estimatedPopulation ?? 0
  );
  const [countries, setCountries] = useState<{ name: string }[]>([]);

  useEffect(() => {
    if (mode === "add") {
      fetchCountries().then(setCountries).catch(() => {});
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data =
        mode === "add"
          ? { name, state, country, touristRating, dateEstablished, estimatedPopulation }
          : { touristRating, dateEstablished, estimatedPopulation };

      await onSubmit(data);
      if (mode === "add") router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {mode === "add" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tourist Rating (1-5)
        </label>
        <input
          type="number"
          min={1}
          max={5}
          value={touristRating}
          onChange={(e) => setTouristRating(Number(e.target.value))}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Established</label>
        <input
          type="date"
          value={dateEstablished}
          onChange={(e) => setDateEstablished(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Population
        </label>
        <input
          type="number"
          min={0}
          value={estimatedPopulation}
          onChange={(e) => setEstimatedPopulation(Number(e.target.value))}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : mode === "add" ? "Add City" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
