import apiService from '../apiService'

export const qrController = (configService) => {
	const service = apiService(configService)
	return {
		genCreditTopUp: (params) => {
			return service.post({
				url: `/gen-credit-top-up`,
				body: { ...params },
			})
		},
		genCreditTopUpByAdmin: (params) => {
			return service.post({
				url: `/gen-credit-top-up-by-admin`,
				body: { ...params },
			})
		},
		genQr: (params) => {
			return service.post({
				url: `/gen_number_format`,
				body: { ...params },
			})
		},
	}
}
