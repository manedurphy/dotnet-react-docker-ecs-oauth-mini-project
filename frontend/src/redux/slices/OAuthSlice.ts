import { createSlice } from '@reduxjs/toolkit';

export interface OAuthState {
  loading: boolean;
  authorized: boolean;
}

interface OAuthAction {
  type: string;
  payload: boolean;
}

const OAuthSlice = createSlice({
  name: 'OAuth',
  initialState: {
    loading: false,
    authorized: false,
  },
  reducers: {
    setLoading: (state: OAuthState, action: OAuthAction) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setAuthorized: (state: OAuthState, action: OAuthAction) => {
      return {
        ...state,
        authorized: action.payload,
      };
    },
  },
});

export const { setLoading } = OAuthSlice.actions;

export default OAuthSlice.reducer;
