import apiService from '../apiService'

const apiPath = '/pricelist'

export const priceListController = (configService) => {
	const service = apiService(configService)
	return {
		getPriceAuto: (params) => {
			return service.post({
				url: `${apiPath}/get_price_auto`,
				body: { ...params, type_vif: 'WEB' },
			})
		},
	}
}
