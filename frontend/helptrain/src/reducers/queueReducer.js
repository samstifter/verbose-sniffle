import initialState from './initialState';
import { QueueActionTypes } from '../actions/';
import { QueueAPI } from '../api'

export function Queue(state = initialState.queue, action) {
  switch (action.type) {
    case QueueActionTypes.UPDATE_QUEUE:
      let data = await QueueAPI.GetQueue();
      return { ...state, type: action.payload }
    default:
      return state;
  }
}
