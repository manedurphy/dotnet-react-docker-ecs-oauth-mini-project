import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../Requests/axios';
import { getUserData, UserState } from '../../redux/slices/userSlice';
import { setStatus } from '../../redux/slices/OAuthSlice';
import styled from 'styled-components';

const GitHub: React.FC = (props): JSX.Element => {
  const dispatch = useDispatch();

  useEffect((): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      dispatch(setStatus(true));
      getAccessToken(code)
        .then(() => {
          dispatch(getUserData());
        })
        .catch((err) => console.log('ERROR IN GITHUB: ', err.response));
    }
  }, []);

  return (
    <Box>
      <h2>Login With GitHub</h2>
      <Container>
        <InnerContainer>
          <span>
            <i className="fab fa-github"></i>
          </span>
          <Link href="https://github.com/login/oauth/authorize?client_id=dc66fcdec00e52ce44b8&scope=user&redirect_uri=http://localhost:3000/oauth">
            Click here
          </Link>
        </InnerContainer>
      </Container>
    </Box>
  );
};

export const Box = styled.div`
  border: 3px solid black;
  width: 285px;
  text-align: center;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const InnerContainer = styled.div`
  border: 1px solid black;
  height: 36px;
  width: 120px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: -0px 1px 4px 0px;
`;

const Link = styled.a`
  color: black;
  text-decoration: none;
  font-size: 1rem;
`;

export default GitHub;
