import React from 'react';
import { useDispatch } from 'react-redux';
import { handleGoogleAuthorization } from '../../Requests/axios';
import { setUserLoading, setUser } from '../../redux/slices/userSlice';
import styled from 'styled-components';
import { Box } from './GitHub';
import { GoogleLogin } from 'react-google-login';
import { AuthorizeSuccessResponse } from '../../Requests/interfaces';
import { handleSetTokens } from '../LocalStrategy/helpers';
import { setStatus } from '../../redux/slices/OAuthSlice';

const Google: React.FC = (props): JSX.Element => {
  const dispatch = useDispatch();

  const onSignIn = async (googleUser: any): Promise<void> => {
    const idToken = googleUser.getAuthResponse().id_token;
    const email = googleUser.getBasicProfile().getEmail();

    dispatch(setUserLoading(true));
    dispatch(setStatus(true));

    try {
      const res: AuthorizeSuccessResponse = await handleGoogleAuthorization(
        email,
        idToken
      );
      handleSetTokens(res.token, res.refreshToken);
      dispatch(
        setUser({
          name: res.name,
          email: res.email,
          isAuthorized: true,
          loading: false,
        })
      );
    } catch (err) {
      dispatch(setUserLoading(false));
      dispatch(setStatus(false));
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
          clientId={
            '950293235751-kii4o3i1kqgra5jr52cgnls5nl6mb9ue.apps.googleusercontent.com'
          }
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
