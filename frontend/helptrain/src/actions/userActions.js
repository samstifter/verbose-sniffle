import { UserActionTypes } from './index.js'

/*=====Action Creaters=====*/
export function setUserType(type) {
  return { type: UserActionTypes.SET_USER_TYPE, payload: type }
}
export function setUserName(name) {
  return { type: UserActionTypes.SET_USER_NAME, payload: name }
}
