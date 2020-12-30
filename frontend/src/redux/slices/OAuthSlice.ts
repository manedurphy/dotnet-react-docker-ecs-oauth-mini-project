import { createSlice } from '@reduxjs/toolkit';

const OAuthSlice = createSlice({
  name: 'OAuth',
  initialState: false,
  reducers: {
    setStatus: (state, action) => action.payload,
  },
});

export const { setStatus } = OAuthSlice.actions;

export default OAuthSlice.reducer;
