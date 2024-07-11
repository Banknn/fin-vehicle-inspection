import { ACTION_TYPES } from './actionTypes'

export const authenAction = (payload) => ({
	type: ACTION_TYPES.SET_USER,
	payload,
})
