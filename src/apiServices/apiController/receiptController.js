import apiService from '../apiService'

const apiPath = '/receipt'

export const receiptController = (configService) => {
	const service = apiService(configService)
	return {
		generateSlip: (params) => {
			return service.post({
				url: `${apiPath}/generate_receipt`,
				body: params,
			})
		},
		generateSlipShopVif: (params) => {
			return service.post({
				url: `${apiPath}/generate_receipt_shop_vif`,
				body: params,
			})
		},
		saveActionBillVif: (params) => {
			return service.post({
				url: `${apiPath}/save-action-bill-vif`,
				body: params,
			})
		},
		generateTaxShopDailyVif: () => {
			return service.post({
				url: `${apiPath}/generate_tax_daily_vif`,
				body: {},
			})
		},
	}
}
