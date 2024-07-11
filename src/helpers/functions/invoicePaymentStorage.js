import {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { invoicePaymentAction } from '../../actions'

export const setInvoice = (data) => {
	return setLocalStorage(LOCAL_STORAGE.INVOICE, data)
}

export const getInvoice = async () => {
	return getLocalStorage(LOCAL_STORAGE.INVOICE)
}

export const storeInvoice = async (data) => {
	await store.dispatch(invoicePaymentAction(data))
	setInvoice(data)
}

export const removeStoreInvoice = async () => {
	await store.dispatch(invoicePaymentAction({}))
	removeLocalStorage(LOCAL_STORAGE.INVOICE)
}
