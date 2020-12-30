import React from 'react';
import GitHub from './GitHub';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Requests/interfaces';
import Spinner from '../UI/Spinner';

const OAuth = () => {
  const state = useSelector((state: GlobalState) => state);
  const { user, OAuth } = state;

  return OAuth && !user.isAuthorized ? (
    <Spinner />
  ) : (
    <div className={'oauth-container'}>
      <GitHub user={user} />
      {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
    </div>
  );
};

export default OAuth;
