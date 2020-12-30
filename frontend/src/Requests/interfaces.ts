import { ProtectedDataState } from '../redux/slices/protectedData';
import { UserState } from '../redux/slices/userSlice';
import { Alert } from '../redux/slices/alertSlice';

export interface GlobalState {
  alerts: Alert[];
  user: UserState;
  protectedData: ProtectedDataState[];
  OAuth: boolean;
}

export interface WeatherData {
  date: Date;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface AuthorizeSuccessResponse {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface GitHubUserReponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}
