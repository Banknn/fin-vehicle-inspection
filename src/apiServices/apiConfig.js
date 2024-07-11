const SERVER = 'PROD'

const BASE = {
	DEV: {
		BASE_API: 'http://localhost:7007',
		BASE_MASTER_API: 'http://localhost:7007',
		BASE_PATH_API: '/api/v1/insurance',
	},
	PROD: {
		BASE_API: 'https://fininsurance.co.th:2023',
		BASE_MASTER_API: 'https://fininsurance.co.th:2023',
		BASE_PATH_API: '/api/v1/insurance',
	},
}

export const BASE_API = BASE[SERVER].BASE_API
export const BASE_MASTER_API = BASE[SERVER].BASE_MASTER_API
export const BASE_PATH_API = BASE[SERVER].BASE_PATH_API
