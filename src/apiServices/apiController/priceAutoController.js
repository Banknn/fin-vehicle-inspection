import apiService from '../apiService'

const apiPath = '/priceAuto'

export const priceAutoController = (configService) => {
	const service = apiService(configService)
	return {
		getPriceAuto: (params) => {
			return service.post({
				url: `${apiPath}/get_price_auto`,
				body: { ...params },
			})
		},
	}
}