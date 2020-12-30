import React, { useEffect } from 'react';
import Navbar from './components/UI/Navbar';
import LocalRegisterForm from './components/LocalStrategy/LocalRegisterForm';
import LocalLoginForm from './components/LocalStrategy/LocalLoginForm';
import Home from './components/Home';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getWeatherData } from './redux/slices/protectedData';
import { getUserData } from './redux/slices/userSlice';

const App: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getWeatherData());
  }, []);
  return (
    <React.Fragment>
      <Navbar />
      <Route exact path={'/'} component={Home} />
      <Route exact path={'/register'} component={LocalRegisterForm} />
      <Route exact path={'/login'} component={LocalLoginForm} />
    </React.Fragment>
  );
};

export default App;
