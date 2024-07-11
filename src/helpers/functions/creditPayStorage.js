import {
	getLocalStorage,
	setLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { creditPayAction } from '../../actions'

export const setCreditPay = (data) => {
	return setLocalStorage(LOCAL_STORAGE.CREDIT_PAY, data)
}

export const getCreditPay = () => {
	return getLocalStorage(LOCAL_STORAGE.CREDIT_PAY)
}

export const storeCreditPay = async (data = 0) => {
	await store.dispatch(creditPayAction(data))
	setCreditPay(data)
}

export const removeStoreCreditPay = async () => {
	await store.dispatch(creditPayAction({ credit: 0, commission: 0, balance: 0 }))
	setCreditPay({ credit: 0, commission: 0, balance: 0 })
}
