import { ACTION_TYPES } from '../actions'

const initialState = {
	files_prb: false,
	files_ins: false,
	type: '',
}

export const filesSuccessReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_FILES_SUCCESS:
			return action.payload
		default:
			return state
	}
}