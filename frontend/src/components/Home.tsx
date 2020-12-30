import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setStatus } from '../redux/slices/OAuthSlice';
import { getWeatherData } from '../redux/slices/protectedData';
import { GlobalState } from '../Requests/interfaces';

const Home = () => {
  const dispatch = useDispatch();
  const isAuthorized = useSelector(
    (state: GlobalState) => state.user.isAuthorized
  );

  useEffect((): void => {
    dispatch(getWeatherData());
    dispatch(setStatus(false));
  }, []);
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {!isAuthorized && <Redirect to={'/login'} />}
    </div>
  );
};

export default Home;
