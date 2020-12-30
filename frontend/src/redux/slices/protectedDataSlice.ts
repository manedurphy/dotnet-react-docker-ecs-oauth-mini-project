import { Action, createSlice, ThunkDispatch } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';
import { requestWeatherData } from '../../Requests/axios';

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
  const weatherData = await requestWeatherData();
  dispatch(setData(weatherData));
};

export default protectedDataSlice.reducer;
