import { Action, createSlice, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';
import { requestWeatherData } from '../../Requests/axios';
import { setAlert } from './alertSlice';

export interface ProtectedDataState {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface ProtectedDataAction {
  type: string;
  payload: any;
}

const protectedDataSlice = createSlice({
  name: 'protectedData',
  initialState: [],
  reducers: {
    setData: (state: ProtectedDataState[], action: ProtectedDataAction) =>
      action.payload,
  },
});

export const { setData } = protectedDataSlice.actions;

export const getWeatherData = () => async (
  dispatch: ThunkDispatch<void, RootStateOrAny, Action<string>>
) => {
  try {
    const weatherData = await requestWeatherData();
    dispatch(setData(weatherData));
  } catch (err) {
    // dispatch(
    //   setAlert({
    //     message: err.response.statusText,
    //     statusCode: err.response.status,
    //   })
    // );
  }
};

export default protectedDataSlice.reducer;
