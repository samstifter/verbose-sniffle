import initialState from './initialState';
import { UserActionTypes } from '../actions/';

export function User(state = initialState.user, action) {
  switch (action.type) {
    case UserActionTypes.SET_USER_TYPE:
      return { ...state, type: action.payload }
    case UserActionTypes.SET_USER_NAME:
      return { ...state, name: action.payload }
    default:
      return state;
  }
}
