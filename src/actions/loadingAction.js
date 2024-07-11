import { ACTION_TYPES } from './actionTypes'

export const loadingAction = (payload) => ({
	type: ACTION_TYPES.IS_LOADING,
	payload,
})
