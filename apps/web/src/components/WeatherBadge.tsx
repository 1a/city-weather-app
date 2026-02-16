import type { WeatherInfo } from "@/lib/types";

export default function WeatherBadge({ weather }: { weather: WeatherInfo }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm">
      {weather.icon && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
          alt={weather.description}
          width={32}
          height={32}
        />
      )}
      <div>
        <p className="font-medium">{Math.round(weather.temp)}°C</p>
        <p className="text-gray-600 capitalize">{weather.description}</p>
      </div>
      <div className="ml-2 text-gray-500 text-xs">
        <p>Humidity: {weather.humidity}%</p>
        <p>Wind: {weather.windSpeed} m/s</p>
      </div>
    </div>
  );
}
