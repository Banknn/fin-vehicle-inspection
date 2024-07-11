import moment from 'moment'

const calYearLeap = (protect, lastPro) => {
	const yearFt = moment(protect).format('YYYY')
	const yearLt = moment(lastPro).format('YYYY')
	for (let year = +yearFt; year <= +yearLt; year++) {
		if ((0 === year % 4 && 0 !== year % 100) || 0 === year % 400) {
			return year
		}
	}
}

const culSameDateNextYear = (dateFt, daterLt, company) => {
	return (
		['คุ้มภัยโตเกียวมารีนประกันภัย', 'วิริยะประกันภัย'].includes(company) &&
		dateFt.substring(5, 10) === daterLt.substring(5, 10)
	)
}

export const calProtectDate = (protectedDate, lastProtectedDate, company) => {
	const firstDate = moment(protectedDate, 'YYYY-MM-DD')
	const lastDate = moment(lastProtectedDate, 'YYYY-MM-DD')
	const dateFt = moment(protectedDate).format('YYYY-MM-DD')
	const daterLt = moment(lastProtectedDate).format('YYYY-MM-DD')

	let day = lastDate.diff(firstDate, 'days')
	let yearLeap = calYearLeap(protectedDate, lastProtectedDate)
	let checkDiff = false
	let nextYearDiff = culSameDateNextYear(dateFt, daterLt, company)

	if (yearLeap) {
		checkDiff = moment(`${yearLeap}-02-29`).isBetween(dateFt, daterLt)
		if (
			(![
				'ไทยศรีประกันภัย',
				'คุ้มภัยโตเกียวมารีนประกันภัย',
				'วิริยะประกันภัย',
			].includes(company) &&
				checkDiff) ||
			(nextYearDiff && checkDiff)
		)
			day = day - 1
	}
	if (
		company === 'คุ้มภัยโตเกียวมารีนประกันภัย' ||
		company === 'วิริยะประกันภัย'
	) {
		if (day > 365 || day < 365) {
			day = protectedDate && lastProtectedDate ? day + 1 : '0'
		}
	}
	day = protectedDate && lastProtectedDate ? day : '0'
	return { day, checkDiff }
}
