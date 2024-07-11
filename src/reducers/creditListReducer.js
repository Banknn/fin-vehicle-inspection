import { ACTION_TYPES } from '../actions'

const initialState = {}

export const creditListReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.CREDIT_LIST:
			return action.payload
		default:
			return state
	}
}