import { ACTION_TYPES } from './actionTypes'

export const installmentAction = (payload) => ({
	type: ACTION_TYPES.INSTALLMENT_LIST,
	payload,
})
