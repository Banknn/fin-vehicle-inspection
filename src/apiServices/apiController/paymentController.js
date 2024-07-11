import apiService from '../apiService'

const apiPath = '/payment'

export const paymentController = (configService) => {
	const service = apiService(configService)
	return {
		savePay: (params) => {
			return service.post({
				url: `${apiPath}/save-payment-vif`,
				body: { ...params },
			})
		},
		upsertPaymentVif: (params) => {
			return service.post({
				url: `${apiPath}/calcom-payment-vif`,
				body: { ...params },
			})
		},
		upsertFinalTranVif: (params) => {
			return service.post({
				url: `${apiPath}/save_final_traninstall_vif`,
				body: { ...params },
			})
		},
		saveInstallmentVif: (params) => {
			return service.post({
				url: `${apiPath}/insert-installment-vif`,
				body: { ...params },
			})
		},
	}
}
