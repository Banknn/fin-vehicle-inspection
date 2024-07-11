import apiService from '../apiService'

const apiPath = '/color'

export const colorController = (configService) => {
	const service = apiService(configService)
	return {
		getColorAxa: () => {
			return service.get({
				url: `${apiPath}/get_color_axa`,
			})
		},
		getColorThaisri: () => {
			return service.get({
				url: `${apiPath}/get_color_thaisri`,
			})
		},
		getColorRvp: () => {
			return service.get({
				url: `${apiPath}/get_color_rvp`,
			})
		},
		getColorFCI: () => {
			return service.get({
				url: `${apiPath}/get_color_fci`,
			})
		},
	}
}
