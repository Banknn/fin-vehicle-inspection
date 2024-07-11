import { LIST } from '../../helpers'

export const getYearPrb = (companyCompulsory, brand) => {
	switch (companyCompulsory) {
		case 'ชับบ์สามัคคีประกันภัย':
			return LIST.CAR_YEAR_CHUBB(brand)
		default:
			return LIST.CAR_YEAR(brand)
	}
}

export const getSeriesPrb = (companyCompulsory, brand, year) => {
	switch (companyCompulsory) {
		case 'แอกซ่าประกันภัย':
			return LIST.CAR_SERIES_DD(brand)
		case 'เจมาร์ทประกันภัย (เจพี)':
			return LIST.CAR_SERIES_Jaymart(brand)
		case 'ไทยศรีประกันภัย':
			return LIST.CAR_SERIES_THAISRI(brand)
		case 'อินทรประกันภัย(สาขาสีลม)':
			return LIST.CAR_SERIES_INTRA_V2(brand)
		case 'ทิพยประกันภัย':
			return LIST.CAR_SERIES_DHIPAYA(brand)
		case 'ไทยเศรษฐกิจประกันภัย':
			return LIST.CAR_SERIES_THAISETAKIJ(brand)
		case 'เคดับบลิวไอประกันภัย':
			return LIST.CAR_SERIES_KWI(brand)
		case 'ชับบ์สามัคคีประกันภัย':
			return LIST.CAR_SERIES_CHUBB(brand, year)
		case 'บริษัทกลาง':
			return LIST.CAR_SERIES_RVP(brand)
		case 'ฟอลคอนประกันภัย':
			return LIST.CAR_SERIES_FCI(brand)
		default:
			return LIST.CAR_SERIES(brand, year)
	}
}

export const getSubSeriesPrb = (companyCompulsory, brand, year, series) => {
	switch (companyCompulsory) {
		case 'แอกซ่าประกันภัย':
			return LIST.CAR_SUB_SERIES_DD(brand, series)
		// case 'ไทยศรีประกันภัย':
		// 	return LIST.CAR_SUB_SERIES_THAISRI(brand, series, year)
		case 'ทิพยประกันภัย':
			return LIST.CAR_SUB_SERIES_DHIPAYA(series)
		default:
			return LIST.CAR_SUB_SERIES(brand, year, series)
	}
}
