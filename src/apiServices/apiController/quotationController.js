import apiService from '../apiService'

const apiPath = '/quotation'

export const quotationController = (configService) => {
	const service = apiService(configService)
	return {
		generateCampaignQuotation: (params) => {
			return service.post({
				url: `${apiPath}/generate_pdf_campaign`,
				body: { ...params },
			})
		},
	}
}
