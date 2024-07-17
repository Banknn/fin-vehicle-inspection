import { ACTION_TYPES } from './actionTypes'

export const orderAction = (payload) => ({
	type: ACTION_TYPES.ORDER,
	payload,
})
