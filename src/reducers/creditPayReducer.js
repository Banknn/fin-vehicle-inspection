import { ACTION_TYPES } from '../actions'

const initialState = {}

export const creditPayReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.CREDIT_PAY:
			return action.payload
		default:
			return state
	}
}
