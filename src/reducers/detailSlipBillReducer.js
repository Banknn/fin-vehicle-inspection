import { ACTION_TYPES } from '../actions'

const initialState = {}

export const detailSlipBillReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_DETAIL_SLIP_BILL:
			return action.payload
		default:
			return state
	}
}
