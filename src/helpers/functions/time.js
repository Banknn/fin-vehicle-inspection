import moment from 'moment'

const checkTime = (i) => {
	if (i < 10) {
		i = '0' + i
	} 
	return i
}

export const time = () => {
	const today = new Date()
	let h = today.getHours()
	let m = today.getMinutes()
	let s = today.getSeconds()
	m = checkTime(m)
	s = checkTime(s)
	setTimeout(time, 1000)
	return {
		clock: `${h}:${m}:${s}`,
		today: moment(today).format('YYYY-MM-DD'),
		date: moment(today).format('DD'),
		month: moment(today).format('MM'),
		year: moment(today).format('YYYY'),
		current: moment(today).format('YYYY-MM-DD HH:mm:ss'),
	}
}
