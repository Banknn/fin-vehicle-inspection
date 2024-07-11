export const numberWithCommas = (n) => {
	return n === null ? n : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
