"use client";

import CityForm from "@/components/CityForm";
import { createCity } from "@/lib/api";
export default function AddCityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add City</h1>
      <CityForm
        mode="add"
        onSubmit={async (data) => {
          await createCity(data as Parameters<typeof createCity>[0]);
        }}
      />
    </div>
  );
}
