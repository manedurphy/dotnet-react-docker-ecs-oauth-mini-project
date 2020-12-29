import { createSlice } from '@reduxjs/toolkit';

interface Alert {
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

export default alertSlice.reducer;
