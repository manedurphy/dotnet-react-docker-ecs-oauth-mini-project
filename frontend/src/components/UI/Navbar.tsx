import React from 'react';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <Base>
      <a href="">Home</a>
      <a href="">About</a>
      <a href="">Contact</a>
    </Base>
  );
};

const Base = styled.div`
  height: 66px;
  background-color: black;
`;

export default Navbar;
