import React, { useEffect } from 'react';
import Navbar from './components/UI/Navbar';
import LocalRegisterForm from './components/LocalStrategy/LocalRegisterForm';
import LocalLoginForm from './components/LocalStrategy/LocalLoginForm';
import Home from './components/Home';
import OAuth from './components/OAuth/OAuthStrategy';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserData } from './redux/slices/userSlice';

const App: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect((): void => {
    dispatch(getUserData());
  }, []);
  return (
    <React.Fragment>
      <Navbar />
      <Route exact path={'/'} component={Home} />
      <Route exact path={'/oauth'} component={OAuth} />
      <Route exact path={'/register'} component={LocalRegisterForm} />
      <Route exact path={'/login'} component={LocalLoginForm} />
    </React.Fragment>
  );
};

export default App;
