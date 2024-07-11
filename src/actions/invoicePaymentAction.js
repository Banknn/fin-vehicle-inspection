import { ACTION_TYPES } from './actionTypes'

export const invoicePaymentAction = (payload) => ({
	type: ACTION_TYPES.INVOICE,
	payload,
})
