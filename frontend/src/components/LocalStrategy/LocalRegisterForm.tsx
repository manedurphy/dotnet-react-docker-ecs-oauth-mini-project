import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/slices/alertSlice';
import { FormLoginData } from './LocalLoginForm';
import { Redirect } from 'react-router-dom';
import { GlobalState } from '../../Requests/interfaces';
import {
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
    console.log('HANDLE CHANGE');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/Users/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsRegistered(true);
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
    <FormContainer>
      <Form className={'form'} onSubmit={handleSubmit}>
        {alerts.length ? (
          <div className={'alert'}>{alerts[0].message}</div>
        ) : null}
        <FormGroup>
          <label htmlFor="firstName">First Name</label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="lastName">Last Name</label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="email">Email</label>
          <Input type="text" name="email" id="email" onChange={handleChange} />
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
        <FormGroup>
          <label htmlFor="password2">Password2</label>
          <Input
            type="text"
            name="password2"
            id="password2"
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
  );
};

export default LocalRegisterForm;
