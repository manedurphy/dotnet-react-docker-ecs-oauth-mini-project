import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GlobalState } from '../Requests/interfaces';

const Home = () => {
  const isAuthorized = useSelector(
    (state: GlobalState) => state.user.isAuthorized
  );
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {!isAuthorized && <Redirect to={'/login'} />}
    </div>
  );
};

export default Home;
