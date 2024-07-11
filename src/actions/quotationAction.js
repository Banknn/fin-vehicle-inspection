import { ACTION_TYPES } from './actionTypes'

export const quotationAction = (payload) => ({
	type: ACTION_TYPES.QUOTATION,
	payload,
})
