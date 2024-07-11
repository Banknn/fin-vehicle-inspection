import apiService from '../../apiService'
import { PATH } from './constants'

export const externalController = (configService) => {
	const service = apiService(configService)
	return {
		intraPrb: (params) => {
			return service.post({
				url: PATH.PRB.INTRA,
				body: { ...params },
			})
		},
		intraPrbV2: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'intra_v2_cmi', send_from: 'ตรอ' },
			})
		},
		intraInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'intra_vmi', send_from: 'ตรอ' },
			})
		},
		intraPrbCancel: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					policy_type: 'CMI',
					api_company_type: 'intra_v2_cancel',
				},
			})
		},
		chubbInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'chubb_vmiv2', send_from: 'ตรอ' },
			})
		},
		chubbPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'chubb_cmiv2', send_from: 'ตรอ' },
			})
		},
		axaPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
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
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'axa',
					api_action: 'CallAPI_axa_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		axaCancel: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'axa',
					api_action: 'CallAPI_axa_Cancel_CMI',
				},
			})
		},
		axaCancelInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'axa',
					api_action: 'CallAPI_axa_Cancel_VMI',
				},
			})
		},
		axaCanceldd: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'dj',
					api_action: 'CallAPI_dj_Cancel_CMI',
				},
			})
		},
		kumpaiPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'kumpai_cmi', send_from: 'ตรอ' },
			})
		},
		kumpaiInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'kumpai_vmi', send_from: 'ตรอ' },
			})
		},
		viriyaPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'viriya_cmi', send_from: 'ตรอ' },
			})
		},
		viriyaInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'viriya_vmi',
					send_from: 'ตรอ',
				},
			})
		},
		tipPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'tip_cmi', send_from: 'ตรอ' },
			})
		},
		mtiPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'mti_cmi', send_from: 'ตรอ' },
			})
		},
		mtiInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'mti_vmi_uat',
					api_action: 'CallAPI_kwi_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		mtiCancel: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'mti',
					api_action: 'CallAPI_MT_Cancel_CMI',
				},
			})
		},
		mtiCancelInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'mti',
					api_action: 'CallAPI_MT_Cancel_VMI',
				},
			})
		},
		jaymartPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'jmt_cmi', send_from: 'ตรอ' },
			})
		},
		thaisriPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
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
				url: PATH.CENTER,
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
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'tsi',
					api_action: 'CallAPI_tsi_CMI_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		thaisriCancelPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'dj_tsri',
					api_action: 'CallAPI_dj_tsri_Cancel_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		thaisriCancelInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'tsi',
					api_action: 'CallAPI_tsi_Cancel_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		dhipayaInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'tip_vmi', send_from: 'ตรอ' },
			})
		},
		thaiSetakijPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: { ...params, api_company_type: 'tsi_cmi', send_from: 'ตรอ' },
			})
		},
		thaiSetakijPrbCancel: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					policy_type: 'CMI',
					api_company_type: 'tsi_cancel',
				},
			})
		},
		kwiPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'kwi',
					// api_company_type: 'kwi_uat',
					api_action: 'CallAPI_kwi_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		kwiCancel: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'kwi',
					api_action: 'CallAPI_kwi_Cancel_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		kwiInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					// api_company_type: 'kwi',
					api_company_type: 'kwi_uat',
					api_action: 'CallAPI_kwi_VMI',
					send_from: 'ตรอ',
				},
			})
		},
		kwiCancelInsure: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'kwi',
					api_action: 'CallAPI_kwi_Cancel_VMI',
				},
			})
		},
		ddPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
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
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'dj_rvp',
					// api_company_type: 'dj_rvp_uat',
					api_action: 'CallAPI_dj_rvp_CMI',
					send_from: 'ตรอ',
				},
			})
		},
		fciCancelPrb: (params) => {
			return service.post({
				url: PATH.CENTER,
				body: {
					...params,
					api_company_type: 'dj_fci',
          // api_company_type: dj_fci_uat',
					api_action: 'CallAPI_dj_fci_Cancel_CMI',
					send_from: 'ตรอ',
				},
			})
		},
	}
}
