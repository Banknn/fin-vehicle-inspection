import {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage,
} from './localStorage'
import { store } from '../../stores'
import { LOCAL_STORAGE } from '../constants'
import { authenAction } from '../../actions'

export const setUserAuth = (data) => {
	return setLocalStorage(LOCAL_STORAGE.USER_AUTH, data)
}

export const getUserAuth = () => {
	return getLocalStorage(LOCAL_STORAGE.USER_AUTH)
}

export const processLogin = async (data) => {
	await store.dispatch(authenAction({ status: true, user: data }))
	setUserAuth(data)
}

export const processLogout = async () => {
	await store.dispatch(authenAction({ status: false }))
	removeLocalStorage(LOCAL_STORAGE.USER_AUTH)
}
