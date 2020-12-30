import axios, { AxiosResponse } from 'axios';
import { UserState } from '../redux/slices/userSlice';
import { RefreshResponse, WeatherData } from './interfaces';

const getToken = (): string | null => localStorage.getItem('token');

const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken');

export async function requestWeatherData(): Promise<WeatherData> {
  const res: AxiosResponse<WeatherData> = await axios.get(
    'http://localhost:8080/api/WeatherForecast',
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function requestNewTokens(): Promise<RefreshResponse> {
  const res: AxiosResponse<RefreshResponse> = await axios.post(
    'http://localhost:8080/api/Authorization/refresh',
    {
      refreshToken: getRefreshToken(),
    }
  );

  return res.data;
}

export async function requestUserData(): Promise<UserState> {
  const res: AxiosResponse<UserState> = await axios.get(
    'http://localhost:8080/api/Users/info',
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}
