import initialState from './initialState';
import { SET_USER_TYPE } from '../actions/actionTypes.js';

export default function User(state = initialState.user, action) {
  switch (action.type) {
    case SET_USER_TYPE:
      console.log('Setting User Type to ' + action.payload);
      state.user = action.payload;
      return state;
    default:
      return state;
  }
}
