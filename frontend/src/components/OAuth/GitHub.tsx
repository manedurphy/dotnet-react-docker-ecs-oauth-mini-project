import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../Requests/axios';
import { getUserData } from '../../redux/slices/userSlice';
import styled from 'styled-components';
import Spinner from '../UI/Spinner';

const GitHub = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect((): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setLoading(true);
      getAccessToken(code)
        .then(() => {
          dispatch(getUserData());
        })
        .catch((err) => console.log('ERROR IN GITHUB: ', err.response));
    }
  }, []);

  return loading ? (
    <Spinner />
  ) : (
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
