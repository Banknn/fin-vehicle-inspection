import moment from 'moment'

export const generateInvoiceNo = (paybill) => {
	const year = moment(new Date()).format('YY')
	const splitNumber = paybill.split('-')
	const titleNumber = `VIV${year}`
	const latestNumber = splitNumber[1]
	const genNumber = (+latestNumber + 1).toString().padStart(5, '0')
	return `${titleNumber}-${genNumber}`
}
