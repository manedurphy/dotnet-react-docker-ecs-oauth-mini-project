import axios, { AxiosResponse } from 'axios';
import { handleSetTokens } from '../components/LocalStrategy/helpers';
import { backendUrl } from '../App';
import { UserState } from '../redux/slices/userSlice';
import {
  GitHubUserReponse,
  AuthorizeSuccessResponse,
  WeatherData,
  DeleteSuccessResponse,
} from './interfaces';

const getToken = (): string | null => localStorage.getItem('token');

const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken');

export async function requestWeatherData(): Promise<WeatherData> {
  const res: AxiosResponse<WeatherData> = await axios.get(
    `${backendUrl}/api/WeatherForecast`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function requestNewTokens(): Promise<AuthorizeSuccessResponse> {
  const res: AxiosResponse<AuthorizeSuccessResponse> = await axios.post(
    `${backendUrl}/api/Authorization/refresh`,
    {
      refreshToken: getRefreshToken(),
    }
  );

  return res.data;
}

export async function requestUserData(): Promise<UserState> {
  const res: AxiosResponse<UserState> = await axios.get(
    `${backendUrl}/api/Authorization/info`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function handleGitHubAuthorization(
  code: string
): Promise<AuthorizeSuccessResponse> {
  const accessToken: AxiosResponse<string> = await axios.post(
    `${backendUrl}/api/OAuthProfiles/get-access-token?code=${code}`
  );

  const token = accessToken.data.substring(1).split('=')[1].split('&')[0];

  const user: AxiosResponse<GitHubUserReponse[]> = await axios.get(
    'https://api.github.com/user/emails',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const res: AxiosResponse<AuthorizeSuccessResponse> = await axios.post(
    `${backendUrl}/api/OAuthProfiles/authorize`,
    {
      email: user.data[0].email,
      platform: 'GitHub',
      accessToken: token,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  handleSetTokens(res.data.token, res.data.refreshToken);
  return res.data;
}

export async function handleGoogleAuthorization(
  email: string,
  idToken: string
): Promise<AuthorizeSuccessResponse> {
  const res: AxiosResponse<AuthorizeSuccessResponse> = await axios.post(
    `${backendUrl}/api/OAuthProfiles/google`,
    {
      idToken,
      email,
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  handleSetTokens(res.data.token, res.data.refreshToken);
  return res.data;
}

export async function deleteAccount(): Promise<DeleteSuccessResponse> {
  const res: AxiosResponse<DeleteSuccessResponse> = await axios.delete(
    `${backendUrl}/api/Authorization/delete/${getRefreshToken()}`
  );

  return res.data;
}
