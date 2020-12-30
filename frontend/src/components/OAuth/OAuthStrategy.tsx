import React from 'react';
import GitHub from './GitHub';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../Requests/interfaces';
import styled from 'styled-components';

const OAuth = () => {
  const user = useSelector((state: GlobalState) => state.user);
  return (
    <Container>
      <GitHub />
      {user.isAuthorized && !user.loading && <Redirect to={'/'} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 40%;
`;

export default OAuth;
