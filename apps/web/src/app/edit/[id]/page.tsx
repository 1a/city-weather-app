"use client";

import { useEffect, useState, use } from "react";
import CityForm from "@/components/CityForm";
import { getCity, updateCity } from "@/lib/api";
import type { City, UpdateCityInput } from "@/lib/types";

export default function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const found = await getCity(Number(id));
        setCity(found);
      } catch {
        setCity(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!city) return <p className="text-gray-500">City not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Edit {city.name}
      </h1>
      <CityForm
        mode="edit"
        initialData={city}
        onSubmit={async (data) => {
          await updateCity(city.id, data as UpdateCityInput);
        }}
      />
    </div>
  );
}
