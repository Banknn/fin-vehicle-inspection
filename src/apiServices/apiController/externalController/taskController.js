import apiService from '../../apiService'
import { PATH } from './constants'

export const taskController = (configService) => {
	const service = apiService(configService)
	return {
		saveTask: (params) => {
			return service.post({
				url: PATH.TASK,
				body: { ...params },
			})
		},
		saveCancelTask: (params) => {
			return service.post({
				url: PATH.TASK_CANCEL,
				body: { ...params },
			})
		},
		getCountryAxa: () => {
			return service.post({
				url: PATH.CENTER,
				body: { api_company_type: 'dj', api_action: 'CallAPI_dj_country' },
			})
		},
		getNationalityAxa: () => {
			return service.post({
				url: PATH.CENTER,
				body: { api_company_type: 'dj', api_action: 'CallAPI_dj_nationality' },
			})
		},
	}
}

// quo_num
// paybill (จ่ายปกติ,จ่ายวางบิล)
// whosend (ฟินแจ้ง)
// checksend (งานใหม่,งานต่ออายุ,งานโอนโค้ด)
