import { ACTION_TYPES } from '../actions'

const initialState = {}

export const installmentReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.INSTALLMENT_LIST:
			return action.payload
		default:
			return state
	}
}
