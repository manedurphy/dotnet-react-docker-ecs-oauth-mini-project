import { AlertState } from '../redux/slices/alertSlice';
import { ProtectedDataState } from '../redux/slices/protectedData';
import { UserState } from '../redux/slices/userSlice';

export interface GlobalState {
  alerts: AlertState[];
  user: UserState;
  proctedData: ProtectedDataState[];
}

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
