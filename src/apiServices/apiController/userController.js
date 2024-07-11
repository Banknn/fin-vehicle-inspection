import apiService from '../apiService'

const apiPath = '/auth'

export const userController = (configService) => {
	const service = apiService(configService)
	return {
		getProfile: () => {
			return service.get({
				url: `${apiPath}/profile`,
			})
		},
		login: (body) => {
			return service.post({
				url: `${apiPath}/login-cuscode`,
				body: body,
			})
		},
		getCredit: () => {
			return service.get({
				url: `${apiPath}/get-user-credit`,
			})
		},
		updateCredit: (params) => {
			return service.post({
				url: `${apiPath}/update-user-credit`,
				body: params,
			})
		},
		getVifActive: () => {
			return service.get({
				url: `${apiPath}/get-vif-active`,
			})
		},
		checkPaidVif: (params) => {
			return service.post({
				url: `${apiPath}/update-is-payment-vif`,
				body: { ...params },
			})
		},
    logout: (body) => {
			return service.post({
				url: `${apiPath}/logout-vif`,
				body,
			})
		},
    checkShaCode: (sha_code) => {
			return service.get({
				url: `${apiPath}/check_sha_code?sha_code=${sha_code}`,
			})
		},
    checkPremissionteam: (sha_code) => {
			return service.get({
				url: `${apiPath}/check_premissionteam?sha_code=${sha_code}`,
			})
		},
	}
}
