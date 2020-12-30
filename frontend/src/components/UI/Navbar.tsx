import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={'nav-base'}>
      <div className={'nav-links'}>
        <Link className={'nav-link'} to="/register">
          Local
        </Link>
        <Link className={'nav-link'} to="/oauth">
          OAuth
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
