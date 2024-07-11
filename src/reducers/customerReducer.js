import { ACTION_TYPES } from '../actions'

const initialState = {}

export const customerReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.CUSTOMER:
			return action.payload
		default:
			return state
	}
}
