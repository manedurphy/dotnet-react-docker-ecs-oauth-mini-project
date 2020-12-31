import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/slices/alertSlice';
import { setUser } from '../../redux/slices/userSlice';
import { handleSetTokens } from './helpers';
import { Redirect } from 'react-router-dom';
import {
  AuthorizeSuccessResponse,
  GlobalState,
} from '../../Requests/interfaces';
import {
  AlertDanger,
  AlertSuccess,
  ButtonGroup,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Link,
} from './local-strategy-styles';

export interface FormLoginData {
  email: string;
  password: string;
}

const LocalLoginForm: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector((state: GlobalState) => state);
  const { alerts, user } = state;

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
      const res: AxiosResponse<AuthorizeSuccessResponse> = await axios.post(
        'http://localhost:8080/api/Users/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(
        setUser({
          name: res.data.name,
          email: res.data.email,
          isAuthorized: true,
          loading: false,
        })
      );
      handleSetTokens(res.data.token, res.data.refreshToken);
      dispatch(
        setAlert({
          message: `Logged in as ${res.data.email}`,
          statusCode: res.status,
        })
      );
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
    <React.Fragment>
      {alerts.length && alerts[0].statusCode >= 400 ? (
        <AlertDanger>{alerts[0].message}</AlertDanger>
      ) : alerts.length && alerts[0].statusCode < 400 ? (
        <AlertSuccess>{alerts[0].message}</AlertSuccess>
      ) : null}
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <Input
              type="text"
              name="email"
              id="email"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Password</label>
            <Input
              type="text"
              name="password"
              id="password"
              onChange={handleChange}
            />
          </FormGroup>
          <ButtonGroup>
            <button type="submit">Sign In</button>
            <div>
              Don't have an account? Sign up <Link href="/register">here</Link>
            </div>
          </ButtonGroup>
        </Form>
        {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
      </FormContainer>
    </React.Fragment>
  );
};

export default LocalLoginForm;
