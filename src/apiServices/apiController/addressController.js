import apiService from '../apiService'

const apiPath = '/address'

export const addressController = (configService) => {
	const service = apiService(configService)
	return {
		getAddress: () => {
			return service.get({
				url: `${apiPath}/getAddress`,
			})
		},
		getProvinces: () => {
			return service.get({
				url: `${apiPath}/getProvinces`,
			})
		},
	}
}
