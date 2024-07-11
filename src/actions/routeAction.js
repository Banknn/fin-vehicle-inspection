import { ACTION_TYPES } from './actionTypes'

export const setRouteHistory = (payload) => ({
	type: ACTION_TYPES.SET_ROUTE_HISTORY,
	payload,
})
