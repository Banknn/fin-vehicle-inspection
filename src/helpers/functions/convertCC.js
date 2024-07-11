export const convertCC = (n) => {
	const arr = n.toString().split('.')
	if ((arr.length > 1 || n.length === 1) && +arr[0] < 5) return n
	const cc = +n / 1000
	return cc.toString()
}
