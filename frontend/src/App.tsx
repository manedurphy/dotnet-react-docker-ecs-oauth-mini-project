import React, { useEffect } from 'react';
import Navbar from './components/UI/Navbar';
import LocalRegisterForm from './components/LocalStrategy/LocalRegisterForm';
import LocalLoginForm from './components/LocalStrategy/LocalLoginForm';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add, AlertState, remove } from './redux/slices/alertSlice';
import { ProtectedDataState, setData } from './redux/slices/protectedData';
import { setUser, UserState } from './redux/slices/userSlice';
import {
  getNewToken,
  getUserData,
  getWeatherData,
  setToken,
} from './Requests/axios';

interface GlobalState {
  alerts: AlertState[];
  user: UserState;
  proctedData: ProtectedDataState[];
}

const App: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state: GlobalState) => state.user).email;

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();
        const weatherData = await getWeatherData();

        dispatch(setUser(userData));
        dispatch(setData(weatherData));
      } catch (err) {
        try {
          const newToken = await getNewToken(userEmail);
          setToken(newToken);
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
