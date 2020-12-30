import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../Requests/axios';
import { getUserData, UserState } from '../../redux/slices/userSlice';
import { setStatus } from '../../redux/slices/OAuthSlice';
import styled from 'styled-components';

interface OAuthProps {
  user: UserState;
}

const GitHub: React.FC<OAuthProps> = (props): JSX.Element => {
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
      <h2>
        Login With GitHub{' '}
        <span>
          <i className="fab fa-github"></i>
        </span>
      </h2>
      <Link href="https://github.com/login/oauth/authorize?client_id=dc66fcdec00e52ce44b8&scope=user&redirect_uri=http://localhost:3000/oauth">
        Click here
      </Link>
      <input type="text" onChange={() => console.log('Change')} />
    </Box>
  );
};

const Box = styled.div`
  border: 3px solid black;
  width: 285px;
  text-align: center;
`;

const Link = styled.a`
  color: black;
  text-decoration: none;
  font-size: 1rem;
`;

export default GitHub;
