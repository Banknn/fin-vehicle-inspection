import apiService from '../apiService'

const apiPath = '/car'

export const carController = (configService) => {
	const service = apiService(configService)
	return {
		getAllBrands: () => {
			return service.get({
				url: `${apiPath}/get_brands_all`,
			})
		},
		getYearsByBrandID: (id_brand) => {
			return service.get({
				url: `${apiPath}/get_year_by_id_brand?id_brand=${id_brand}`,
			})
		},
		getSeriesByYearID: (id_year) => {
			return service.get({
				url: `${apiPath}/get_series_by_id_year?id_year=${id_year}`,
			})
		},
		getSubseriesBySeriesID: (id_series) => {
			return service.get({
				url: `${apiPath}/get_subseries_by_id_subseries?id_series=${id_series}`,
			})
		},
		findDetailCar: (params) => {
			return service.post({
				url: `${apiPath}/find_detail_car`,
				body: params,
			})
		},
		getCarType: () => {
			return service.get({
				url: `${apiPath}/get_car_type`,
			})
		},
		getAllIdCarByQuoNum: (quo_num) => {
			return service.get({
				url: `${apiPath}/get_all_id_car_by_quo_num?quo_num=${quo_num}`,
			})
		},
		getYearsByName: (brand) => {
			return service.get({
				url: `${apiPath}/get_year_by_name?brand=${brand}`,
			})
		},
		getSeriesByName: (brand, year) => {
			return service.get({
				url: `${apiPath}/get_series_by_name?brand=${brand}&year=${year}`,
			})
		},
		getSubseriesByName: (brand, year, series) => {
			return service.get({
				url: `${apiPath}/get_subseries_by_name?brand=${brand}&year=${year}&series=${series}`,
			})
		},
		getBrandAxaCmi: () => {
			return service.get({
				url: `${apiPath}/get_brand_axa_cmi`,
			})
		},
		getSeriesAxaCmi: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_axa_cmi?brand=${brand}`,
			})
		},
		getSubseriesAxaCmi: (brand, series) => {
			return service.get({
				url: `${apiPath}/get_subseries_axa_cmi?brand=${brand}&series=${series}`,
			})
		},
		getBrandAxaIns: () => {
			return service.get({
				url: `${apiPath}/get_brand_axa_ins`,
			})
		},
		getYearAxaIns: (brand) => {
			return service.get({
				url: `${apiPath}/get_year_axa_ins?brand=${brand}`,
			})
		},
		getSeriesAxaIns: (brand, year) => {
			return service.get({
				url: `${apiPath}/get_series_axa_ins?brand=${brand}&year=${year}`,
			})
		},
		getSubseriesAxaIns: (brand, year, series) => {
			return service.get({
				url: `${apiPath}/get_subseries_axa_ins?brand=${brand}&year=${year}&series=${series}`,
			})
		},
		getBrandIntra: () => {
			return service.get({
				url: `${apiPath}/get_brand_intra`,
			})
		},
		getSeriesIntraByName: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_intra_by_name?brand=${brand}`,
			})
		},
		getBrandIntraV2: () => {
			return service.get({
				url: `${apiPath}/get_brand_intra_v2`,
			})
		},
		getSeriesIntraByNameV2: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_intra_by_name_v2?brand=${brand}`,
			})
		},
		getBrandJaymart: () => {
			return service.get({
				url: `${apiPath}/get_brand_jaymart`,
			})
		},
		getSeriesJaymartByName: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_jaymart_by_name?brand=${brand}`,
			})
		},
		getBrandThaisriIns: () => {
			return service.get({
				url: `${apiPath}/get_brand_thaisri_ins`,
			})
		},
		getYearThaisriIns: (brand) => {
			return service.get({
				url: `${apiPath}/get_year_thaisri_ins?brand=${brand}`,
			})
		},
		getSeriesThaisriByNameIns: (brand, year) => {
			return service.get({
				url: `${apiPath}/get_series_thaisri_by_name_ins?brand=${brand}&year=${year}`,
			})
		},
		getSubSeriesThaisriByNameIns: (brand, series, year) => {
			return service.get({
				url: `${apiPath}/get_subseries_thaisri_by_name_ins?brand=${brand}&series=${series}&year=${year}`,
			})
		},
		getBrandThaisri: () => {
			return service.get({
				url: `${apiPath}/get_brand_thaisri`,
			})
		},
		getSeriesThaisriByName: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_thaisri_by_name?brand=${brand}`,
			})
		},
		getBrandDhipaya: () => {
			return service.get({
				url: `${apiPath}/get_brand_dhipaya`,
			})
		},
		getSeriesDhipayaByName: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_dhipaya?brand=${brand}`,
			})
		},
		getSubSeriesDhipayaByName: (series) => {
			return service.get({
				url: `${apiPath}/get_subseries_dhipaya?series=${series}`,
			})
		},
		getBrandThaiSetakij: () => {
			return service.get({
				url: `${apiPath}/get_brand_thai_setakij`,
			})
		},
		getSeriesThaiSetakij: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_thai_setakij?brand=${brand}`,
			})
		},
		getBrandKwi: () => {
			return service.get({
				url: `${apiPath}/get_brand_kwi`,
			})
		},
		getSeriesKwi: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_kwi?brand=${brand}`,
			})
		},
		getBrandComdd: () => {
			return service.get({
				url: `${apiPath}/get_brand_dd`,
			})
		},
		getSeriesComdd: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_dd?brand=${brand}`,
			})
		},
		getSubseriesComdd: (brand, series) => {
			return service.get({
				url: `${apiPath}/get_sub_series_dd?brand=${brand}&series=${series}`,
			})
		},
		getBrandChubb: () => {
			return service.get({
				url: `${apiPath}/get_brand_chubb`,
			})
		},
		getYearsChubb: (brand) => {
			return service.get({
				url: `${apiPath}/get_year_chubb?brand=${brand}`,
			})
		},
		getSeriesChubb: (brand, year) => {
			return service.get({
				url: `${apiPath}/get_series_chubb?brand=${brand}&year=${year}`,
			})
		},
		getBrandRVP: () => {
			return service.get({
				url: `${apiPath}/get_brand_rvp`,
			})
		},
		getBrandViriyaIns: () => {
			return service.get({
				url: `${apiPath}/get_brand_viriya`,
			})
		},
		getYearViriyaIns: (brand) => {
			return service.get({
				url: `${apiPath}/get_year_viriya?brand=${brand}`,
			})
		},
		getSeriesViriyaIns: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_viriya?brand=${brand}`,
			})
		},
		getSubseriesViriyaIns: (brand, series) => {
			return service.get({
				url: `${apiPath}/get_sub_series_viriya?brand=${brand}&series=${series}`,
			})
		},
    getBrandFci: () => {
			return service.get({
				url: `${apiPath}/get_brand_fci`,
			})
		},
		getSeriesFci: (brand) => {
			return service.get({
				url: `${apiPath}/get_series_fci?brand=${brand}`,
			})
		},
	}
}
