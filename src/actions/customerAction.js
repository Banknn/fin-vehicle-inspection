import { ACTION_TYPES } from './actionTypes'

export const customerAction = (payload) => ({
	type: ACTION_TYPES.CUSTOMER,
	payload,
})
