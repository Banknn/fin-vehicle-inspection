import { store } from '../../stores'
import { filesSuccessAction } from '../../actions'

export const setFilesSuccess = async (companyCompulsory, companyInsurance) => {
	let type = ''
	if (companyCompulsory && companyInsurance) {
		type = 'prb&ins'
	} else if (companyInsurance) {
		type = 'ins'
	} else if (companyCompulsory) {
		type = 'prb'
	}
	await store.dispatch(
		filesSuccessAction({ files_prb: false, files_ins: false, type })
	)
}

export const setFiles = async (type, dataFiles) => {
	let data = dataFiles
	if (type === 'prb') {
		data.files_prb = true
	} else if (type === 'ins') {
		data.files_ins = true
	}
	await store.dispatch(filesSuccessAction(data))
}

export const checkRemoveOnSuccess = async (res) => {
	let reult = false
	if (
		(res.type === 'prb' && res.files_prb) ||
		(res.type === 'ins' && res.files_ins) ||
		(res.type === 'prb&ins' && res.files_prb && res.files_ins)
	) {
		reult = true
	}
	return reult
}
