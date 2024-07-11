import { ACTION_TYPES } from '../actions'

const initialState = {}

export const routeHistoryRedux = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_ROUTE_HISTORY:
			return action.payload
		default:
			return state
	}
}
