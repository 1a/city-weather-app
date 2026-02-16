import type { WeatherInfo } from "@city-weather/shared";

export async function getWeather(cityName: string, countryCode?: string): Promise<WeatherInfo | null> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) return null;

  try {
    const query = countryCode ? `${cityName},${countryCode}` : cityName;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) return null;

    const data = await res.json();
    return {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      description: data.weather[0]?.description ?? "",
      icon: data.weather[0]?.icon ?? "",
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch {
    return null;
  }
}
