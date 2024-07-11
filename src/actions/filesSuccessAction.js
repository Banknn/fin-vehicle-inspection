import { ACTION_TYPES } from './actionTypes'

export const filesSuccessAction = (payload) => ({
	type: ACTION_TYPES.SET_FILES_SUCCESS,
	payload,
})