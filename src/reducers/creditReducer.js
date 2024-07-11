import { ACTION_TYPES } from '../actions'

const initialState = {
	creditBalance: 0,
	creditUse: 0,
	creditTotal: 0,
}

export const creditReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.CREDIT:
			return action.payload
		default:
			return state
	}
}
