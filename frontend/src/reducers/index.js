import { combineReducers } from 'redux';
import counter from './counter';
import rooms from './rooms';
import messages from './messages';

export default combineReducers({
  counter,
	rooms,
	messages
});
