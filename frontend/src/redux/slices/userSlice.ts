import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  email: string;
}

interface SetUserAction {
  type: string;
  payload: UserState;
}

const userSlice = createSlice({
  name: 'User',
  initialState: {
    name: '',
    email: '',
  },
  reducers: {
    setUser: (state: UserState, action: SetUserAction) => action.payload,
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
