export const checkFormatDate = (str) => {
	if (str < 10) return '0' + str
	return str
}

export const formatDate = (date) => {
	let day = date.getDate()
	day = checkFormatDate(day)

	let month = date.getMonth()
	month = checkFormatDate(month)

	let year = date.getFullYear()

	if (!day || !month || !year) throw new Error('Wrong Date Format')

	return year + month + day
}

export const formatTime = (date) => {
	let hours = date.getHours()
	hours = checkFormatDate(hours)

	let minutes = date.getMinutes()
	minutes = checkFormatDate(minutes)

	let seconds = date.getSeconds()
	seconds = checkFormatDate(seconds)

	if (!hours || !minutes || !seconds) throw new Error('Wrong Date Time')

	return hours + ':' + minutes + ':' + seconds
}
