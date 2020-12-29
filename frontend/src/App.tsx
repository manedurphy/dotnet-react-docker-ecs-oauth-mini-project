import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Navbar from './components/UI/Navbar';
import LocalForm from './components/LocalStrategy/LocalRegisterForm';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { add, remove } from './redux/slices/alertSlice';

interface Data {
  date: Date;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

const App: React.FC = (): JSX.Element => {
  const [data, setData] = useState<Data>();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/WeatherForecast')
      .then((res: AxiosResponse<Data>) => setData(res.data))
      .catch((err) => {
        dispatch(
          add({
            message: err.response.statusText,
            statusCode: err.response.status,
          })
        );
        setTimeout(() => {
          dispatch(remove());
        }, 3000);
      });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <Route exact path={'/register'} component={LocalForm} />
    </React.Fragment>
  );
};

export default App;
