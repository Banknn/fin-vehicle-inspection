import moment from 'moment'

export const passengerCarTaxCalculate = ({ ...props }) => {
	const { engineCC, legal, registrationDate, carType, compulsoryType } = props
	let tax
	const isLegal = legal === 'yes' ? true : false
	const isElectric = false
	const firstRate = isLegal ? 0.5 * 2 : isElectric ? 0.5 / 2 : 0.5
	const secondRate = isLegal ? 1.5 * 2 : isElectric ? 1.5 / 2 : 1.5
	const thirdRate = isLegal ? 4 * 2 : isElectric ? 4 / 2 : 4
	if (carType === 'รย.1') {
		if (engineCC > 1800) {
			tax =
				600 * firstRate +
				(1800 - 600) * secondRate +
				(engineCC - 1800) * thirdRate
		} else if (engineCC > 600 && engineCC <= 1800) {
			tax = 600 * firstRate + (engineCC - 600) * secondRate
		} else if (engineCC <= 600) {
			tax = engineCC * firstRate
		}
		const yearNow = moment().format('YYYY')
		const regDate = moment(registrationDate).format('YYYY')
		const lifeTime = parseInt(yearNow) - parseInt(regDate)
		let discount = 0
		if (lifeTime < 6) {
			return tax
		}
		if (lifeTime === 6) {
			discount = tax * 0.1
		}
		if (lifeTime === 7) {
			discount = tax * 0.2
		}
		if (lifeTime === 8) {
			discount = tax * 0.3
		}
		if (lifeTime === 9) {
			discount = tax * 0.4
		}
		if (lifeTime === 10) {
			discount = tax * 0.5
		}
		return tax - discount
	}
	if (carType === 'รย.12' || carType === 'รย.16' || carType === 'รย.17') {
		return compulsoryType === '1.30E' ||
			compulsoryType === '2.30E' ||
			compulsoryType === '3.30E'
			? 100 / 2
			: 100
	}
	if (carType === 'รย.15') {
		return isElectric ? 50 / 2 : 50
	}
	if (carType === 'รย.14') {
		return 200
	}
	return 0
}

export const pickupCarTaxCalculate = ({ ...props }) => {
	const { carWeight, carType, compulsoryType } = props
	const isElectric = false
	if (carWeight <= 500) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 150
		if (carType === 'รย.5') return isElectric ? 450 / 2 : 450
		if (carType === 'รย.6') return isElectric ? 185 / 2 : 185
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 300 / 2 : 300
		if (carType === 12) return 300
		if (carType === 13) return 450
		if (carType === 14) return 300
	}
	if (carWeight > 500 && carWeight <= 750) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 300
		if (carType === 'รย.5') return isElectric ? 750 / 2 : 750
		if (carType === 'รย.6') return isElectric ? 310 / 2 : 310
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 450 / 2 : 450
		if (carType === 12) return 400
		if (carType === 13) return 600
		if (carType === 14) return 400
	}
	if (carWeight > 750 && carWeight <= 1000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 450
		if (carType === 'รย.5') return isElectric ? 1050 / 2 : 1050
		if (carType === 'รย.6') return isElectric ? 450 / 2 : 450
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 600 / 2 : 600
		if (carType === 12) return 500
		if (carType === 13) return 750
		if (carType === 14) return 500
	}
	if (carWeight > 1000 && carWeight <= 1250) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 800
		if (carType === 'รย.5') return isElectric ? 1350 / 2 : 1350
		if (carType === 'รย.6') return isElectric ? 560 / 2 : 560
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 750 / 2 : 750
		if (carType === 12) return 600
		if (carType === 13) return 900
		if (carType === 14) return 600
	}
	if (carWeight > 1250 && carWeight <= 1500) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 1000
		if (carType === 'รย.5') return isElectric ? 1650 / 2 : 1650
		if (carType === 'รย.6') return isElectric ? 685 / 2 : 685
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 900 / 2 : 900
		if (carType === 12) return 700
		if (carType === 13) return 1050
		if (carType === 14) return 700
	}
	if (carWeight > 1500 && carWeight <= 1750) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 1300
		if (carType === 'รย.5') return isElectric ? 2100 / 2 : 2100
		if (carType === 'รย.6') return isElectric ? 875 / 2 : 875
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 1050 / 2 : 1050
		if (carType === 12) return 900
		if (carType === 13) return 1350
		if (carType === 14) return 900
	}
	if (carWeight > 1750 && carWeight <= 2000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 1600
		if (carType === 'รย.5') return isElectric ? 2550 / 2 : 2550
		if (carType === 'รย.6') return isElectric ? 1060 / 2 : 1060
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 1350 / 2 : 1350
		if (carType === 12) return 1100
		if (carType === 13) return 1650
		if (carType === 14) return 1100
	}
	if (carWeight > 2000 && carWeight <= 2500) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 1900
		if (carType === 'รย.5') return isElectric ? 3000 / 2 : 3000
		if (carType === 'รย.6') return isElectric ? 1250 / 2 : 1250
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 1650 / 2 : 1650
		if (carType === 12) return 1300
		if (carType === 13) return 1950
		if (carType === 14) return 1300
	}
	if (carWeight > 2500 && carWeight <= 3000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 2200
		if (carType === 'รย.5') return isElectric ? 3450 / 2 : 3450
		if (carType === 'รย.6') return isElectric ? 1435 / 2 : 1435
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 1950 / 2 : 1950
		if (carType === 12) return 1500
		if (carType === 13) return 2250
		if (carType === 14) return 1500
	}
	if (carWeight > 3000 && carWeight <= 3500) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 2400
		if (carType === 'รย.5') return isElectric ? 3900 / 2 : 3900
		if (carType === 'รย.6') return isElectric ? 1625 / 2 : 1625
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 2250 / 2 : 2250
		if (carType === 12) return 1700
		if (carType === 13) return 2540
	}
	if (carWeight > 3500 && carWeight <= 4000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 2600
		if (carType === 'รย.5') return isElectric ? 4350 / 2 : 4350
		if (carType === 'รย.6') return isElectric ? 1810 / 2 : 1810
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 2550 / 2 : 2550
		if (carType === 12) return 1900
		if (carType === 13) return 2850
	}
	if (carWeight > 4000 && carWeight <= 4500) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 2800
		if (carType === 'รย.5') return isElectric ? 4800 / 2 : 4800
		if (carType === 'รย.6') return isElectric ? 2000 / 2 : 2000
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 2850 / 2 : 2850
		if (carType === 12) return 2100
		if (carType === 13) return 3150
	}
	if (carWeight > 4500 && carWeight <= 5000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 3000
		if (carType === 'รย.5') return isElectric ? 5250 / 2 : 5250
		if (carType === 'รย.6') return isElectric ? 2185 / 2 : 2185
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 3150 / 2 : 3150
		if (carType === 12) return 2300
		if (carType === 13) return 3450
	}
	if (carWeight > 5000 && carWeight <= 6000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 3200
		if (carType === 'รย.5') return isElectric ? 5700 / 2 : 5700
		if (carType === 'รย.6') return isElectric ? 2375 / 2 : 2375
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 3450 / 2 : 3450
		if (carType === 12) return 2500
		if (carType === 13) return 3750
	}
	if (carWeight > 6000 && carWeight <= 7000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 3400
		if (carType === 'รย.5') return isElectric ? 6150 / 2 : 6150
		if (carType === 'รย.6') return isElectric ? 2560 / 2 : 2560
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 3750 / 2 : 3750
		if (carType === 12) return 2700
		if (carType === 13) return 4050
	}
	if (carWeight > 7000) {
		if (
			carType === 'รย.2' ||
			(carType === 'รย.1' && compulsoryType === '1.10E')
		)
			return 3600
		if (carType === 'รย.5') return isElectric ? 660 / 2 : 660
		if (carType === 'รย.6') return isElectric ? 2750 / 2 : 2750
		if (carType === 'รย.3' || carType === 'รย.13')
			return isElectric ? 4050 / 2 : 4050
		if (carType === 12) return 2900
		if (carType === 13) return 4350
	}
	return 0
}

