import { ACTION_TYPES } from './actionTypes'

export const pdfAction = (payload) => ({
	type: ACTION_TYPES.PDF,
	payload,
})
