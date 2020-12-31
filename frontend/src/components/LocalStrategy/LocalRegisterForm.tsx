import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/slices/alertSlice';
import { FormLoginData } from './LocalLoginForm';
import { Redirect } from 'react-router-dom';
import { backendUrl } from '../../App';
import {
  GlobalState,
  RegisterSuccessResponse,
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

interface FormRegisterData extends FormLoginData {
  firstName: string;
  lastName: string;
  password2: string;
}

const LocalRegisterForm: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector((state: GlobalState) => state);
  const { alerts, user } = state;

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormRegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: AxiosResponse<RegisterSuccessResponse> = await axios.post(
        `${backendUrl}/api/Users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setIsRegistered(true);
      dispatch(
        setAlert({
          message: `Successfully registered as ${res.data.email}`,
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
        <Form className={'form'} onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="firstName">First Name</label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="lastName">Last Name</label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <Input
              type="text"
              name="email"
              id="email"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              name="password"
              id="password"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password2">Password2</label>
            <Input
              type="password"
              name="password2"
              id="password2"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <ButtonGroup>
            <button type="submit">Sign Up</button>
            <div>
              Have an account? Sign in{' '}
              <Link className={'here-link'} href="/login">
                here
              </Link>
            </div>
          </ButtonGroup>
          {isRegistered && <Redirect to={'/login'} />}
          {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
        </Form>
      </FormContainer>
    </React.Fragment>
  );
};

export default LocalRegisterForm;
