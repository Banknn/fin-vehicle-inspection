import axios from 'axios'
import { BASE_API, BASE_PATH_API } from './apiConfig'
import { getUserAuth, isValidResponse } from '../helpers'

const getConfig = (configService) => {
	const userAuth = getUserAuth()
	const config = {
		baseURL: BASE_API + BASE_PATH_API,
		headers: {
			Authorization: userAuth
				? userAuth.access_token
				: configService.access_token,
			'Content-Type': 'application/json',
		},
		params: {},
	}
	return config
}

const axiosSuccess = (res) => {
	if (isValidResponse(res)) {
		return res.data
	} else {
		return false
	}
}

const axiosError = (error) => {
	const objError = { error }
	console.log('error', objError)
	return false
}

const axiosService = async (type, url, params, configService) => {
	let config = getConfig(configService)
	switch (type) {
		case 'get':
			return axios.get(url, config).then(axiosSuccess).catch(axiosError)
		case 'post':
			return axios
				.post(url, params, config)
				.then(axiosSuccess)
				.catch(axiosError)
		case 'put':
			return axios.put(url, params, config).then(axiosSuccess).catch(axiosError)
		case 'delete':
			return axios.delete(url, config).then(axiosSuccess).catch(axiosError)
		default:
			return false
	}
}

const apiService = (configService = {}) => {
	return {
		get: ({ url, body }) => axiosService('get', url, body, configService),
		post: ({ url, body }) => axiosService('post', url, body, configService),
		put: ({ url, body }) => axiosService('put', url, body, configService),
		delete: ({ url }) => axiosService('delete', url, configService),
	}
}

export default apiService
