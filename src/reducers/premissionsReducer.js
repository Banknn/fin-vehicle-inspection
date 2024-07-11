import { ACTION_TYPES } from '../actions'

const initialState = {
	cuscode: '',
	name: '',
	status_permissions: null,
}

export const premissionsReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_PREMISSIONS:
			return action.payload
		default:
			return state
	}
}
