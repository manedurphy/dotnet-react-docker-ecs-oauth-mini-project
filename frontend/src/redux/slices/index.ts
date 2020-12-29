import { combineReducers } from 'redux';
import alertReducer from './alertSlice';
import userReducer from './userSlice';
import protectedDataReducer from './protectedData';

export default combineReducers({
  alerts: alertReducer,
  user: userReducer,
  protectedData: protectedDataReducer,
});
