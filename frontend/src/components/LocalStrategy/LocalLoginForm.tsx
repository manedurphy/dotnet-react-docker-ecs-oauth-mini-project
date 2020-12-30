import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { add, remove, setAlert } from '../../redux/slices/alertSlice';
import { setUser } from '../../redux/slices/userSlice';
import { handleSetTokens } from './helpers';
import { getWeatherData } from '../../redux/slices/protectedData';

interface LoginResponse {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface FormLoginData {
  email: string;
  password: string;
}

const LocalLoginForm: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormLoginData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: AxiosResponse<LoginResponse> = await axios.post(
        'http://localhost:8080/api/Users/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(setUser({ name: res.data.name, email: res.data.email }));
      handleSetTokens(res.data.token, res.data.refreshToken);
      dispatch(getWeatherData());
    } catch (err) {
      dispatch(
        setAlert({
          message: err.response.data,
          statusCode: err.response.status,
        })
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" onChange={handleChange} />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        name="password"
        id="password"
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LocalLoginForm;
