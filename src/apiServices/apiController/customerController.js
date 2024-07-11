import apiService from '../apiService'

const apiPath = '/customer'

export const customerController = (configService) => {
	const service = apiService(configService)
	return {
		findCustomer: (params) => {	
			return service.post({
				url: `${apiPath}/find-customer`,
				body: { params },
			})
		},
	}
}
