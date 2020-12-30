import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/slices/alertSlice';
import { FormLoginData } from './LocalLoginForm';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalState } from '../../Requests/interfaces';

interface FormRegisterData extends FormLoginData {
  firstName: string;
  lastName: string;
  password2: string;
}

const LocalRegisterForm: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: GlobalState) => state.alerts);

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
      <Form onSubmit={handleSubmit}>
        {alerts.length ? <Alert>{alerts[0].message}</Alert> : null}
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
            Have an account? Sign in <Link href={'/login'}>here</Link>
          </div>
        </ButtonGroup>
        {isRegistered && <Redirect to={'/login'} />}
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const Form = styled.form`
  width: 20%;
`;

const FormGroup = styled.div`
  margin: 1rem 0;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 20px;
`;

const Alert = styled.div`
  width: 102%;
  height: 30px;
  background-color: #ff5b1e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Link = styled.a`
  text-decoration: none;
  color: blue;
  font-size: 1rem;
`;

export default LocalRegisterForm;
