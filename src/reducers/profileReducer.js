import { ACTION_TYPES } from '../actions'

const initialState = {
	vif_type: '2'
}

export const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.PROFILE:
			return action.payload
		default:
			return state
	}
}