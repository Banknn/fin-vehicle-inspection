import apiService from '../apiService'

const apiPath = '/news'

export const newsController = (configService) => {
	const service = apiService(configService)
	return {
		getBroadcastPopup: () => {
			return service.get({
				url: `${apiPath}/get_broadcast_popup`,
			})
		},
	}
}
