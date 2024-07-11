import apiService from '../apiService'

const api_path = '/default'

export const defaultController = (configService) => {
	const service = apiService(configService)
	return {
		getTitle: () => {
			return service.get({
				url: `${api_path}/title`,
			})
		},
		getTypeInsurance: () => {
			return service.get({
				url: `${api_path}/detail_code`,
			})
		},
		getAutoScene: () => {
			return service.get({
				url: `${api_path}/auto_scene`,
			})
		},
		getDetailCodeScene: () => {
			return service.get({
				url: `${api_path}/detail_code`,
			})
		},
		getCarTypePrb: () => {
			return service.get({
				url: `${api_path}/car_type_prb`,
			})
		},
		getBank: () => {
			return service.get({
				url: `${api_path}/get-bank-pay`,
			})
		},
		getCountryThaisri: () => {
			return service.get({
				url: `${api_path}/get-country-thaisri`,
			})
		},
		getNationalThaisri: () => {
			return service.get({
				url: `${api_path}/get-national-thaisri`,
			})
		},
		getNationalKwi: () => {
			return service.get({
				url: `${api_path}/get-national-kwi`,
			})
		},
    getCountryDj: () => {
			return service.get({
				url: `${api_path}/get-country-dj`,
			})
		},
		getNationalityDj: () => {
			return service.get({
				url: `${api_path}/get-national-dj`,
			})
		},
	}
}
