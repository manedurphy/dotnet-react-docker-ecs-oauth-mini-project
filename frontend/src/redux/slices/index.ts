import { combineReducers } from 'redux';
import alertReducer from './alertSlice';

export default combineReducers({
  alerts: alertReducer,
});
