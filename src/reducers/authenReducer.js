import { ACTION_TYPES } from '../actions'
import { getUserAuth } from '../helpers'

const initialState = {
	status: getUserAuth() ? true : false,
	user: getUserAuth() ? getUserAuth() : null,
}

export const authenReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_USER:
			return action.payload
		default:
			return state
	}
}
