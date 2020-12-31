import { Action, createSlice, ThunkDispatch } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';
import {
  handleRemoveTokens,
  handleSetTokens,
} from '../../components/LocalStrategy/helpers';
import { requestNewTokens, requestUserData } from '../../Requests/axios';
import { getWeatherData } from './protectedDataSlice';

export interface UserState {
  name: string;
  email: string;
  isAuthorized: boolean;
  loading: boolean;
}

interface SetUserAction {
  type: string;
  payload: UserState;
}

interface SetUserLoadingAction {
  type: string;
  payload: boolean;
}

const userSlice = createSlice({
  name: 'User',
  initialState: {
    name: '',
    email: '',
    isAuthorized: true,
    loading: true,
  },
  reducers: {
    setUser: (state: UserState, action: SetUserAction) => action.payload,
    setUserLoading: (state: UserState, action: SetUserLoadingAction) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const { setUser, setUserLoading } = userSlice.actions;

export const getUserData = () => async (
  dispatch: ThunkDispatch<void, RootStateOrAny, Action<string>>
) => {
  try {
    const userData = await requestUserData();
    dispatch(setUser({ ...userData, isAuthorized: true, loading: false }));
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
        isAuthorized: true,
        loading: false,
      })
    );
  } catch (err) {
    dispatch(
      setUser({
        name: '',
        email: '',
        isAuthorized: false,
        loading: false,
      })
    );
    handleRemoveTokens();
  }
};

export default userSlice.reducer;
