import apiService from '../apiService'

const apiPath = '/invoice'

export const invoiceController = (configService) => {
	const service = apiService(configService)
	return {
		getLastInvoiceByCuscodeVif: () => {
			return service.get({
				url: `${apiPath}/get-last-invoice-by-cuscode-vif`,
			})
		},
		genLastInvoiceNumberVif: () => {
			return service.get({
				url: `${apiPath}/get-last-invoice-number-vif`,
			})
		},
		genInvoiceVif: (params) => {
			return service.post({
				url: `${apiPath}/generate-invoice-vif`,
				body: { ...params },
			})
		},
		genInvoiceByAdminVif: (params) => {
			return service.post({
				url: `${apiPath}/generate-invoice-by-admin-vif`,
				body: { ...params },
			})
		},
    genInvoiceInstallmentVif: (params) => {
			return service.post({
				url: `${apiPath}/generate-invoice-installment`,
				body: { ...params },
			})
		},
		getInvoiceNotPayVif: () => {
			return service.get({
				url: `${apiPath}/get-invoice-payment-not-pay-vif`,
			})
		},
		updatePreparePaymentVif: (params) => {
			return service.post({
				url: `${apiPath}/update-prepare-payment-vif`,
				body: { ...params },
			})
		},
		getInvoiceByAdminVif: (end) => {
			return service.get({
				url: `${apiPath}/get-invoice-by-admin-vif?endDate=${end}`,
			})
		},
		generateInvoiceAll: (params) => {
			return service.post({
				url: `${apiPath}/generate-invoice-all`,
        body: { ...params },
			})
		},
	}
}
