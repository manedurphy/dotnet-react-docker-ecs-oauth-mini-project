import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { setStatus } from '../redux/slices/OAuthSlice';
import { getWeatherData } from '../redux/slices/protectedData';
import { GlobalState } from '../Requests/interfaces';
import { Link } from './LocalStrategy/local-strategy-styles';
import { Box } from './OAuth/GitHub';

const Home = () => {
  const dispatch = useDispatch();
  const [showData, setShowData] = useState(false);
  const state = useSelector((state: GlobalState) => state);
  const { user, protectedData } = state;

  useEffect((): void => {
    dispatch(getWeatherData());
    dispatch(setStatus(false));
  }, []);
  return (
    <Container>
      <h1>Welcome to This Protected Route</h1>
      <p>
        You may click <Link onClick={() => setShowData(true)}>here</Link> to get
        data from a protected endpoint
      </p>
      {showData && (
        <BoxContainer>
          {protectedData.map((item, i) => {
            return (
              <Box key={i}>
                <p>Date: {item.date.slice(0, 10)}</p>
                <p>TempC: {item.temperatureC} Degrees</p>
                <p>TempF: {item.temperatureF} Degrees</p>
                <p>Summary: {item.summary}</p>
              </Box>
            );
          })}
        </BoxContainer>
      )}
      {!user.isAuthorized && <Redirect to={'/login'} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default Home;
