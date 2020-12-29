export interface WeatherData {
  date: Date;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface RefreshResponse {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}
