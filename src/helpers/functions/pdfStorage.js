import {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { pdfAction } from '../../actions'

export const setPdf = (data) => {
	return setLocalStorage(LOCAL_STORAGE.PDF, data)
}

export const getPdf = () => {
	return getLocalStorage(LOCAL_STORAGE.PDF)
}

export const storePdf = async (data) => {
	await store.dispatch(pdfAction(data))
	setPdf(data)
}

export const removeStorePdf = async () => {
	await store.dispatch(pdfAction({}))
	removeLocalStorage(LOCAL_STORAGE.PDF)
}
