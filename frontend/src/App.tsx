import React, { useEffect } from 'react';
import Navbar from './components/UI/Navbar';
import LocalRegisterForm from './components/LocalStrategy/LocalRegisterForm';
import LocalLoginForm from './components/LocalStrategy/LocalLoginForm';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { add, remove } from './redux/slices/alertSlice';
import { setData } from './redux/slices/protectedData';
import { setUser } from './redux/slices/userSlice';
import { getNewToken, getUserData, getWeatherData } from './Requests/axios';
import { handleSetTokens } from './components/LocalStrategy/helpers';

const App: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();
        const weatherData = await getWeatherData();

        dispatch(setUser(userData));
        dispatch(setData(weatherData));
      } catch (err) {
        try {
          const refreshResponse = await getNewToken();
          handleSetTokens(refreshResponse.token, refreshResponse.refreshToken);

          dispatch(
            setUser({
              name: refreshResponse.name,
              email: refreshResponse.email,
            })
          );
        } catch (err) {
          dispatch(
            add({
              message: err.response.statusText,
              statusCode: err.response.status,
            })
          );
          setTimeout(() => {
            dispatch(remove());
          }, 3000);
        }
      }
    })();
  }, []);
  return (
    <React.Fragment>
      <Navbar />
      <Route exact path={'/register'} component={LocalRegisterForm} />
      <Route exact path={'/login'} component={LocalLoginForm} />
    </React.Fragment>
  );
};

export default App;
