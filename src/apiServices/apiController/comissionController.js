import apiService from '../apiService'

const apiPath = '/comission'

export const comissionController = (configService) => {
	const service = apiService(configService)
	return {
		getIncentiveShoptro: (params) => {
			return service.post({
				url: `${apiPath}/get_incentive_shoptro`,
				body: { ...params },
			})
		},
	}
}
