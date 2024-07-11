import { ACTION_TYPES } from '../actions'

const initialState = {}

export const pdfReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.PDF:
			return action.payload
		default:
			return state
	}
}
