import React from 'react';
import GitHub from './GitHub';
import Google from './Google';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Requests/interfaces';
import Spinner from '../UI/Spinner';
import styled from 'styled-components';
import {
  AlertDanger,
  AlertSuccess,
} from '../LocalStrategy/local-strategy-styles';

const OAuth: React.FC = (): JSX.Element => {
  const state = useSelector((state: GlobalState) => state);
  const { user, OAuth, alerts } = state;

  return OAuth.loading && !user.isAuthorized ? (
    <Spinner />
  ) : (
    <React.Fragment>
      {alerts.length && alerts[0].statusCode >= 400 ? (
        <AlertDanger>{alerts[0].message}</AlertDanger>
      ) : alerts.length && alerts[0].statusCode < 400 ? (
        <AlertSuccess>{alerts[0].message}</AlertSuccess>
      ) : null}
      <Container>
        <GitHub />
        <Google />
        {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
      </Container>
    </React.Fragment>
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
