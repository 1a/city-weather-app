export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  touristRating: number;
  dateEstablished: string;
  estimatedPopulation: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityInput {
  name: string;
  state: string;
  country: string;
  touristRating: number;
  dateEstablished: string;
  estimatedPopulation: number;
}

export interface UpdateCityInput {
  touristRating?: number;
  dateEstablished?: string;
  estimatedPopulation?: number;
}

export interface CountryInfo {
  twoLetterCode: string;
  threeLetterCode: string;
  currency: string;
  currencySymbol: string;
}

export interface WeatherInfo {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface CitySearchResult extends City {
  countryInfo: CountryInfo | null;
  weather: WeatherInfo | null;
}
