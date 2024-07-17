import { ACTION_TYPES } from '../actions'

const initialState = {}

export const orderReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.ORDER:
			return action.payload
		default:
			return state
	}
}
