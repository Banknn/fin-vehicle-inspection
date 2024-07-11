const isNumeric = (id) => {
	var RE = /^-?(0|INF|(0[1-7][0-7]*)|(0x[0-9a-fA-F]+)|((0|[1-9][0-9]*|(?=[.,]))([.,][0-9]+)?([eE]-?\d+)?))$/
	return RE.test(id)
}

const checkDigitIdCard = (id) => {
	let sum = 0
	for (let i = 0; i < 12; i++) {
		sum += parseFloat(id.charAt(i)) * (13 - i)
	}
	if ((11 - (sum % 11)) % 10 !== parseFloat(id.charAt(12))) return false
	return true
}

export const checkIdCard = (idCard) => {
	if (idCard) {
		if (!isNumeric(idCard)) return false
		if (idCard.substr(0, 1) === 0) return false
		if (idCard.trim().length === 13) {
			let id = idCard.replace(/-/g, '')
			let result = checkDigitIdCard(id)
			if (result) {
				return true
			} else {
				return false
			}
		}
	}
}
