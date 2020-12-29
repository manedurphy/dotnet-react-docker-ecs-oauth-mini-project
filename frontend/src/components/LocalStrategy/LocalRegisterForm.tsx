import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { add, remove } from '../../redux/slices/alertSlice';
import { FormLoginData } from './LocalLoginForm';
import { Redirect } from 'react-router-dom';

interface FormRegisterData extends FormLoginData {
  firstName: string;
  lastName: string;
  password2: string;
}

const LocalRegisterForm: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
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
        add({ message: err.response.data, statusCode: err.response.status })
      );
      setTimeout(() => {
        dispatch(remove());
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        onChange={handleChange}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        onChange={handleChange}
      />
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" onChange={handleChange} />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        name="password"
        id="password"
        onChange={handleChange}
      />
      <label htmlFor="password2">Password2</label>
      <input
        type="text"
        name="password2"
        id="password2"
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      {isRegistered && <Redirect to={'/login'} />}
    </form>
  );
};

export default LocalRegisterForm;
