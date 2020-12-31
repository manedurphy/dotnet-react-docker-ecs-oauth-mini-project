import React, { useEffect, useState } from 'react';
import DataItem from './DataItem';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { setAlert } from '../redux/slices/alertSlice';
import { setOAuthLoading } from '../redux/slices/OAuthSlice';
import { getWeatherData } from '../redux/slices/protectedDataSlice';
import { getUserData } from '../redux/slices/userSlice';
import { deleteAccount } from '../Requests/axios';
import { GlobalState } from '../Requests/interfaces';
import { AlertSuccess, Link } from './LocalStrategy/local-strategy-styles';

const Home: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: GlobalState) => state.alerts);
  const [showData, setShowData] = useState(false);
  const state = useSelector((state: GlobalState) => state);
  const { user, protectedData } = state;

  useEffect((): void => {
    dispatch(getWeatherData());
    dispatch(setOAuthLoading(false));
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteAccount();
      dispatch(getUserData());
      dispatch(
        setAlert({
          message: response.message,
          statusCode: 204,
        })
      );
    } catch (err) {
      dispatch(
        setAlert({
          message: err.response.data.message,
          statusCode: 404,
        })
      );
    }
  };

  return (
    <React.Fragment>
      {alerts.length ? <AlertSuccess>{alerts[0].message}</AlertSuccess> : null}
      <Container>
        <h1>Welcome to This Protected Route</h1>
        <p>
          You may click <Link onClick={() => setShowData(true)}>here</Link> to
          get data from a protected endpoint
        </p>
        {showData && (
          <BoxContainer>
            {protectedData.map((item, i) => (
              <DataItem data={item} />
            ))}
          </BoxContainer>
        )}
        {!user.isAuthorized && <Redirect to={'/register'} />}
      </Container>
      <BottomContainer>
        <p>
          If you would like to delete your profile or user account and login in
          with a different stategy, click{' '}
          <Link onClick={handleDeleteAccount}>here</Link>
        </p>
      </BottomContainer>
    </React.Fragment>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

const BottomContainer = styled(Container)`
  position: absolute;
  bottom: 0;
`;

const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default Home;
