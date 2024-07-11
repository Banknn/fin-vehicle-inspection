import apiService from '../apiService'

const apiPath = '/policy'

export const policyController = (configService) => {
	const service = apiService(configService)
	return {
		generateTaxShopDailyVif: () => {
			return service.post({
				url: `${apiPath}/generate_tax_daily_vif`,
				body: {},
			})
		},
		intraPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params },
			})
		},
		intraPrbV2: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'intra_v2_cmi', send_from: 'ตรอ' },
			})
		},
		intraInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'intra_vmi', send_from: 'ตรอ' },
			})
		},
		chubbInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'chubb_vmiv2', send_from: 'ตรอ' },
			})
		},
		chubbPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'chubb_cmiv2', send_from: 'ตรอ' },
			})
		},
		axaPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'axa',
					api_action: 'CallAPI_axa_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		axaInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'axa',
					api_action: 'CallAPI_axa_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		kumpaiPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'kumpai_cmi', send_from: 'ตรอ' },
			})
		},
		kumpaiInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'kumpai_vmi', send_from: 'ตรอ' },
			})
		},
		viriyaPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'viriya_cmi', send_from: 'ตรอ' },
			})
		},
		viriyaInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'viriya_vmi',
					send_from: 'ตรอ',
				},
			})
		},
		tipPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'tip_cmi', send_from: 'ตรอ' },
			})
		},
		mtiPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'mti_cmi', send_from: 'ตรอ' },
			})
		},
		mtiInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'mti_vmi',
					send_from: 'ตรอ',
				},
			})
		},
		jaymartPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'jmt_cmi', send_from: 'ตรอ' },
			})
		},
		thaisriPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'dj_tsri',
					api_action: 'CallAPI_dj_tsri_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		thaisriInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'tsi',
					api_action: 'CallAPI_tsi_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		thaisriPrbInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'tsi',
					api_action: 'CallAPI_tsi_CMI_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		dhipayaInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'tip_vmi', send_from: 'ตรอ' },
			})
		},
		thaiSetakijPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: { ...params, api_company_type: 'tsi_cmi', send_from: 'ตรอ' },
			})
		},
		thaiSetakijPrbCancel: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					policy_type: 'CMI',
					api_company_type: 'tsi_cancel',
				},
			})
		},
		kwiPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'kwi',
					// api_company_type: 'kwi_uat',
					api_action: 'CallAPI_kwi_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		kwiInsure: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'kwi',
					// api_company_type: 'kwi_uat',
					api_action: 'CallAPI_kwi_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		ddPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'dj',
					// api_company_type: 'dj_uat',
					api_action: 'CallAPI_dj_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		rvpPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'dj_rvp',
					// api_company_type: 'dj_rvp_uat',
					api_action: 'CallAPI_dj_rvp_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		fciPrb: (params) => {
			return service.post({
				url: `${apiPath}/get_policy_prb_ins`,
				body: {
					...params,
					api_company_type: 'dj_fci',
					// api_company_type: 'dj_fci_uat',
					api_action: 'CallAPI_dj_fci_CMI',
					send_from: 'ตรอ',
				},
			})
		},
	}
}
