"use client";

import { useState } from "react";
import Link from "next/link";
import type { CitySearchResult } from "@/lib/types";
import { deleteCity } from "@/lib/api";
import WeatherBadge from "./WeatherBadge";
import DeleteConfirmation from "./DeleteConfirmation";

export default function CityCard({
  city,
  onDeleted,
}: {
  city: CitySearchResult;
  onDeleted: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  async function handleDelete() {
    await deleteCity(city.id);
    onDeleted();
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">{city.name} <span className="text-sm font-normal text-gray-400">#{city.id}</span></h2>
            <p className="text-gray-600">
              {city.state}, {city.country}
              {city.countryInfo && (
                <span className="ml-2 text-sm text-gray-500">
                  ({city.countryInfo.twoLetterCode} / {city.countryInfo.threeLetterCode})
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/edit/${city.id}`}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-500">Rating:</span>{" "}
            {"★".repeat(city.touristRating)}{"☆".repeat(5 - city.touristRating)}
          </div>
          <div>
            <span className="text-gray-500">Population:</span>{" "}
            {city.estimatedPopulation.toLocaleString()}
          </div>
          <div>
            <span className="text-gray-500">Established:</span> {city.dateEstablished}
          </div>
          {city.countryInfo?.currency && (
            <div>
              <span className="text-gray-500">Currency:</span>{" "}
              {city.countryInfo.currencySymbol} {city.countryInfo.currency}
            </div>
          )}
        </div>

        {city.weather && <WeatherBadge weather={city.weather} />}
      </div>

      {showDelete && (
        <DeleteConfirmation
          cityName={city.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
