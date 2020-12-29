import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Base>
      <Links>
        <Link /*className={'link'} style={LinkStyle}*/ to="/register">
          Local
        </Link>
        <Link /*className={'link'} style={LinkStyle}*/ to="/oauth">OAuth</Link>
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

const LinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1.5rem',
};

export default Navbar;
