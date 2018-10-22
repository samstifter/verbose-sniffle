import { QueueActionTypes } from './index.js'

/*=====Action Creaters=====*/
export async function updateQueue(type) {
  return { type: QueueActionTypes.UPDATE_QUEUE, payload: null }
}
