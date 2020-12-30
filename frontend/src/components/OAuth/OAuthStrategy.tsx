import React from 'react';
import GitHub from './GitHub';
import Google from './Google';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Requests/interfaces';
import Spinner from '../UI/Spinner';
import styled from 'styled-components';

const OAuth = () => {
  const state = useSelector((state: GlobalState) => state);
  const { user, OAuth } = state;

  return OAuth && !user.isAuthorized ? (
    <Spinner />
  ) : (
    <Container>
      <GitHub />
      <Google />
      {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  top: 40%;
`;

export default OAuth;
