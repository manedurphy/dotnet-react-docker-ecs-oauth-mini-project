import React from 'react';
import GitHub from './GitHub';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Requests/interfaces';

const OAuth = () => {
  const user = useSelector((state: GlobalState) => state.user);
  return (
    <div>
      <GitHub />
      {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
    </div>
  );
};

export default OAuth;
