import { ACTION_TYPES } from '../actions'

const initialState = []

export const invoicePaymentReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.INVOICE:
			return action.payload
		default:
			return state
	}
}
