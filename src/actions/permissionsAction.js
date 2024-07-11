import { ACTION_TYPES } from './actionTypes'

export const permissionsAction = (payload) => ({
	type: ACTION_TYPES.SET_PREMISSIONS,
	payload,
})