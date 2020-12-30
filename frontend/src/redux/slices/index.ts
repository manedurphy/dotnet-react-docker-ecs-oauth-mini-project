import { combineReducers } from 'redux';
import alertReducer from './alertSlice';
import userReducer from './userSlice';
import protectedDataReducer from './protectedDataSlice';
import OAuthReducer from './OAuthSlice';

export default combineReducers({
  alerts: alertReducer,
  user: userReducer,
  protectedData: protectedDataReducer,
  OAuth: OAuthReducer,
});
