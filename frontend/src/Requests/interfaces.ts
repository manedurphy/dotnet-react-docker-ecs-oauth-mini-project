import { ProtectedDataState } from '../redux/slices/protectedDataSlice';
import { UserState } from '../redux/slices/userSlice';
import { Alert } from '../redux/slices/alertSlice';
import { OAuthState } from '../redux/slices/OAuthSlice';

export interface GlobalState {
  alerts: Alert[];
  user: UserState;
  protectedData: ProtectedDataState[];
  OAuth: OAuthState;
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

export interface RegisterSuccessResponse {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface GitHubUserReponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}
