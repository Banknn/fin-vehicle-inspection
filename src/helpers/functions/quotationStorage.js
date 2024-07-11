import {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { quotationAction } from '../../actions'

export const setQuotation = (data) => {
	return setLocalStorage(LOCAL_STORAGE.QUOTATION, data)
}

export const getQuotation = () => {
	return getLocalStorage(LOCAL_STORAGE.QUOTATION)
}

export const storeQuotation = async (data) => {
	await store.dispatch(quotationAction(data))
	setQuotation(data)
}

export const removeStoreQuotation = async () => {
	await store.dispatch(quotationAction({}))
	removeLocalStorage(LOCAL_STORAGE.QUOTATION)
}
