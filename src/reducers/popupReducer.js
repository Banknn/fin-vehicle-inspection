import { ACTION_TYPES } from '../actions'

const initialState = {}

export const popupReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.POPUP:
			return action.payload
		default:
			return state
	}
}
