import { ProtectedDataState } from '../redux/slices/protectedData';
import { UserState } from '../redux/slices/userSlice';
import { Alert } from '../redux/slices/alertSlice';

export interface GlobalState {
  alerts: Alert[];
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
