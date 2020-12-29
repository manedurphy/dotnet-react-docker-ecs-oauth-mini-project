import { createSlice } from '@reduxjs/toolkit';

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

export default protectedDataSlice.reducer;
