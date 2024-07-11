import _ from 'lodash'

export const filterAddress = (name, value, address, addressInput) => {
	if (name === 'province') {
		const amphoeFilter = address.addressList.filter((e) => e.province === value)
		const amphoeList = amphoeFilter.map((e) => {
			return {
				key: e.amphoe,
				value: e.amphoe,
				text: e.amphoe,
			}
		})
		const amphoeInsure = _.uniqBy(amphoeList, 'key')
		return amphoeInsure
	}
	if (name === 'amphoe') {
		const districtFilter = address.addressList.filter((e) => e.amphoe === value)
		const districtList = districtFilter.map((e) => {
			return {
				key: e.district,
				value: e.district,
				text: e.district,
			}
		})
		const districtInsure = _.uniqBy(districtList, 'key')
		return districtInsure
	}
	if (name === 'district') {
		const zipcodeFilter = address.addressList.filter(
			(e) =>
				(e.amphoe === addressInput.amphoeInsurance ||
					e.amphoe === addressInput.amphoeDelivery ||
					e.amphoe === addressInput.city) &&
				e.district === value
		)
		const zipcodeList = zipcodeFilter.map((e) => {
			return {
				key: e.zipcode,
				value: e.zipcode,
				text: e.zipcode,
			}
		})
		const zipcodeInsure = _.uniqBy(zipcodeList, 'key')
		return zipcodeInsure
	}
	return
}
