import { ACTION_TYPES } from './actionTypes'

export const notiOverdueAction = (payload) => ({
	type: ACTION_TYPES.SET_NOTI_OVERDUE,
	payload,
})