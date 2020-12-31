import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <Base>
      <Links>
        <Link to="/register">Local</Link>
        <Link to="/oauth">OAuth</Link>
      </Links>
    </Base>
  );
};

const Base = styled.div`
  height: 66px;
  background-color: black;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Links = styled.div`
  width: 150px;
  display: flex;
  justify-content: space-between;
  margin-right: 25px;
`;

export default Navbar;
