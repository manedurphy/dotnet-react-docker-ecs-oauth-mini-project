import { Action, createSlice, ThunkDispatch } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

export interface Alert {
  message: string;
  statusCode: number;
}

interface AlertAction {
  type: string;
  payload: Alert;
}

const alertSlice = createSlice({
  name: 'alerts',
  initialState: [],
  reducers: {
    add: (state: Alert[], action: AlertAction) => {
      state.push(action.payload);
    },
    remove: (state: Alert[]) => {
      state.shift();
    },
  },
});

export const { add, remove } = alertSlice.actions;

export const setAlert = (alert: Alert) => (
  dispatch: ThunkDispatch<void, RootStateOrAny, Action<string>>
) => {
  dispatch(add(alert));
  setTimeout(() => {
    dispatch(remove());
  }, 3000);
};

export default alertSlice.reducer;
