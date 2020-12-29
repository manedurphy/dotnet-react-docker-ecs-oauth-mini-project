import { createSlice } from '@reduxjs/toolkit';

export interface AlertState {
  message: string;
  statusCode: number;
}

interface AlertAction {
  type: string;
  payload: AlertState;
}

const alertSlice = createSlice({
  name: 'alerts',
  initialState: [],
  reducers: {
    add: (state: AlertState[], action: AlertAction) => {
      state.push(action.payload);
    },
    remove: (state: AlertState[]) => {
      state.shift();
    },
  },
});

export const { add, remove } = alertSlice.actions;

export default alertSlice.reducer;
