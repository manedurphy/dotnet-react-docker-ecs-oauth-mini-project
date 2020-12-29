import { combineReducers } from 'redux';
import alertReducer from './alertSlice';
import userReducer from './userSlice';

export default combineReducers({
  alerts: alertReducer,
  user: userReducer,
});
