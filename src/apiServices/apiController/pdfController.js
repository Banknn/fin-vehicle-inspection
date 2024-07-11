import apiService from '../apiService'

const apiPath = '/pdf'

export const pdfController = (configService) => {
	const service = apiService(configService)
	return {
		uploadFiletoSpace: (params) => {
			return service.post({
				url: `${apiPath}/uploadFiletoSpace`,
				body: { ...params, type_insure: 'ตรอ' },
			})
		},
		uploadFiletoSpaceAgain: (params) => {
			return service.post({
				url: `${apiPath}/uploadFiletoSpaceAgain`,
				body: { ...params },
			})
		},
	}
}
