import axios, { AxiosResponse } from 'axios';
import { handleSetTokens } from '../components/LocalStrategy/helpers';
import { LoginResponse } from '../components/LocalStrategy/LocalLoginForm';
import { UserState } from '../redux/slices/userSlice';
import { GitHubUserReponse, RefreshResponse, WeatherData } from './interfaces';

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
    'http://localhost:8080/api/Authorization/info',
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function getAccessToken(code: string): Promise<void> {
  try {
    const accessToken: AxiosResponse<string> = await axios.post(
      `http://localhost:8080/api/OAuthProfiles/get-access-token?code=${code}`
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

    const res: AxiosResponse<LoginResponse> = await axios.post(
      'http://localhost:8080/api/OAuthProfiles/authorize',
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
  } catch (err) {
    console.log(err);
  }
}
