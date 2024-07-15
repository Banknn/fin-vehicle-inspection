import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Modal, Row, message, Input as InputAntd, Upload, Divider } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { DetailLayout } from '../../Layout'
import {
	calCompulsoryTaxDay,
	calProtectDate,
	convertStrToFormat,
	convertCC,
	filterAddress,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	checkIdCard,
	getYearPrb,
	getSeriesPrb,
	getSubSeriesPrb,
	setFilesSuccess,
	removeStoreCustomer,
	checkRemoveOnSuccess,
} from '../../../helpers'
import {
	Box,
	Button,
	DatePickerWithLabel,
	Input,
	Label,
	Select,
	Span,
	Radio,
  UploadFiles,
} from '../../../components'
import {
	addressController,
	paymentController,
	systemController,
} from '../../../apiServices'
import { loadingAction, customerAction } from '../../../actions'
import { THEME } from '../../../themes'

const { TextArea } = InputAntd
const { Dragger } = Upload

const TaxRenew = () => {

  const props = {
		name: 'file',
		maxCount: 1,
		onChange(info) {
			const { status } = info.file
			if (status === 'removed') {
				setAttachSlip({})
			} else if (status !== 'uploading') {
				setAttachSlip(info)
				message.success(`${info.file.name} อัพโหลดไฟล์สำเร็จ`)
			}
		},
	}

	const dispatch = useDispatch()
	const customer = useSelector((state) => state.customerReducer)
	const premistions = useSelector((state) => state.premissionsReducer)
	const dataFilesSuccess = useSelector((state) => state.filesSuccessReducer)
	const user = useSelector((state) => state.authenReducer.dataResult)
	const [input, setInput] = useState({})
	const [select, setSelect] = useState({})
	const [fieldError, setFieldError] = useState({})
	//-------------------------- INPUT ------------------------------------
	const [brand, setBrand] = useState(null)
	const [year, setYear] = useState(null)
	const [series, setSeries] = useState(null)
	const [subSeries, setSubSeries] = useState(null)
	const [protectedDate, setProtectedDate] = useState('')
	const [lastProtectedDate, setLastProtectedDate] = useState('')
	const [taxExpireDate, setTaxExpireDate] = useState('')
	const [legal, setLegal] = useState('บุคคลทั่วไป')
	const [quoNum, setQuoNum] = useState('')
	const [isPassport, setIsPassport] = useState(false)
	const [fetchDataFirst, setFetchDataFirst] = useState(false)
	const [searchCar, setSearchCar] = useState('')
	const [workType, setWorkType] = useState('N')
	const [carProvince, setCarProvince] = useState(null)
  const [fileInput, setFileInput] = useState({
    carImg: {},
    prbImg: {},
    inspectImg: {},
    slipImg: {},
  })
  const [problemDetail, setProblemDetail] = useState()
  const [problemTitle, setProblemTitle] = useState()
  const [problemValue, setProblemValue] = useState()
  const [attachSlip, setAttachSlip] = useState({})
	//-------------------------- LIST ------------------------------------
	const [brandList, setBrandList] = useState([])
	const [, setBrandListAxa] = useState([])
	const [brandListJaymart, setBrandListJaymart] = useState([])
	const [brandListThaisri, setBrandListThaisri] = useState([])
	const [brandListIntra, setBrandListIntra] = useState([])
	const [brandListDhipaya, setBrandListDhipaya] = useState([])
	const [brandListThaiSetakij, setBrandListThaiSetakij] = useState([])
	const [brandListKwi, setBrandListKwi] = useState([])
	const [brandListDd, setBrandListDd] = useState([])
	const [brandListChubb, setBrandListChubb] = useState([])
	const [brandListRvp, setBrandListRvp] = useState([])
	const [brandListFci, setBrandListFci] = useState([])
	const [yearList, setYearList] = useState([])
	const [seriesList, setSeriesList] = useState([])
	const [subSeriesList, setSubSeriesList] = useState([])
	const [titleList, setTitleList] = useState([])
	const [carTypeList, setCarTypeList] = useState([])
	const [compulsoryTypeList, setCompulsoryTypeList] = useState([])
	const [companyList, setCompanyList] = useState([])
	const [colorAxaList, setColorAxaList] = useState([])
	const [countryAxaList, setCountryAxaList] = useState([])
	const [nationalAxaList, setNationalAxaList] = useState([])
	const [colorThaisriList, setColorThaisriList] = useState([])
	const [countryThaisriList, setCountryThaisriList] = useState([])
	const [nationalThaisriList, setNationalThaisriList] = useState([])
	const [colorRvpList, setColorRvpList] = useState([])
	const [colorFciList, setColorFciList] = useState([])
	const [address, setAddress] = useState({
		addressList: [],
		provinceList: [],
		amphoeList: [],
		districtList: [],
		zipcodeList: [],
	})

	const handleChangeInput = (e) => {
		const { name, value } = e.currentTarget
		setInput({ ...input, [name]: value })
	}

	const fetchData = useCallback(async () => {
		if (await checkRemoveOnSuccess(dataFilesSuccess)) {
			removeStoreCustomer()
			setFilesSuccess('')
		} else {
			if (!_.isEmpty(customer) && !fetchDataFirst) {
				setFetchDataFirst(true)

				const getYear = await getYearPrb(
					customer.select?.companyCompulsory,
					customer.brand
				)
				const getSeries = await getSeriesPrb(
					customer.select?.companyCompulsory,
					customer.brand,
					customer.year
				)
				const getSubSeries = await getSubSeriesPrb(
					customer.select?.companyCompulsory,
					customer.brand,
					customer.year,
					customer.series
				)

				Promise.all([getYear, getSeries, getSubSeries]).then((e) => {
					setYearList(e[0])
					setSeriesList(e[1])
					setSubSeriesList(e[2])
				})
				setInput(customer.input)
				setSelect(customer.select)
				setBrand(customer.brand)
				setYear(customer.year)
				setSeries(customer.series)
				setSubSeries(customer.subSeries)
				customer.protectedDate &&
					setProtectedDate(moment(customer.protectedDate))
				customer.lastProtectedDate &&
					setLastProtectedDate(moment(customer.lastProtectedDate))
				customer.taxExpireDate &&
					setTaxExpireDate(moment(customer.taxExpireDate))
				setLegal(customer.legal || 'บุคคลทั่วไป')
				setQuoNum(customer.quoNum)
				setIsPassport(customer.isPassport)
			}
		}
	}, [customer, fetchDataFirst, dataFilesSuccess])

	const fetchAddress = useCallback(async () => {
		const API = addressController()
		const res = await API.getAddress()
		if (isValidResponse(res)) {
			const addressRes = res.result
			const provinceObj = addressRes.map((e) => {
				return {
					key: e.province,
					value: e.province,
					text: e.province,
				}
			})
			const province = _.uniqBy(provinceObj, 'key')
			setAddress((e) => {
				return {
					...e,
					addressList: addressRes,
					provinceList: province,
				}
			})
		}
	}, [])

	const handleChangeAddress = (v, e, obj) => {
		const { name, value } = obj
		setSelect({ ...select, [name]: value })
		if (name === 'provinceInsurance') {
			const amphoe = filterAddress('province', value, address)
			setAddress({ ...address, amphoeList: amphoe })
			setSelect((prev) => {
				if (prev.provinceInsurance !== select.provinceInsurance) {
					return {
						...select,
						provinceInsurance: value,
						amphoeInsurance: null,
						districtInsurance: null,
						zipcodeInsurance: null,
					}
				}
			})
		}
		if (name === 'amphoeInsurance') {
			const district = filterAddress('amphoe', value, address)
			setAddress({ ...address, districtList: district })
			setSelect((prev) => {
				if (prev.amphoeInsurance !== select.amphoeInsurance) {
					return {
						...select,
						amphoeInsurance: value,
						districtInsurance: null,
						zipcodeInsurance: null,
					}
				}
			})
		}
		if (name === 'districtInsurance') {
			const zipcode = filterAddress('district', value, address, select)
			setAddress({ ...address, zipcodeList: zipcode })
			setSelect((prev) => {
				if (prev.districtInsurance !== select.districtInsurance) {
					return {
						...select,
						districtInsurance: value,
						zipcodeInsurance: zipcode[0].value,
					}
				}
			})
		}
	}

	useEffect(() => {
		Promise.all([
			LIST.CAR_BRAND(),
			LIST.CAR_TYPE(),
			LIST.CAR_TYPE_PRB(),
			LIST.COMPANY_PRB_BRAND(),
			LIST.CAR_BRAND_Jaymart(),
			LIST.CAR_BRAND_THAISRI(),
			LIST.CAR_BRAND_INTRA_V2(),
			LIST.CAR_BRAND_DHIPAYA(),
			LIST.CAR_BRAND_THAISETAKIJ(),
			LIST.CAR_BRAND_AXA_CMI(),
			LIST.CAR_BRAND_KWI(),
			LIST.CAR_BRAND_DD(),
			LIST.CAR_BRAND_CHUBB(),
			LIST.COLORCARAXA(),
			LIST.COUNTRYAXA(),
			LIST.NATIONALAXA(),
			LIST.COLORCARTHAISRI(),
			LIST.COUNTRYTHAISRI(),
			LIST.NATIONALTHAISRI(),
			LIST.CAR_BRAND_RVP(),
			LIST.COLORCARRVP(),
			LIST.CAR_BRAND_FCI(),
			LIST.COLORCARFCI(),
		]).then((e) => {
			setBrandList(e[0])
			setCarTypeList(e[1])
			setCompulsoryTypeList(e[2])
			setCompanyList(e[3])
			setBrandListJaymart(e[4])
			setBrandListThaisri(e[5])
			setBrandListIntra(e[6])
			setBrandListDhipaya(e[7])
			setBrandListThaiSetakij(e[8])
			setBrandListAxa(e[9])
			setBrandListKwi(e[10])
			setBrandListDd(e[11])
			setBrandListChubb(e[12])
			setColorAxaList(e[13])
			setCountryAxaList(e[14])
			setNationalAxaList(e[15])
			setColorThaisriList(e[16])
			setCountryThaisriList(e[17])
			setNationalThaisriList(e[18])
			setBrandListRvp(e[19])
			setColorRvpList(e[20])
			setBrandListFci(e[21])
			setColorFciList(e[22])
		})
	}, [])

	useEffect(() => {
		setProtectedDate(moment())
		setLastProtectedDate(moment().add(1, 'years'))
		setTaxExpireDate(moment().add(1, 'years'))
		fetchAddress()
		fetchData()
	}, [fetchAddress, fetchData])

	useEffect(() => {
		Promise.all([LIST.TITLE(legal)]).then((e) => {
			setTitleList(e[0])
		})
	}, [legal])

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!brand) {
			formIsValid = false
			errors['brand'] = 'กรุณาเลือกยี่ห้อรถ'
		}
		if (brand === 'none' && !input.brandOther) {
			formIsValid = false
			errors['brandOther'] = 'กรุณาระบุยี่ห้อรถ'
		}
		if (!year) {
			formIsValid = false
			errors['year'] = brand !== 'none' ? 'กรุณาเลือกปีรถ' : 'กรุณาระบุปีรถ'
		}
		if (year === 'none' && !input.yearOther) {
			formIsValid = false
			errors['yearOther'] = 'กรุณาระบุปีรถ'
		}
		if (!series) {
			formIsValid = false
			errors['series'] =
				brand !== 'none' ? 'กรุณาเลือกรุ่นรถ' : 'กรุณาระบุรุ่นรถ'
		}
		if (series === 'none' && !input.seriesOther) {
			formIsValid = false
			errors['seriesOther'] = 'กรุณาระบุรุ่นรถ'
		}
		if (!subSeries) {
			formIsValid = false
			errors['subSeries'] = 'กรุณาเลือกรุ่นย่อยรถ'
		}
		if (!input.vehicleRegistrationNumber) {
			formIsValid = false
			errors['vehicleRegistrationNumber'] = 'กรุณาระบุเลขทะเบียน'
		}
		if (!select.vehicleRegistrationArea) {
			formIsValid = false
			errors['vehicleRegistrationArea'] = 'กรุณาเลือกจังหวัดป้ายทะเบียน'
		}
		if (!select.carType) {
			formIsValid = false
			errors['carType'] = 'กรุณาเลือกประเภทรถ'
		}
		if (!select.bodyType) {
			formIsValid = false
			errors['bodyType'] = 'กรุณาเลือกชนิดรถ'
		}
		// if (!select.colorCar) {
		// 	formIsValid = false
		// 	errors['colorCar'] = 'กรุณาเลือกสีรถ'
		// }
		if (!select.title) {
			formIsValid = false
			errors['title'] = 'กรุณาเลือกคำนำหน้า'
		}
		if (!input.name) {
			formIsValid = false
			errors['name'] = 'กรุณาระบุชื่อ'
		}
		if (legal === 'บุคคลทั่วไป' && !input.lastname) {
			formIsValid = false
			errors['lastname'] = 'กรุณาระบุนามสกุล'
		}
		// if (
		// 	legal !== 'บุคคลทั่วไป' &&
		// 	['แอกซ่าประกันภัย', 'ไทยศรีประกันภัย'].includes(
		// 		select?.companyCompulsory
		// 	) &&
		// 	!input.lastname
		// ) {
		// 	formIsValid = false
		// 	errors['lastname'] = 'กรุณาระบุคำต่อท้ายบริษัท'
		// }
		// if (legal === 'บุคคลทั่วไป' && !select.gender) {
		// 	formIsValid = false
		// 	errors['gender'] = 'กรุณาเลือกเพศ'
		// }
		if (
			(legal === 'บุคคลทั่วไป' && isPassport) || legal === 'นิติบุคคล'
				? !input.idCard
				: !checkIdCard(input.idCard)
		) {
			formIsValid = false
			errors['idCard'] =
				legal === 'บุคคลทั่วไป' && isPassport
					? 'กรุณาระบุเลขหนังสือเดินทาง '
					: legal === 'นิติบุคคล'
					? 'กรุณาระบุเลขที่ผู้เสียภาษี'
					: 'กรุณาระบุเลขบัตรประชาชนให้ถูกต้อง'
		}
		if (
			!select?.country &&
			isPassport
		) {
			formIsValid = false
			errors['country'] = 'กรุณาเลือกเพศสัญชาติ'
		}
		if (
			!select?.national &&
			isPassport
		) {
			formIsValid = false
			errors['national'] = 'กรุณาเลือกเพศสัญชาติ'
		}
		if (!input.addressInsurance) {
			formIsValid = false
			errors['addressInsurance'] = 'กรุณาระบุที่อยู่'
		}
		if (!select.provinceInsurance) {
			formIsValid = false
			errors['provinceInsurance'] = 'กรุณาเลือกจังหวัด'
		}
		if (!select.amphoeInsurance) {
			formIsValid = false
			errors['amphoeInsurance'] = 'กรุณาเลือกเขต/อำเภอ'
		}
		if (!select.districtInsurance) {
			formIsValid = false
			errors['districtInsurance'] = 'กรุณาเลือกแขวง/ตำบล'
		}
    if(Object.keys(fileInput.carImg).length === 0) {
      formIsValid = false
      errors['carImg'] = 'แนบสำเนารถ'
    }
    if(Object.keys(fileInput.prbImg).length === 0) {
      formIsValid = false
      errors['prbImg'] = 'แนบพรบ'
    }
    if(Object.keys(fileInput.inspectImg).length === 0) {
      formIsValid = false
      errors['inspectImg'] = 'แนบใบตรวจสภาพ'
    }
		setFieldError({ errors })
		return formIsValid
	}

	const calDate = () => {
		const firstDate = moment(protectedDate, 'YYYY-MM-DD')
		const lastDate = moment(lastProtectedDate, 'YYYY-MM-DD')
		return protectedDate && lastProtectedDate
			? lastDate.diff(firstDate, 'days')
			: '0'
	}

	const getBrandList = () => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return brandListDd
			case 'เจมาร์ทประกันภัย (เจพี)':
				return brandListJaymart
			case 'ไทยศรีประกันภัย':
				return brandListThaisri
			case 'อินทรประกันภัย(สาขาสีลม)':
				return brandListIntra
			case 'ทิพยประกันภัย':
				return brandListDhipaya
			case 'ไทยเศรษฐกิจประกันภัย':
				return brandListThaiSetakij
			case 'เคดับบลิวไอประกันภัย':
				return brandListKwi
			case 'ชับบ์สามัคคีประกันภัย':
				return brandListChubb
			case 'บริษัทกลาง':
				return brandListRvp
			case 'ฟอลคอนประกันภัย':
				return brandListFci
			default:
				return brandList
		}
	}

	const getYearList = (value) => {
		switch (select?.companyCompulsory) {
			case 'ชับบ์สามัคคีประกันภัย':
				return LIST.CAR_YEAR_CHUBB(value).then((e) => setYearList(e))
			default:
				return LIST.CAR_YEAR(value).then((e) => setYearList(e))
		}
	}

	const getSeriesList = (value) => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return LIST.CAR_SERIES_DD(brand).then((e) => setSeriesList(e))
			case 'เจมาร์ทประกันภัย (เจพี)':
				return LIST.CAR_SERIES_Jaymart(brand).then((e) => setSeriesList(e))
			case 'ไทยศรีประกันภัย':
				return LIST.CAR_SERIES_THAISRI(brand).then((e) => setSeriesList(e))
			case 'อินทรประกันภัย(สาขาสีลม)':
				return LIST.CAR_SERIES_INTRA_V2(brand).then((e) => setSeriesList(e))
			case 'ทิพยประกันภัย':
				return LIST.CAR_SERIES_DHIPAYA(brand).then((e) => setSeriesList(e))
			case 'ไทยเศรษฐกิจประกันภัย':
				return LIST.CAR_SERIES_THAISETAKIJ(brand).then((e) => setSeriesList(e))
			case 'เคดับบลิวไอประกันภัย':
				return LIST.CAR_SERIES_KWI(brand).then((e) => setSeriesList(e))
			case 'ชับบ์สามัคคีประกันภัย':
				return LIST.CAR_SERIES_CHUBB(brand, value).then((e) => setSeriesList(e))
			case 'บริษัทกลาง':
				return LIST.CAR_SERIES_RVP(brand).then((e) => setSeriesList(e))
			case 'ฟอลคอนประกันภัย':
				return LIST.CAR_SERIES_FCI(brand).then((e) => setSeriesList(e))
			default:
				return LIST.CAR_SERIES(brand, value).then((e) => setSeriesList(e))
		}
	}

	const getSubSeriesList = (value) => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return LIST.CAR_SUB_SERIES_DD(brand, value).then((e) =>
					setSubSeriesList(e)
				)
			case 'ทิพยประกันภัย':
				return LIST.CAR_SUB_SERIES_DHIPAYA(value).then((e) =>
					setSubSeriesList(e)
				)
			default:
				return LIST.CAR_SUB_SERIES(brand, year, value).then((e) =>
					setSubSeriesList(e)
				)
		}
	}

	const getBrandTitle = (company) => {
		switch (company) {
			case 'แอกซ่าประกันภัย':
				return brandListDd.find((e) => e.value === brand)
			case 'เจมาร์ทประกันภัย (เจพี)':
				return brandListJaymart.find((e) => e.value === brand)
			case 'ไทยศรีประกันภัย':
				return brandListThaisri.find((e) => e.value === brand)
			case 'อินทรประกันภัย(สาขาสีลม)':
				return brandListIntra.find((e) => e.value === brand)
			case 'ทิพยประกันภัย':
				return brandListDhipaya.find((e) => e.value === brand)
			case 'ไทยเศรษฐกิจประกันภัย':
				return brandListThaiSetakij.find((e) => e.value === brand)
			case 'เคดับบลิวไอประกันภัย':
				return brandListKwi.find((e) => e.value === brand)
			case 'ชับบ์สามัคคีประกันภัย':
				return brandListChubb.find((e) => e.value === brand)
			case 'บริษัทกลาง':
				return brandListRvp.find((e) => e.value === brand)
			case 'ฟอลคอนประกันภัย':
				return brandListFci.find((e) => e.value === brand)
			default:
				return brandList.find((e) => e.value === brand)
		}
	}

	const getColorCar = () => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return colorAxaList
			case 'ไทยศรีประกันภัย':
				return colorThaisriList
			case 'บริษัทกลาง':
				return colorRvpList
			case 'ฟอลคอนประกันภัย':
				return colorFciList
			default:
				return colorAxaList
		}
	}
	const getCountryList = () => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return countryAxaList || []
			case 'ไทยศรีประกันภัย':
				return countryThaisriList || []
			default:
				return countryAxaList || []
		}
	}

	const getNationalList = () => {
		switch (select?.companyCompulsory) {
			case 'แอกซ่าประกันภัย':
				return nationalAxaList || []
			case 'ไทยศรีประกันภัย':
				return nationalThaisriList || []
			default:
				return nationalAxaList || []
		}
	}

	const getCompulsoryTypeList = () => {
		let cTypeListThaiSet = [
			'2.10E',
			'2.20A',
			'3.10E',
			'2.20B',
			'2.20E',
			'2.20F',
			'2.20C',
			'2.20D',
			'2.20G',
			'2.20H',
			'2.40A',
			'2.40B',
			'2.70A',
			'2.70B',
			'2.70E',
			'2.71',
			'3.20C',
			'3.20D',
			'3.20G',
			'3.20F',
			'3.20H',
			'3.40B',
			'3.40C',
			'1.42A',
			'2.42A',
			'3.42A',
		]
		let cTypeListViriya = [
			'1.70A',
			'1.70B',
			'1.70E',
			'1.71',
			'2.10',
			'2.10E',
			'2.20A',
			'2.20B',
			'2.20C',
			'2.20D',
			'2.20E',
			'2.20F',
			'2.20G',
			'2.20H',
			'2.40A',
			'2.40B',
			'2.42A',
			'2.70A',
			'2.70B',
			'2.70E',
			'2.71',
			'3.70A',
			'3.70B',
			'3.71',
			'3.70E',
		]
		const cTypeListRvp = [
			'1.30A',
			'1.30B',
			'1.30C',
			'1.30D',
			'1.30E',
			'2.30A',
			'2.30B',
			'2.30C',
			'2.30D',
			'2.30E',
		]
		cTypeListThaiSet = cTypeListThaiSet.concat(cTypeListRvp)
		cTypeListViriya = cTypeListViriya.concat(cTypeListRvp)

		if (select?.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย') {
			return compulsoryTypeList.filter(
				(e) => !cTypeListThaiSet.includes(e.prb_type_code)
			)
		} else if (select?.companyCompulsory === 'วิริยะประกันภัย') {
			return compulsoryTypeList.filter(
				(e) => !cTypeListViriya.includes(e.prb_type_code)
			)
		} else if (select?.companyCompulsory === 'บริษัทกลาง') {
			return compulsoryTypeList.filter((e) =>
				cTypeListRvp.includes(e.prb_type_code)
			)
		} else {
			return compulsoryTypeList.filter(
				(e) =>
					e.prb_type_code === '1.10' ||
					e.prb_type_code === '1.20A' ||
					e.prb_type_code === '1.40A'
			)
		}
	}

	const getCarTypeList = () => {
		if (['1.10', '1.10E'].includes(select?.compulsoryType)) {
			return carTypeList.filter((e) => e.value === 'รย.1')
		} else if (['1.20A'].includes(select?.compulsoryType)) {
			return carTypeList.filter((e) => e.value === 'รย.2')
		} else if (['1.40A', '1.40B', '1.40C'].includes(select?.compulsoryType)) {
			return carTypeList.filter((e) => e.value === 'รย.3')
		}
		return carTypeList
	}

	const getBodyTypeList = () => {
		let bodyTypeList = LIST.BODY_TYPE
		if (['1.10', '1.10E'].includes(select?.compulsoryType)) {
			bodyTypeList = bodyTypeList.filter((e) =>
				['เก๋ง', 'กระบะ'].includes(e.value)
			)
		} else if (['1.20A'].includes(select?.compulsoryType)) {
			bodyTypeList = bodyTypeList.filter((e) =>
				['รถตู้', 'โดยสาร'].includes(e.value)
			)
		} else if (['1.40A', '1.40B', '1.40C'].includes(select?.compulsoryType)) {
			bodyTypeList = bodyTypeList.filter((e) => ['รถบรรทุก'].includes(e.value))
		}
		return bodyTypeList
	}

	const handleSearch = async () => {
		const API = systemController()
		const res = await API.findCustomerPrb({ search: searchCar, carProvince })
		if (isValidResponse(res)) {
			const data = res.result[0]
			setSearchCar('')
			setCarProvince(null)
			if (data) {
				setInput((e) => ({
					...e,
					vehicleRegistrationNumber: data.idcar,
					idCard: data.idcard,
					name: data.name,
					lastname: data.lastname,
					engineCC: data.cc_car,
					carWeight: data.weight_car,
					tel: data.tel !== '-' || data.tel ? data.tel : '',
					engineNo: data.id_motor1,
					chassisSerialNumber: data.id_motor2,
				}))
				setSelect((e) => ({
					...e,
					companyCompulsory: data.company_prb,
					registerYear: data.registerYear,
					carCode: data.no_car,
					title: data?.title,
					gender: data.gender,
					insuranceType:
						data.type && data.repair_type
							? `ชั้น ${data.type} ${data.repair_type}`
							: null,
					carType: data.car_type,
					bodyType: data.vehBodyTypeDesc,
					seat: data.seatingCapacity,
					vehicleRegistrationArea: data.carprovince,
					amphoeInsurance: data.amphoe,
					districtInsurance: data.district,
					provinceInsurance: data.province,
					zipcodeInsurance: data.zipcode,
				}))
				// setBrand(data.brandplan)
				// setYear(data.yearplan)
				// setSeries(data.seriesplan)
				// setSubSeries(data.sub_seriesplan)
				setLegal(data.insuredType === '2' ? 'นิติบุคคล' : 'บุคคลทั่วไป')
			} else {
				Modal.warning({
					title: 'ไม่พบข้อมูล',
				})
			}
		}
	}

	const handleClick = {
		submitToBill: async () => {
			if (validateFields()) {
				// if (await handleClick.submit()) {
				// 	redirect(ROUTE_PATH.BILL.LINK)
				// }
        redirect(ROUTE_PATH.TAXBILL.LINK)
			} else {
				Modal.error({
					title: 'กรุณากรอกให้ครบทุกช่อง',
				})
			}
		}
	}

  const handleUpload = (img, type) => {
    switch(type) {
      case 'สำเนารถ':
        setFileInput({ ...fileInput, carImg: img })
        return
      case 'พรบ':
        setFileInput({ ...fileInput, prbImg: img })
        return
      case 'ใบตรวจสภาพ':
        setFileInput({ ...fileInput, inspectImg: img })
        return
      default:
        return
    }
  }

	const form = [
		{
			section: {
				title: 'ข้อมูลรถยนต์',
				items: [
					{
						label: 'ยี่ห้อรถ',
						row: true,
						required: true,
						col: 6,
						item: (
							<>
								<Select
                  disabled
									name='brand'
									placeholder='ยี่ห้อรถ'
									showSearch
									options={getBrandList()}
									onChange={(value) => {
										getYearList(value)
										setBrand(value)
										setYear(null)
										setSeries(null)
										setSeriesList([])
										setSubSeries(null)
										setSubSeriesList([])
									}}
									value={brand}
									error={fieldError.errors?.brand}
								/>
								{brand === 'none' && (
									<Input
                    disabled
										name='brandOther'
										placeholder='ยี่ห้อรถ'
										style={{ marginTop: '15px', marginBottom: '10px' }}
										onChange={(e) => {
											const { value } = e.currentTarget
											setInput({
												...input,
												brandOther: value.replace(/[^A-Za-z]/gi, ''),
											})
										}}
										value={input?.brandOther}
										error={fieldError.errors?.brandOther}
									/>
								)}
							</>
						),
					},
					{
						label: brand === 'none' ? 'ปีรถ (ค.ศ.)' : 'ปีรถ',
						row: true,
						required: true,
						col: 6,
						item:
							brand !== 'none' ? (
								<>
									<Select
                    disabled
										name='year'
										placeholder='ปีรถ'
										showSearch
										options={
											[
												'ไทยเศรษฐกิจประกันภัย',
												'เคดับบลิวไอประกันภัย',
												'ไทยศรีประกันภัย',
												'ทิพยประกันภัย',
												'อินทรประกันภัย(สาขาสีลม)',
												'แอกซ่าประกันภัย',
												'บริษัทกลาง',
												'ฟอลคอนประกันภัย',
											].includes(select?.companyCompulsory)
												? LIST.CAR_YEAR_ALL()
												: yearList
										}
										onChange={(value) => {
											getSeriesList(value)
											setSelect((e) => ({ ...e, registerYear: value }))
											setYear(value)
											setSeries(null)
											setSubSeries(null)
											setSubSeriesList([])

											if (['บริษัทกลาง'].includes(select?.companyCompulsory))
												setSeries(brand)
										}}
										value={year}
										error={fieldError.errors?.year}
									/>
									{year === 'none' && (
										<Input
                      disabled
											name='yearOther'
											placeholder='ปีรถ'
											style={{ marginTop: '15px', marginBottom: '10px' }}
											onChange={(e) => {
												const { value } = e.currentTarget
												setInput({
													...input,
													yearOther: value.replace(/[^0-9]/gi, ''),
												})
												setSelect((e) => ({
													...e,
													registerYear: value,
												}))
											}}
											value={input?.yearOther}
											error={fieldError.errors?.yearOther}
										/>
									)}
								</>
							) : (
								<Input
                  disabled
									name='year'
									placeholder='ปีรถ (ค.ศ.)'
									onChange={(even) => {
										const { value } = even.currentTarget
										getSeriesList(value)
										setYear(value.replace(/[^0-9]/gi, ''))
										setSelect((e) => ({
											...e,
											registerYear: value.replace(/[^0-9]/gi, ''),
										}))
										setSeries(null)
										setSubSeries(null)
										setSubSeriesList([])
									}}
									value={year}
									error={fieldError.errors?.year}
								/>
							),
					},
					// {
					// 	label: 'ปีที่จดทะเบียนรถ',
					// 	row: true,
					// 	required: true,
					// 	col: 4,
					// 	item: (
					// 		<Select
          //      disabled
					// 			name='registerYear'
					// 			placeholder='ปีที่จดทะเบียนรถ'
					// 			showSearch
					// 			options={LIST.YEAR()}
					// 			onChange={(v) => setSelect((e) => ({ ...e, registerYear: v }))}
					// 			value={select?.registerYear}
					// 			error={fieldError.errors?.registerYear}
					// 		/>
					// 	),
					// },
					{
						label: 'รุ่นรถ',
						row: true,
						required: true,
						col: 6,
						item:
							brand !== 'none' ? (
								<>
									<Select
                    disabled
										name='series'
										placeholder='รุ่นรถ'
										showSearch
										options={seriesList}
										onChange={(value) => {
											if (
												select?.companyCompulsory === 'เคดับบลิวไอประกันภัย'
											) {
												const fList = seriesList.find((e) => e.value === value)
												setSelect((e) => ({
													...e,
													seat: fList.seat,
												}))
											}
											getSubSeriesList(value)
											setSeries(value)
											setSubSeries(null)
										}}
										value={series}
										error={fieldError.errors?.series}
									/>
									{series === 'none' && (
										<Input
                      disabled
											name='seriesOther'
											placeholder='รุ่นรถ'
											style={{ marginTop: '15px', marginBottom: '10px' }}
											onChange={(e) => {
												const { value } = e.currentTarget
												setInput({
													...input,
													seriesOther: value.replace(/[^A-Za-z0-9-]/gi, ''),
												})
											}}
											value={input?.seriesOther}
											error={fieldError.errors?.seriesOther}
										/>
									)}
								</>
							) : (
								<Input
                  disabled
									name='serie'
									placeholder='รุ่นรถ'
									onChange={(even) => {
										const { value } = even.currentTarget
										getSubSeriesList(value)
										setSeries(value.replace(/[^A-Za-z0-9]/gi, ''))
										setSubSeries(null)
									}}
									value={series}
									error={fieldError.errors?.series}
								/>
							),
					},
					{
						label: 'รุ่นย่อยรถ',
						row: true,
						required: true,
						col: 6,
						item: (
							<Select
                disabled
								name='subSeries'
								placeholder='รุ่นย่อยรถ'
								showSearch
								options={subSeriesList}
								onChange={(value) => {
									setSubSeries(value)
								}}
								value={subSeries}
								error={fieldError.errors?.subSeries}
							/>
						),
					},
					{
						label: 'เลขทะเบียน',
						row: true,
						required: true,
						col: 4,
						item: (
							<Input
                disabled
								name='vehicleRegistrationNumber'
								value={convertStrToFormat(
									input?.vehicleRegistrationNumber,
									'idcar'
								)}
								placeholder='เลขทะเบียน'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										vehicleRegistrationNumber: value.replace(
											/[^A-Za-zก-ฮ0-9-ป้ายแดง]/gi,
											''
										),
									})
								}}
								error={fieldError.errors?.vehicleRegistrationNumber}
							/>
						),
					},
					{
						label: 'จังหวัดป้ายทะเบียน',
						row: true,
						required: true,
						col: 6,
						item: (
							<Select
                disabled
								name='vehicleRegistrationArea'
								placeholder='จังหวัดป้ายทะเบียน'
								showSearch
								options={address.provinceList}
								onChange={(v) =>
									setSelect((e) => ({ ...e, vehicleRegistrationArea: v }))
								}
								value={select?.vehicleRegistrationArea}
								error={fieldError.errors?.vehicleRegistrationArea}
							/>
						),
					},
					{
						label: 'ประเภทรถ',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
                disabled
								name='carType'
								placeholder='ประเภทรถ'
								showSearch
								options={getCarTypeList()}
								onChange={(v) => setSelect((e) => ({ ...e, carType: v }))}
								value={select?.carType}
								error={fieldError.errors?.carType}
							/>
						),
					},
					{
						label: 'ชนิดรถ',
						row: true,
						required: true,
						col: 6,
						item: (
							<Select
                disabled
								name='bodyType'
								placeholder='ชนิดรถ'
								showSearch
								options={getBodyTypeList()}
								onChange={(v) => setSelect((e) => ({ ...e, bodyType: v }))}
								value={select?.bodyType}
								error={fieldError.errors?.bodyType}
							/>
						),
					},
					// {
					// 	label: 'สีรถ',
					// 	row: true,
					// 	required: true,
					// 	col: 3,
					// 	hide: ![
					// 		'แอกซ่าประกันภัย',
					// 		'ชับบ์สามัคคีประกันภัย',
					// 		'ไทยศรีประกันภัย',
					// 		'บริษัทกลาง',
					// 		'ฟอลคอนประกันภัย',
					// 	].includes(select?.companyCompulsory),
					// 	item: (
					// 		<Select
          //      disabled
					// 			name='colorCar'
					// 			placeholder='สีรถ'
					// 			showSearch
					// 			options={getColorCar()}
					// 			onChange={(v) => setSelect((e) => ({ ...e, colorCar: v }))}
					// 			value={select?.colorCar}
					// 			error={fieldError.errors?.colorCar}
					// 		/>
					// 	),
					// },
					// {
					// 	label: 'จำนวนที่นั่ง',
					// 	row: true,
					// 	required: true,
					// 	col: 4,
					// 	item: (
					// 		<Select
          //      disabled
					// 			name='seat'
					// 			placeholder='จำนวนที่นั่ง'
					// 			showSearch
					// 			options={LIST.SEAT}
					// 			onChange={(v) => setSelect((e) => ({ ...e, seat: v }))}
					// 			value={select?.seat}
					// 			error={fieldError.errors?.seat}
					// 			disabled={['1.10', '1.20A', '1.40A', '1.40B', '1.40C'].includes(
					// 				select?.compulsoryType
					// 			)}
					// 		/>
					// 	),
					// },
					// {
					// 	label: 'เครื่องยนต์ (CC)',
					// 	row: true,
					// 	required: true,
					// 	col: 4,
					// 	item: (
					// 		<Input
          //      disabled
					// 			name='engineCC'
					// 			placeholder='CC'
					// 			onChange={(e) => {
					// 				const { value } = e.currentTarget
					// 				setInput({
					// 					...input,
					// 					engineCC: value.replace(/[^0-9.]+/g, ''),
					// 				})
					// 			}}
					// 			value={input?.engineCC}
					// 			error={fieldError.errors?.engineCC}
					// 		/>
					// 	),
					// },
					// {
					// 	label: 'น้ำหนักรถ',
					// 	row: true,
					// 	required: true,
					// 	col: 4,
					// 	item: (
					// 		<Input
          //      disabled
					// 			name='carWeight'
					// 			placeholder='น้ำหนักรถ'
					// 			onChange={(e) => {
					// 				const { value } = e.currentTarget
					// 				setInput({
					// 					...input,
					// 					carWeight: value.replace(/[^0-9.]+/g, ''),
					// 				})
					// 			}}
					// 			value={input?.carWeight}
					// 			error={fieldError.errors?.carWeight}
					// 		/>
					// 	),
					// },
					// {
					// 	label: 'เลขตัวถัง',
					// 	row: true,
					// 	required: true,
					// 	col: 6,
					// 	item: (
					// 		<Input
          //      disabled
					// 			name='chassisSerialNumber'
					// 			placeholder='เลขตัวถัง'
					// 			onChange={(e) => {
					// 				const { value } = e.currentTarget
					// 				setInput({
					// 					...input,
					// 					chassisSerialNumber: value
					// 						.replace(/[^A-Za-z0-9]/gi, '')
					// 						.toLocaleUpperCase(),
					// 				})
					// 			}}
					// 			value={input?.chassisSerialNumber}
					// 			error={fieldError.errors?.chassisSerialNumber}
					// 		/>
					// 	),
					// },
					// {
					// 	label: 'เลขเครื่องยนต์',
					// 	row: true,
					// 	col: 6,
					// 	item: (
					// 		<Input
          //      disabled
					// 			name='engineNo'
					// 			placeholder='เลขเครื่องยนต์'
					// 			onChange={(e) => {
					// 				const { value } = e.currentTarget
					// 				setInput({
					// 					...input,
					// 					engineNo: value
					// 						.replace(/[^A-Za-z0-9]/gi, '')
					// 						.toLocaleUpperCase(),
					// 				})
					// 			}}
					// 			value={input?.engineNo}
					// 			error={fieldError.errors?.engineNo}
					// 		/>
					// 	),
					// },
					{
						label: 'เลขกรม พรบ.เดิม',
						row: true,
						required: true,
						col: 6,
						hide: workType !== 'R',
						item: (
							<Input
                disabled
								name='policyNoPrb'
								placeholder='เลขกรม พรบ.เดิม'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										policyNoPrb: value
											.replace(/[^A-Za-z0-9]/gi, '')
											.toLocaleUpperCase(),
									})
								}}
								value={input?.policyNoPrb}
								error={fieldError.errors?.policyNoPrb}
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลลูกค้า',
				items: [
					{
						label: 'นิติบุคคล/บุคคลทั่วไป',
						row: true,
						col: 4,
						item: (
							<Select
                disabled
								name='legal'
								showSearch
								options={LIST.LEGAL}
								onChange={(v) => {
									setLegal(v)
									setSelect((e) => ({ ...e, title: null, gender: null }))
									setInput((e) => ({
										...e,
										name: null,
										lastname: null,
										idCard: null,
										tel: null,
									}))
								}}
								value={legal}
							/>
						),
					},
					{
						label: 'คำนำหน้า',
						row: true,
						required: true,
						col: 4,
						item: (
							<Select
                disabled
								name='title'
								placeholder='คำนำหน้า'
								showSearch
								options={titleList}
								onChange={(v) => {
									if (['หจก.', 'ห้างหุ้นส่วนจำกัด'].includes(v)) {
										setInput((e) => ({
											...e,
											lastname: ' ',
										}))
									}
									setSelect((e) => ({ ...e, title: v }))
								}}
								value={select?.title}
								error={fieldError.errors?.title}
							/>
						),
					},
					{
						label: legal === 'บุคคลทั่วไป' ? 'ชื่อ' : 'ชื่อบริษัท',
						row: true,
						required: true,
						col: 8,
						item: (
							<Input
                disabled
								name='name'
								placeholder={legal === 'บุคคลทั่วไป' ? 'ชื่อ' : 'ชื่อบริษัท'}
								onChange={handleChangeInput}
								value={input?.name}
								error={fieldError.errors?.name}
							/>
						),
					},
					{
						label:
							legal !== 'บุคคลทั่วไป' 
              // &&
							// [
							// 	'แอกซ่าประกันภัย',
							// 	'ไทยศรีประกันภัย',
							// 	'บริษัทกลาง',
							// 	'ฟอลคอนประกันภัย',
							// ].includes(select?.companyCompulsory)
								? '(คำต่อท้ายบริษัท)'
								: 'นามสกุล',
						row: true,
						required: true,
						hide: !(
							legal === 'บุคคลทั่วไป' ||
							(legal !== 'บุคคลทั่วไป' 
                // &&
								// [
								// 	'แอกซ่าประกันภัย',
								// 	'ไทยศรีประกันภัย',
								// 	'บริษัทกลาง',
								// 	'ฟอลคอนประกันภัย',
								// ].includes(select?.companyCompulsory)
              )
						),
						col: 8,
						item: (
							<Input
                disabled
								name='lastname'
								placeholder={
									legal !== 'บุคคลทั่วไป' 
                  // &&
									// [
									// 	'แอกซ่าประกันภัย',
									// 	'ไทยศรีประกันภัย',
									// 	'บริษัทกลาง',
									// 	'ฟอลคอนประกันภัย',
									// ].includes(select?.companyCompulsory)
										? 'คำต่อท้ายบริษัท'
										: 'นามสกุล'
								}
								onChange={handleChangeInput}
								value={input?.lastname}
								error={fieldError.errors?.lastname}
							/>
						),
					},
					// {
					// 	label: 'เพศ',
					// 	row: true,
					// 	required: true,
					// 	hide: legal === 'บุคคลทั่วไป' ? false : true,
					// 	col: 4,
					// 	item: (
					// 		<Select
          //      disabled
					// 			name='gender'
					// 			placeholder='เพศ'
					// 			showSearch
					// 			options={LIST.GENDER}
					// 			onChange={(v) => setSelect((e) => ({ ...e, gender: v }))}
					// 			value={select?.gender}
					// 			error={fieldError.errors?.gender}
					// 		/>
					// 	),
					// },
					{
						label:
							legal === 'บุคคลทั่วไป'
								? 'เลขบัตรประชาชน/หนังสือเดินทาง'
								: 'เลขที่ผู้เสียภาษี',
						row: true,
						required: true,
						col: 10,
						item: (
							<Input
                disabled
								name='idCard'
								placeholder={
									legal === 'บุคคลทั่วไป' && isPassport
										? 'หนังสือเดินทาง'
										: legal === 'นิติบุคคล'
										? 'เลขที่ผู้เสียภาษี'
										: 'เลขบัตรประชาชน'
								}
								onChange={handleChangeInput}
								value={input?.idCard}
								valueCheckErr={!checkIdCard(input?.idCard)}
								error={fieldError.errors?.idCard}
							/>
						),
					},
					{
						label: 'เชื้อชาติ',
						row: true,
						required: true,
						hide: !(
							isPassport
              // &&
							// [
							// 	'แอกซ่าประกันภัย',
							// 	'ไทยศรีประกันภัย',
							// 	'บริษัทกลาง',
							// 	'ฟอลคอนประกันภัย',
							// ].includes(select?.companyCompulsory)
						),
						col: 6,
						item: (
							<Select
                disabled
								name='country'
								placeholder='เชื้อชาติ'
								showSearch
								options={getCountryList()}
								onChange={(v) => setSelect((e) => ({ ...e, country: v }))}
								value={select?.country}
								error={fieldError.errors?.country}
							/>
						),
					},
					{
						label: 'สัญชาติ',
						row: true,
						required: true,
						hide: !(
							isPassport 
              // &&
							// [
							// 	'แอกซ่าประกันภัย',
							// 	'ไทยศรีประกันภัย',
							// 	'บริษัทกลาง',
							// 	'ฟอลคอนประกันภัย',
							// ].includes(select?.companyCompulsory)
						),
						col: 6,
						item: (
							<Select
                disabled
								name='national'
								placeholder='สัญชาติ'
								showSearch
								options={getNationalList()}
								onChange={(v) => setSelect((e) => ({ ...e, national: v }))}
								value={select?.national}
								error={fieldError.errors?.national}
							/>
						),
					},
					{
						label: 'เบอร์โทรศัพท์',
						row: true,
						col: 4,
						item: (
							<Input
                disabled
								name='tel'
								placeholder='เบอร์โทรศัพท์'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.tel, 'phone_number')}
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ที่อยู่หน้ากรมธรรม์',
				items: [
					{
						label: 'ที่อยู่',
						row: true,
						required: true,
						col: select?.companyCompulsory === 'วิริยะประกันภัย' ? 8 : 16,
						item: (
							<Input
                disabled
								name='addressInsurance'
								placeholder='ที่อยู่'
								onChange={handleChangeInput}
								value={input?.addressInsurance}
								error={fieldError.errors?.addressInsurance}
							/>
						),
					},
					{
						label: 'ถนน',
						row: true,
						col: 4,
						hide:
							select?.companyCompulsory === 'วิริยะประกันภัย' ? false : true,
						item: (
							<Input
                disabled
								name='roadInsurance'
								placeholder='ถนน'
								onChange={handleChangeInput}
								value={input?.roadInsurance}
							/>
						),
					},
					{
						label: 'ซอย',
						row: true,
						col: 4,
						hide:
							select?.companyCompulsory === 'วิริยะประกันภัย' ? false : true,
						item: (
							<Input
                disabled
								name='soiInsurance'
								placeholder='ซอย'
								onChange={handleChangeInput}
								value={input?.soiInsurance}
							/>
						),
					},
					{
						label: 'จังหวัด',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
                disabled
								name='provinceInsurance'
								placeholder='จังหวัด'
								showSearch
								options={address.provinceList}
								onChange={handleChangeAddress}
								value={select?.provinceInsurance}
								error={fieldError.errors?.provinceInsurance}
							/>
						),
					},
					{
						label: 'เขต/อำเภอ',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
                disabled
								name='amphoeInsurance'
								placeholder='เขต/อำเภอ'
								showSearch
								options={address.amphoeList}
								onChange={handleChangeAddress}
								value={select?.amphoeInsurance}
								error={fieldError.errors?.amphoeInsurance}
							/>
						),
					},
					{
						label: 'แขวง/ตำบล',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
                disabled
								name='districtInsurance'
								placeholder='แขวง/ตำบล'
								showSearch
								options={address.districtList}
								onChange={handleChangeAddress}
								value={select?.districtInsurance}
								error={fieldError.errors?.districtInsurance}
							/>
						),
					},
					{
						label: 'รหัสไปรษณีย์',
						row: true,
						col: 8,
						item: (
							<Select
                disabled
								name='zipcodeInsurance'
								placeholder='รหัสไปรษณีย์'
								showSearch
								options={address.zipcodeList}
								onChange={handleChangeAddress}
								value={select?.zipcodeInsurance}
								error={fieldError.errors?.zipcodeInsurance}
							/>
						),
					},
				],
			},
		},
    {
      section: {
        title: 'แนบเอกสารเพิ่มเติม',
        detail: (
          <React.Fragment>
            <Row justify='center'>
              <Col xs={24} lg={5} 
                style={{ 
                  border: `1px dashed ${THEME.COLORS.GRAY2}`,
                  borderRadius: '5px', 
                  margin: '0 10px 0 10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {uploadFileImg({
                  title: 'สำเนารถ',
                  nameFile: 'carImg',
                  valueFiles: fileInput.carImg,
                  handleUpload,
                  errors: fieldError.errors?.carImg,
                  require: true,
                })}
              </Col>
              <Col xs={24} lg={5} 
                style={{ 
                  border: `1px dashed ${THEME.COLORS.GRAY2}`,
                  borderRadius: '5px', 
                  margin: '0 10px 0 10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {uploadFileImg({
                  title: 'พรบ',
                  nameFile: 'prbImg',
                  valueFiles: fileInput.prbImg,
                  handleUpload,
                  errors: fieldError.errors?.prbImg,
                  require: true,
                })}
              </Col>
              <Col xs={24} lg={5} 
                style={{ 
                  border: `1px dashed ${THEME.COLORS.GRAY2}`,
                  borderRadius: '5px', 
                  margin: '0 10px 0 10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {uploadFileImg({
                  title: 'ใบตรวจสภาพ',
                  nameFile: 'inspectImg',
                  valueFiles: fileInput.inspectImg,
                  handleUpload,
                  errors: fieldError.errors?.inspectImg,
                  require: true,
                })}
              </Col>
            </Row>
          </React.Fragment>
        )
      },
    },
	]

	return (
    <>
      <DetailLayout
        isPreve={true}
        onClickPrevious={() => redirect(ROUTE_PATH.WAITRENEW.LINK)}
        // onClickForward={() => redirect(ROUTE_PATH.CAR_INSURANCE.LINK)}
        // isStep={true}
      >
        <Label className='title-form'>ตรวจสอบข้อมูล</Label>
        {form.map((e, i) => {
          const { section } = e
          return (
            <Box key={i}>
              <Label
                className='title-second-form'
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {section.title}
                {section.title === 'ข้อมูลประกันภัย' && (
                  <Box>
                    <Select
                      disabled
                      style={{
                        width: '200px',
                        alignSelf: 'center',
                        marginRight: '10px',
                        fontWeight: 500,
                      }}
                      name='carProvince'
                      placeholder='จังหวัดป้ายทะเบียน'
                      showSearch
                      options={address.provinceList}
                      onChange={(v) => setCarProvince(v)}
                      value={carProvince}
                    />
                    <Input.Search
                      onSearch={() => {
                        if (carProvince && searchCar) {
                          handleSearch()
                        } else {
                          message.error(
                            `กรุณากรอกจังหวัดป้ายทะเบียนและเลขทะเบียนให้ครบถ้วน`
                          )
                        }
                      }}
                      style={{ width: '200px', alignSelf: 'center' }}
                      placeholder='เลขทะเบียนรถ'
                      enterButton
                      value={convertStrToFormat(searchCar, 'idcar')}
                      onChange={(e) => {
                        const { value } = e.currentTarget
                        setSearchCar(value.replace(/[^A-Za-zก-ฮ0-9-]/gi, ''))
                      }}
                    />
                  </Box>
                )}
              </Label>
              {
                section.detail ? section.detail :
                <Row gutter={[16, 16]}>
                  {section.items.map((el, il) => {
                    return (
                      !el.hide && (
                        <Col xs={el.col} key={il}>
                          <Box>
                            <Label
                              className={
                                el.label === 'เลขบัตรประชาชน/หนังสือเดินทาง' &&
                                'd-flex'
                              }
                            >
                              {el.label === 'เลขบัตรประชาชน/หนังสือเดินทาง'
                                ? idCardAndPassport(isPassport, setIsPassport)
                                : el.label}{' '}
                              {el.required && <Span color='red'>*</Span>}
                            </Label>
                          </Box>
                          <Box>{el.item}</Box>
                        </Col>
                      )
                    )
                  })}
                </Row>
              }
            </Box>
          )
        })}
        <Box className='accept-group-btn-wrapper'>
          <Button
            className='accept-btn'
            width='140'
            onClick={handleClick.submitToBill}
          >
            บันทึก
          </Button>
        </Box>
      </DetailLayout>
      <DetailLayout>
        <Label className='title-form'>งานติดปัญหา</Label>
        <Box>
          <Label>ข้อมูลงาน</Label>
          <TextArea style={{ minHeight: '50px', maxHeight: '100px', height: '50px', borderRadius: '5px' }}
            placeholder='ระบุข้อมูลงาน'
            value={problemDetail}
            onChange={(e)=>{setProblemDetail(e.target.value)}}
          />
        </Box>
        <Box>
          <Row justify='space-between'>
            <Col xs={24} lg={11}>
              <Label>หัวข้องานติดปัญหา</Label>
              <Select
                placeholder='หัวข้องาน'
                options={[]}
                onChange={(e) => {setProblemTitle(e)}}
                value={problemTitle}
              />
            </Col>
            <Col xs={24} lg={12}>
              <Label>เพิ่มยอดเงินส่วนต่าง</Label>
              <Input
                placeholder='เพิ่มยอดเงินส่วนต่าง'
                options={[]}
                onChange={(e) => {setProblemValue(e.target.value)}}
                value={problemValue}
              />
            </Col>
          </Row>
        </Box>
        <Box>
          <Label>แนบไฟล์ยอดส่วนต่าง</Label>
          <Dragger {...props}>
            {Object.keys(attachSlip).length === 0 ? 'ไฟล์ยอดส่วนต่าง' : attachSlip?.file?.name}
          </Dragger>
        </Box>
        <Box className='accept-group-btn-wrapper'>
          <Button
            className='accept-btn'
            width='140'
            onClick={handleClick.submitToBill}
          >
            แจ้งงานติดปัญหา
          </Button>
        </Box>
      </DetailLayout>
      <DetailLayout>
        <Label className='title-form'>ประวัติงานติดปัญหา</Label>
        <Box>
          <Row justify='space-between'>
            <Label>หัวข้อ</Label>
            <Label>วันที่</Label>
          </Row>
          <Row justify='center'>
            <Col xs={24} lg={11} style={{ margin: '10px' }}>
              <Box>
                <Label>Remark</Label>
                <TextArea disabled/>
              </Box>
            </Col>
            <Col xs={24} lg={11} style={{ margin: '10px' }}>
              <Box>
                <Label>ตอบกลับ</Label>
                <TextArea />
              </Box>
            </Col>
          </Row>
          <Divider style={{ margin: '5px' }}/>
        </Box>
        <Box>
          <Row justify='space-between'>
            <Label>หัวข้อ</Label>
            <Label>วันที่</Label>
          </Row>
          <Row justify='center'>
            <Col xs={24} lg={11} style={{ margin: '10px' }}>
              <Box>
                <Label>Remark</Label>
                <TextArea disabled/>
              </Box>
            </Col>
            <Col xs={24} lg={11} style={{ margin: '10px' }}>
              <Box>
                <Label>ตอบกลับ</Label>
                <TextArea />
              </Box>
            </Col>
          </Row>
          <Divider style={{ margin: '5px' }}/>
        </Box>
      </DetailLayout>
    </>
	)
}

export default TaxRenew

const idCardAndPassport = (isPassport, setIsPassport) => {
	return (
		<Radio.Group
			value={isPassport ? 'passport' : 'idCard'}
			onChange={(e) =>
				setIsPassport(e.target.value === 'passport' ? true : false)
			}
			options={[
				{
					value: 'idCard',
					label: 'เลขบัตรประชาชน',
				},
				{
					value: 'passport',
					label: `เลขหนังสือเดินทาง`,
				},
			]}
		/>
	)
}

const uploadFileImg = ({
	title,
	nameFile,
	valueFiles,
	handleUpload,
	errors,
	require,
}) => {
	return (
		<Box className='wrapper-files'>
			<Label style={{ paddingBottom: '5px' }}>
				{title} {require && <Span color='red'>*</Span>}
			</Label>
			<UploadFiles
				onTrigger={(img) => {handleUpload(img, title)}}
				maxCount={1}
			/>
			{_.isEmpty(valueFiles) && errors && <Span color='red'>{errors}</Span>}
		</Box>
	)
}