const sameCarType = (ccCar, weightCar, carType, yearRegister) => {
	let sum

	switch (carType) {
		case 'รย.1':
			sum = type1(ccCar, yearRegister)
			return sum
		case 'รย.2':
			sum = type2(weightCar)
			return sum
		case 'รย.3':
			sum = type3(weightCar)
			return sum
		default:
			return
	}
}

// รย.1
const type1 = async (ccCar, yearRegister) => {
	const cc = +ccCar * 1000
	let result

	if (cc > 1800) {
		result = (cc - 1800) * 4 + (1200 * 1.5 + 600 * 0.5) //2100
	} else if (cc > 600 && cc <= 1800) {
		result = (cc - 600) * 1.5 + 600 * 0.5 //300
	} else if (cc <= 600) {
		result = cc * 0.5
	}
	result = await calCarYearType1(result, yearRegister)
	return +result?.toFixed(2) || 0
}

const calCarYearType1 = (sum, yearRegister) => {
	const diffYear = 2022 - +yearRegister
	if (diffYear === 6) {
		return sum * 0.9
	} else if (diffYear === 7) {
		return sum * 0.8
	} else if (diffYear === 8) {
		return sum * 0.7
	} else if (diffYear === 9) {
		return sum * 0.6
	} else if (diffYear >= 10) {
		return sum * 0.5
	} else {
		return sum
	}
}
// รย.1

// รย.2
const type2 = async (weightCar) => {
	let result

	if (+weightCar > 1750) {
		result = 1600
	} else {
		result = 1300
	}
	return +result?.toFixed(2)
}
// รย.2

// รย.3
const type3 = async (weightCar) => {
	let result

	if (weightCar > 500 && weightCar <= 750) {
		result = 450
	} else if (weightCar > 750 && weightCar <= 1000) {
		result = 600
	} else if (weightCar > 1000 && weightCar <= 1250) {
		result = 750
	} else if (weightCar > 1250 && weightCar <= 1500) {
		result = 900
	} else if (weightCar > 1500 && weightCar <= 1750) {
		result = 1050
	} else if (weightCar > 1750 && weightCar <= 2000) {
		result = 1350
	} else if (weightCar > 2000 && weightCar <= 2500) {
		result = 1650
	}
	return +result?.toFixed(2) || 0
}

export const carTaxCalate = async ({ ...props }) => {
	const { ccCar, carWeight, carType, registerYear } = props

	const carTax = await sameCarType(ccCar, carWeight, carType, registerYear)
	return carTax
}

export const vehicleInspectionCal = ({ ...props }) => {
	const {
		vehicleType,
		// ccCar, carType
	} = props
	if (vehicleType) {
		switch (vehicleType) {
			case 'carThan2000':
				return 200
			case 'carOver2000':
				return 300
			case 'motorcycle':
				return 60
			default:
				break
		}
	} else {
		return null
		// if (carType === 'รย.12') {
		// 	return 60
		// } else if (+ccCar <= 2000 && !!+ccCar) {
		// 	return 200
		// } else if (+ccCar > 2000) {
		// 	return 300
		// }
	}
}
