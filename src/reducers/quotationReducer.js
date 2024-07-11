import { ACTION_TYPES } from '../actions'
import { getQuotation } from '../helpers'

const initialState = getQuotation() || {}

export const quotationReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.QUOTATION:
			return action.payload
		default:
			return state
	}
}
