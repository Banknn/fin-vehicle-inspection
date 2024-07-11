import apiService from '../apiService'

const apiPath = '/installment'

export const installmentController = (configService) => {
	const service = apiService(configService)
	return {
		getFollowInstall: () => {
			return service.get({
				url: `${apiPath}/get_follow_install`,
			})
		},
	}
}
