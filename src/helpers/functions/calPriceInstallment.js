import { convertStrToFormat } from '../../helpers'

export const getNumQrCode = ({ quoNum, installment, currCount }) => {
	return `${quoNum}${
		installment === '10' ? `10${currCount}` : `0${installment}${currCount}`
	}`
}

export const calInstallmentSpecial = ({
	amount,
	count_installment,
	condition_install,
	prb,
	priceprb,
	discount,
}) => {
	if (!condition_install) return []
	let { first_price, arr_price } = calAmount({
		am: +amount - discount,
		count_installment,
		condition_install,
		prb,
		priceprb,
	})

	const label = arr_price.length > 1 ? arr_price.join('+') : arr_price[0]
	const data_plan = [{ first_price, label: `${label} บาท` }]
	const insts = [first_price, ...label.split('+')]
	return { data_plan, insts }
}

const calAmount = ({
	am,
	count_installment,
	condition_install,
	prb,
	priceprb,
}) => {
	if (!condition_install) return { first_price: 0, arr_price: [] }
	const arr_type = condition_install.match(/.{1,2}/g)
	let insts = []
	let first_price = Math.ceil(Math.ceil(am) / count_installment)

	if (!+arr_type[0]) {
		if (prb === 'yes') {
			first_price = Math.ceil(first_price + priceprb)
			insts.push(`(${convertStrToFormat(`${first_price}`, 'number_Int')}*1)`)
			insts.push(
				`(${convertStrToFormat(
					`${Math.ceil(Math.ceil(am) / count_installment)}`,
					'number_Int'
				)}*${count_installment - 1})`
			)
		} else
			insts.push(
				`(${convertStrToFormat(
					`${first_price}`,
					'number_Int'
				)}*${count_installment})`
			)
	} else
		for (let i = 0; i < arr_type.length - 1; i++) {
			let amount = Math.ceil(am * (+arr_type[i] / 100))
			const last_index = i === +arr_type.length - 2
			const count = last_index ? count_installment - (arr_type.length - 2) : 1
			let final_price = last_index
				? Math.ceil(amount / count)
				: Math.ceil(amount + priceprb)
			if (i === 0) first_price = Math.ceil(amount + priceprb)
			insts.push(
				`(${convertStrToFormat(`${final_price}`, 'number_Int')}*${count})`
			)
		}
	return { first_price, arr_price: insts }
}

export const removeChar = (label) => {
  let arr = label.split('+').join(' ').split(' ')
	arr.pop()
	let arr_price = []
	arr.forEach((e) => {
    arr_price = [...arr_price, e.replace(/\(|\)/g, '')]
	})
	return arr_price
}
