import apiService from '../apiService'

const apiPath = '/company'

export const companyController = (configService) => {
	const service = apiService(configService)
	return {
		getCompanyBrand: () => {
			return service.get({
				url: `${apiPath}/get_all`,
			})
		},
		getOnCompanyAll: () => {
			return service.get({
				url: `${apiPath}/get_on_all_company`,
			})
		},
		changOnCompanyAll: (params) => {
			return service.post({
				url: `${apiPath}/chang_on_all_company`,
				body: { ...params },
			})
		},
		sendNotiLineErrorVif: (params) => {
			return service.post({
				url: `${apiPath}/send_noti_line_error_vif`,
				body: { ...params },
			})
		},
	}
}
