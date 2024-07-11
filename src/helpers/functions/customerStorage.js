import {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { customerAction } from '../../actions'

export const setCustomer = (data) => {
	return setLocalStorage(LOCAL_STORAGE.CUSTOMER, data)
}

export const getCustomer = async () => {
	return getLocalStorage(LOCAL_STORAGE.CUSTOMER)
}

export const storeCustomer = async (data) => {
	await store.dispatch(customerAction(data))
	setCustomer(data)
}

export const removeStoreCustomer = async () => {
	await store.dispatch(customerAction({}))
	removeLocalStorage(LOCAL_STORAGE.CUSTOMER)
}
