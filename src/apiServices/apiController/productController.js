import apiService from '../apiService'

const apiPath = '/product'

export const productController = (configService) => {
	const service = apiService(configService)
	return {
		updateSelectPlan: (params) => {
			return service.post({
				url: `${apiPath}/select-plan`,
				body: { ...params },
			})
		},
    getListService: () => {
			return service.get({
				url: `${apiPath}/get-list-service`,
			})
		},
    getListProduct: (bill_num) => {
			return service.get({
				url: `${apiPath}/get-list-product?bill_num=${bill_num}`,
			})
		},
	}
}
