import moment from 'moment'
import numeral from 'numeral'

export const convertStrToFormat = (str, format) => {
	if (!str) {
		return ''
	}

	switch (format) {
		case 'birthday':
			const [dd, mm, yy] = moment(str).format('DD/MM/YYYY').split('/')
			str = `${+yy - 543}-${mm}-${dd}`
			break
		case 'phone_number':
			str = str.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
			break
		case 'id_card':
			str = str.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5')
			break
		case 'passport':
			str = str.replace(/([a-zA-Z]{2})(\d{7})/, '$1-$2')
			break
		case 'credit':
			str = str.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4')
			break
		case 'money':
			str = numeral(str).format('0,0[.]00')
			break
		case 'money_digit':
			str = numeral(str).format('0,0.00')
			break
		case 'yes_no':
			str = str === 'yes' ? 'มี' : 'ไม่มี'
			break
		case 'pay_method':
			str = str === 'success' ? 'จ่ายหักค่าคอม' : 'จ่ายยอดเต็ม'
			break
		case 'date':
			const [d, m, y] = moment(str).format('DD-MM-YYYY').split('-')
			str = `${d}-${m}-${+y + 543}`
			break
		case 'idcar':
			str = str.replace(/-/g, '')
			let newString = str
			let index = 0
			const regexp2 = /[A-Za-zก-ฮ]/gi
			const result2 = regexp2.exec(str)
			if (result2 !== null) {
				if (result2.index !== 0) {
					for (let a = 0; a < result2.index; a++) {
						newString =
							newString.substring(0, a) + '-' + newString.substring(a + 1)
					}
				}

				const regexp = /[0-9]/gi
				const result = regexp.exec(newString)
				if (result !== null) {
					index = result.index
					str = str.substr(0, index) + '-' + str.substr(index)
				}
			}
			break
		case 'datetime':
			str = moment(str).add(543, 'y').format('DD-MM-YYYY HH:mm:ss')
			break
		case 'number_Int':
			str = numeral(str).format('0,0')
			break
		default:
			break
	}
	return str
}
