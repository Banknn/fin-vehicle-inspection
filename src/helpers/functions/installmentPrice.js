import moment from 'moment'
import { convertStrToFormat } from './convertStrToFormat'

export const installmentPrice = (month, price, carCode, protectedDate) => {
	const current = moment(new Date()).format('YYYY-MM-DD')
	const pd = moment(protectedDate, 'YYYY-MM-DD')
	const days = pd.diff(current, 'days')
	if (month !== 'full') {
		if (carCode !== '730') {
			if (month === '3') {
				const firstMonth = price / month
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(firstMonth, 'money_digit')} * 3)`,
				}
			}
			if (month === '6' && days <= 29) {
				const firstMonth = price * 0.2
				const monthOther = (price - firstMonth) / 5
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 5)`,
				}
			}
			if (month === '6' && (days >= 30 || days <= 59)) {
				const firstMonth = price * 0.2
				const secondMonth = firstMonth * 0.2
				const monthOther = (price - firstMonth - secondMonth) / 4
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(
						secondMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 4)`,
				}
			}
			if (month === '6' && days >= 60) {
				const firstMonth = price * 0.15
				const secondMonth = firstMonth * 0.15
				const monthOther = (price - firstMonth - secondMonth) / 4
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(
						secondMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 4)`,
				}
			}
			if (month === '8') {
				const firstMonth = price * 0.2
				const monthOther = (price - firstMonth) / 7
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 7)`,
				}
			}
			if (month === '10' && days <= 29) {
				const firstMonth = price * 0.3
				const secondMonth = (price - firstMonth) * 0.15
				const monthOther = (price - firstMonth - secondMonth) / 8
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(
						secondMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 8)`,
				}
			}
			if (month === '10' && (days >= 30 || days <= 59)) {
				const firstMonth = price * 0.2
				const secondMonth = (price - firstMonth) * 0.2
				const monthOther = (price - firstMonth - secondMonth) / 8
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(
						secondMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 8)`,
				}
			}
			if (month === '10' && days >= 60) {
				const firstMonth = price * 0.15
				const secondMonth = (price - firstMonth) * 0.15
				const monthOther = (price - firstMonth - secondMonth) / 8
				return {
					firstMonth,
					otherMonth: `(${convertStrToFormat(
						firstMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(
						secondMonth,
						'money_digit'
					)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 8)`,
				}
			}
		} else {
			if (month === '3') {
				let firstMonth = price / 3
				if (firstMonth < 6000) {
					firstMonth = 6000
					const monthOther = (price - 6000) / 2
					return {
						firstMonth,
						otherMonth: `(${convertStrToFormat(
							firstMonth,
							'money_digit'
						)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 2)`,
					}
				}
				if (firstMonth >= 6000) {
					return {
						firstMonth,
						otherMonth: `(${convertStrToFormat(
							firstMonth,
							'money_digit'
						)} * 3)`,
					}
				}
			}
			if (month === '6') {
				let firstMonth = price / 6
				if (firstMonth < 6000) {
					firstMonth = 6000
					const secondMonth = 3500
					const monthOther = (price - firstMonth - secondMonth) / 4
					return {
						firstMonth,
						otherMonth: `(${convertStrToFormat(
							firstMonth,
							'money_digit'
						)} * 1) + (${convertStrToFormat(
							secondMonth,
							'money_digit'
						)} * 1) + (${convertStrToFormat(monthOther, 'money_digit')} * 4)`,
					}
				}
				if (firstMonth >= 600) {
					return {
						firstMonth,
						otherMonth: `(${convertStrToFormat(
							firstMonth,
							'money_digit'
						)} * 6)`,
					}
				}
			}
		}
	}
	return {
		firstMonth: price,
	}
}
