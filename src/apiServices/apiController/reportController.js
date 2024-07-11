import apiService from '../apiService'

const apiPath = '/report'

export const reportController = (configService) => {
	const service = apiService(configService)
	return {
		getHistory: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-history-report-vif?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getDailyReport: ({ startDate, endDate }) => {
			return service.get({
				url: `${apiPath}/get-daily-report-vif?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getDailyCancelReport: ({ startDate, endDate }) => {
			return service.get({
				url: `${apiPath}/get-daily-cancel-report-vif?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		downloadDailyReport: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/download-daily-report-vif?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getPaymentReportVIF: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/payment-report-vif?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getOutstandingBalance: (date) => {
			return service.get({
				url: `${apiPath}/outstandingBalance-report-vif?date=${date}`,
			})
		},
		getReceivables: () => {
			return service.get({
				url: `${apiPath}/get-receivables-report-vif`,
			})
		},
		getBillReportVIF: (startDate) => {
			return service.get({
				url: `${apiPath}/get-bills-report-vif?date=${startDate}`,
			})
		},
		getAgingReportVif: (date) => {
			return service.get({
				url: `${apiPath}/get-aging-report-vif?date=${date}`,
			})
		},
		getSalesPrbInsVif: (params) => {
			const { startDate, endDate, company, type, channel, level } = params
			return service.get({
				url: `${apiPath}/get-sales-prb-ins-vif?startDate=${startDate}&endDate=${endDate}&type=${type}&company=${company}&channel=${channel}&level=${level}`,
			})
		},
		getUserVif: () => {
			return service.get({
				url: `${apiPath}/get-user-vif`,
			})
		},
		getSellList: (params) => {
			const { startDate, endDate, company } = params
			return service.get({
				url: `${apiPath}/get_SellList?startDate=${startDate}&endDate=${endDate}&company=${company}`,
			})
		},
		getSaleCancelVif: (params) => {
			const { startDate, endDate, company } = params
			return service.get({
				url: `${apiPath}/get_SaleCancelVif?startDate=${startDate}&endDate=${endDate}&company=${company}`,
			})
		},
		getDownLineSaleReport: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-DownLine-SaleReport?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getReportNonActive: (params) => {
			const { startDate, endDate, channel } = params
			return service.get({
				url: `${apiPath}/get-report-non-active?startDate=${startDate}&endDate=${endDate}&channel=${channel}`,
			})
		},
		getReportClassifyDebitCredit: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-report-classify-debit-credit?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getReportSalesYears: (years) => {
			return service.get({
				url: `${apiPath}/get-report-sales-years?years=${years}`,
			})
		},
		getReportDebit: () => {
			return service.get({
				url: `${apiPath}/get-report-debit`,
			})
		},
		getReportDebitAdmin: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-report-debit-admin?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getDetailReportDebitAdmin: (params) => {
			const { cuscode, startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-detail-report-debit-admin?cuscode=${cuscode}&startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getDetailBillHistory: (params) => {
			const { start, end, id_cus } = params
			return service.get({
				url: `${apiPath}/get-detail-bill-history?startDate=${start}&endDate=${end}&id_cus=${id_cus}`,
			})
		},
		getDetailBillDaily: (params) => {
			const { start, end, id_cus } = params
			return service.get({
				url: `${apiPath}/get-detail-bill-daily?startDate=${start}&endDate=${end}&id_cus=${id_cus}`,
			})
		},
		getBillDailyAccount: (params) => {
			const { start, end } = params
			return service.get({
				url: `${apiPath}/get-bill-daily-account?startDate=${start}&endDate=${end}`,
			})
		},
		getDetailFileHistory: (bill_num) => {
			return service.get({
				url: `${apiPath}/get-detail-File-history?bill_num=${bill_num}`,
			})
		},
		getUploadSlipBill: () => {
			return service.get({
				url: `${apiPath}/get-upload-slip-bill`,
			})
		},
		getCheckSlipBill: (params) => {
			const { start, end } = params
			return service.get({
				url: `${apiPath}/get-check-slip-bill?startDate=${start}&endDate=${end}`,
			})
		},
		getDetailSlipBill: (inv_no) => {
			return service.get({
				url: `${apiPath}/get-detail-slip-bill?invNo=${inv_no}`,
			})
		},
		getPriceRenewKumpai: () => {
			return service.get({
				url: `${apiPath}/get-price_renew_kumpai`,
			})
		},
		getInsuranceOlds: (params) => {
			const { search, chanel } = params
			return service.get({
				url: `${apiPath}/get-insurance-olds?search=${search}&chanel=${chanel}`,
			})
		},
		getDetailBillAccount: (params) => {
			const { start, end } = params
			return service.get({
				url: `${apiPath}/get-detail-bill-cancel-admin?startDate=${start}&endDate=${end}`,
			})
		},
		getOverdueReportVIF: (mySearch) => {
			return service.get({
				url: `${apiPath}/overdue-report-vif?mySearch=${mySearch}`,
			})
		},
		getTaxDailyReport: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-tax-daily?startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getLogErrorAccount: (params) => {
			const { startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get_log_error_account?startDate=${startDate}&endDate=${endDate}`,
			})
		},
	}
}
