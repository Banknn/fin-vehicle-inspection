import apiService from '../apiService'

const apiPath = '/system'

export const systemController = (configService) => {
	const service = apiService(configService)
	return {
		getWaitAll: () => {
			return service.get({
				url: `${apiPath}/get_wait_all`,
			})
		},
		getSelectPlanByQuo: (params) => {
			return service.get({
				url: `${apiPath}/get_all_select_plan_by_quo?quo_num=${params}`,
			})
		},
		getPlanByQuoVif: (params) => {
			return service.get({
				url: `${apiPath}/get-plan-by-quo-vif?quo_num=${params}`,
			})
		},
		getWaitByQuo: (params) => {
			return service.get({
				url: `${apiPath}/get_plancampaign_by_quonum?quo_num=${params.quo_num}`,
			})
		},
		updateSelectPlan: (params) => {
			return service.post({
				url: `${apiPath}/select-plan`,
				body: { ...params },
			})
		},
		savePlanAuto: (params) => {
			return service.post({
				url: `${apiPath}/save-plan-auto`,
				body: { ...params },
			})
		},
		savePlanKey: (params) => {
			return service.post({
				url: `${apiPath}/save-plan-key-vif`,
				body: { ...params },
			})
		},
		updatePlanKey: (params) => {
			return service.post({
				url: `${apiPath}/update-plan-key-vif`,
				body: { ...params },
			})
		},
		deleteWaitByQuo: (quoNum) => {
			return service.get({
				url: `${apiPath}/delete_wait_by_quonum?quo_num=${quoNum}`,
			})
		},
		findSelectPlan: (params) => {
			return service.post({
				url: `${apiPath}/find_select_plan`,
				body: params,
			})
		},
		getViFollowAll: (params) => {
			return service.post({
				url: `${apiPath}/get_vi_follow_all`,
				body: params,
			})
		},
		getSummary: (params) => {
			return service.post({
				url: `${apiPath}/get_vi_summary`,
				body: params,
			})
		},
		findCustomer: (params) => {
			return service.post({
				url: `${apiPath}/find-customer`,
				body: { params },
			})
		},
		findCustomerPrb: (params) => {
			return service.post({
				url: `${apiPath}/find-customer-prb`,
				body: { ...params },
			})
		},
		findCustomerTroFin: (params) => {
			return service.post({
				url: `${apiPath}/find-customer-trofin`,
				body: { ...params },
			})
		},
		activeInsuranceVif: (quo_num) => {
			return service.post({
				url: `${apiPath}/active-insurance-vif`,
				body: { quo_num },
			})
		},
		saveCreditSlipVif: (params) => {
			return service.post({
				url: `${apiPath}/save-credit-slip-vif`,
				body: params,
			})
		},
		getInvoiceVif: () => {
			return service.get({
				url: `${apiPath}/get-invoice-vif`,
			})
		},
		getInvoiceByCuscode: (cuscode) => {
			return service.get({
				url: `${apiPath}/get-invoice-cuscode?cuscode=${cuscode}`,
			})
		},
		cancelInsuranceVif: (params) => {
			return service.post({
				url: `${apiPath}/cancel-insurance-vif`,
				body: params,
			})
		},
		cancelWaitInsuranceVif: (quo_num) => {
			return service.post({
				url: `${apiPath}/cancel-wait-insurance-vif`,
				body: { quo_num },
			})
		},
		getWaitCancelInsuranceAdminVif: () => {
			return service.get({
				url: `${apiPath}/get-wait-cancel-insurance-admin-vif`,
			})
		},
		getAllInsuranceVif: () => {
			return service.get({
				url: `${apiPath}/get-all-insurance-admin-vif`,
			})
		},
		saveInvoiceSlipAdminVif: (params) => {
			return service.post({
				url: `${apiPath}/save-invoice-slip-admin-vif`,
				body: params,
			})
		},
		logDataVif: (params) => {
			return service.post({
				url: `${apiPath}/log-data-vif`,
				body: params,
			})
		},
		getCompanyInsuranceQuantity: (params) => {
			const { startDate, endDate, cuscode, type } = params
			return service.get({
				url: `${apiPath}/get-company-insurance-qty?type=${type}&cuscode=${cuscode}&startDate=${startDate}&endDate=${endDate}`,
			})
		},
		getSystempayfileVif: (quo_num) => {
			return service.get({
				url: `${apiPath}/get-systempayfile-vif?quo_num=${quo_num}`,
			})
		},
		getCheckPayVif: (params) => {
			const { cuscode, startDate, endDate } = params
			return service.get({
				url: `${apiPath}/get-checkpay-vif?cuscode=${cuscode}&startDate=${startDate}&endDate=${endDate}`,
			})
		},
		lockUserVif: (params) => {
			const { cuscode, status } = params
			return service.get({
				url: `${apiPath}/lock-user-vif?cuscode=${cuscode}&status=${status}`,
			})
		},
		createUserAdmin: (params) => {
			const { cuscode, countUser } = params
			return service.get({
				url: `${apiPath}/create_user_admin?cuscode=${cuscode}&countUser=${countUser}`,
			})
		},
		getUserAdmin: (cuscode) => {
			return service.get({
				url: `${apiPath}/get_user_admin?cuscode=${cuscode}`,
			})
		},
		createUser: (params) => {
			return service.post({
				url: `${apiPath}/create_wp_user`,
				body: params,
			})
		},
		getAllCountLot: () => {
			return service.get({
				url: `${apiPath}/get_all_count_lot`,
			})
		},
		getCuscodeByLot: (lot) => {
			return service.get({
				url: `${apiPath}/get_cuscode_by_lot?lot=${lot}`,
			})
		},
		getNewsBroadcast: () => {
			return service.get({
				url: `${apiPath}/get_news_broadcast`,
			})
		},
		checkPrbInsSame: (params) => {
			const { id_motor2, type } = params
			return service.get({
				url: `${apiPath}/check_prb_ins_same?id_motor2=${id_motor2}&type=${type}`,
			})
		},
		checkNotiOverdue: () => {
			return service.get({
				url: `${apiPath}/check_noti_overdue`,
			})
		},
		getUserProFiles: (cuscode) => {
			return service.get({
				url: `${apiPath}/get_user_profiles?cuscode=${cuscode}`,
			})
		},
		changPremissionVif: (params) => {
			return service.post({
				url: `${apiPath}/chang_premission_vif`,
				body: params,
			})
		},
		getWaitPremissionVif: () => {
			return service.get({
				url: `${apiPath}/get_wait_premission_vif`,
			})
		},
		saveBillSlipVif: (params) => {
			return service.post({
				url: `${apiPath}/save-bill-slip-vif`,
				body: params,
			})
		},
		getLogApiCompany: (params) => {
			const { search, chanel } = params
			return service.get({
				url: `${apiPath}/get-log-api-company?search=${search}&chanel=${chanel}`,
			})
		},
		checkDuplicateVif: (params) => {
			return service.post({
				url: `${apiPath}/check_duplicate_vif`,
				body: { ...params },
			})
		},
		getSlipCancelVif: (quo_num) => {
			return service.get({
				url: `${apiPath}/get_slip_cancel_vif?quo_num=${quo_num}`,
			})
		},
		getDetailPlanByQuoVif: (params) => {
			console.log(params)
			return service.post({
				url: `${apiPath}/get_detailplan_by_quonum_vif`,
				body: { ...params, updateTran: true },
			})
		},
		getDownlineSale: (params) => {
			return service.post({
				url: `${apiPath}/downline-sale-vif`,
				body: { ...params },
			})
		},
    getFollowAll: (params) => {
      return service.post({
        url: 'https://fininsurance.co.th:2022/api/v1/insurance/system/get_follow_all',
        body: params,
      })
    },
    getDetailPlanByQuo: (quo_num) => {
      return service.get({
        url: `https://fininsurance.co.th:2022/api/v1/insurance/system/get_detailplan_by_quonum?quo_num=${quo_num}`,
      })
    },
    getDetailFollow: (quo_num) => {
      return service.get({
        url: `https://fininsurance.co.th:2022/api/v1/insurance/system/get_detail_follow?quo_num=${quo_num}`,
      })
    },
	}
}
