import { ACTION_TYPES } from '../actions'

const initialState = false

export const loadingReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.IS_LOADING:
			return action.payload
		default:
			return state
	}
}
