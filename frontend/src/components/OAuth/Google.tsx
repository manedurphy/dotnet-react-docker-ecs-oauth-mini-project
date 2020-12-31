import React from 'react';
import { useDispatch } from 'react-redux';
import { handleGoogleAuthorization } from '../../Requests/axios';
import { setUserLoading, setUser } from '../../redux/slices/userSlice';
import styled from 'styled-components';
import { Box } from './oauth-styles';
import { GoogleLogin } from 'react-google-login';
import { AuthorizeSuccessResponse } from '../../Requests/interfaces';
import { setOAuthLoading } from '../../redux/slices/OAuthSlice';
import { setAlert } from '../../redux/slices/alertSlice';

const GoogleUrl =
  process.env.DEVELOPMENT === 'true'
    ? '326224736164-ju106naimcs0er3phe2jt2e1qi6jbvks.apps.googleusercontent.com'
    : '950293235751-kii4o3i1kqgra5jr52cgnls5nl6mb9ue.apps.googleusercontent.com';

const Google: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  const onSignIn = async (googleUser: any): Promise<void> => {
    const idToken = googleUser.getAuthResponse().id_token;
    const email = googleUser.getBasicProfile().getEmail();

    dispatch(setUserLoading(true));
    dispatch(setOAuthLoading(true));

    try {
      const successResponse: AuthorizeSuccessResponse = await handleGoogleAuthorization(
        email,
        idToken
      );
      dispatch(
        setUser({
          name: successResponse.name,
          email: successResponse.email,
          isAuthorized: true,
          loading: false,
        })
      );
      dispatch(
        setAlert({
          message: 'Profile has been successfully authorized!',
          statusCode: 201,
        })
      );
    } catch (err) {
      dispatch(setUserLoading(false));
      dispatch(setOAuthLoading(false));
      dispatch(
        setAlert({
          message: err.response.data.message,
          statusCode: err.response.status,
        })
      );
    }
  };

  return (
    <Box>
      <h2>
        Login With <span style={{ color: 'blue' }}>G</span>
        <span style={{ color: 'red' }}>o</span>
        <span style={{ color: '#f4B400' }}>o</span>
        <span style={{ color: 'blue' }}>g</span>
        <span style={{ color: '#0F9D58' }}>l</span>
        <span style={{ color: 'red' }}>e</span>{' '}
      </h2>
      <Container>
        <GoogleLogin
          clientId={GoogleUrl}
          buttonText={'Sign in'}
          cookiePolicy={'single_host_origin'}
          onSuccess={onSignIn}
        />
      </Container>
    </Box>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
`;

export default Google;
