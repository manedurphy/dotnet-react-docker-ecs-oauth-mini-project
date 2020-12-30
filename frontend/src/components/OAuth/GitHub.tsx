import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../Requests/axios';
import { getUserData } from '../../redux/slices/userSlice';

const GitHub = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessToken(code);
      dispatch(getUserData());
    }
  }, []);

  return (
    <div>
      <h2>Login With GitHub</h2>
      <a href="https://github.com/login/oauth/authorize?client_id=dc66fcdec00e52ce44b8&scope=user&redirect_uri=http://localhost:3000/oauth">
        Login with github
      </a>
    </div>
  );
};

export default GitHub;
