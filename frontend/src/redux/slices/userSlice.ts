import { Action, createSlice, ThunkDispatch } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';
import { handleSetTokens } from '../../components/LocalStrategy/helpers';
import { requestNewTokens, requestUserData } from '../../Requests/axios';
import { setAlert } from './alertSlice';
import { getWeatherData } from './protectedData';

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

export const getUserData = () => async (
  dispatch: ThunkDispatch<void, RootStateOrAny, Action<string>>
) => {
  try {
    const userData = await requestUserData();
    dispatch(setUser(userData));
  } catch (err) {
    dispatch(getNewTokens());
  }
};

export const getNewTokens = () => async (
  dispatch: ThunkDispatch<void, RootStateOrAny, Action<string>>
) => {
  try {
    const refreshResponse = await requestNewTokens();
    handleSetTokens(refreshResponse.token, refreshResponse.refreshToken);

    dispatch(getWeatherData());

    dispatch(
      setUser({
        name: refreshResponse.name,
        email: refreshResponse.email,
      })
    );
  } catch (err) {
    // dispatch(
    //   setAlert({
    //     message: err.response.statusText,
    //     statusCode: err.response.status,
    //   })
    // );
  }
};

export default userSlice.reducer;
