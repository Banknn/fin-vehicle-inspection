export const calCompulsoryTaxDay = (prb, { day, checkDiff }, company, call) => {
	let net = 0
	let duty = 0
	let vat = 0
	let sum = 0

	if (company === 'ไทยศรีประกันภัย') {
		const dPerYCul = checkDiff ? 366 : 365
		let porata = (day / dPerYCul) * 100
		porata = porata.toFixed(4)
		net = Math.ceil((prb / 100) * +porata)
		duty = Math.ceil(net / 250)
		vat = (net + duty).toFixed(2) * 0.07
	} else if (company === 'วิริยะประกันภัย') {
		let porata = (prb / 365) * day
		net = Math.round(Math.round(+porata.toFixed(4) * 1000) / 10) / 100
		duty = Math.ceil(net / 250)
		vat = Math.round(+((net + duty) * 0.07).toFixed(3) * 100) / 100
	} else if (['เคดับบลิวไอประกันภัย', 'ฟอลคอนประกันภัย'].includes(company)) {
		net = Math.round((prb / 365) * day)
		duty = Math.round(Math.ceil(net / 250))
		vat = +((net + duty) * 0.07).toFixed(2)
	} else {
		net = (prb / 365) * day
		duty = Math.ceil(net / 250)
		vat = (net + duty).toFixed(2) * 0.07
	}

	sum = net + vat + duty

	if (call === 'all') {
		return { net, vat, duty, price: sum }
	} else {
		return sum ? sum.toFixed(2) : 0
	}
}
