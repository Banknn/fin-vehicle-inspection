import { ACTION_TYPES } from '../actions'

const initialState = {
	date_show: null,
}

export const notiOverdueReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_NOTI_OVERDUE:
			return action.payload
		default:
			return state
	}
}