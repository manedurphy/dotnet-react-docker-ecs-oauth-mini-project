import React from 'react';
import { useDispatch } from 'react-redux';
import { handleGoogleAuthorization } from '../../Requests/axios';
import { UserState } from '../../redux/slices/userSlice';
import styled from 'styled-components';
import { Box } from './GitHub';
import { GoogleLogin } from 'react-google-login';

const Google: React.FC = (props): JSX.Element => {
  const dispatch = useDispatch();

  const onSignIn = (googleUser: any) => {
    const idToken = googleUser.getAuthResponse().id_token;
    const email = googleUser.getBasicProfile().getEmail();
    handleGoogleAuthorization(email, idToken);
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
