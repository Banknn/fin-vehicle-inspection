import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Modal, Row } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { DetailLayout } from '../Layout'
import {
	calCompulsoryTaxDay,
	calProtectDate,
	convertStrToFormat,
	filterAddress,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	convertCC,
	checkIdCard,
	getYearPrb,
	getSeriesPrb,
	getSubSeriesPrb,
	setFilesSuccess,
	removeStoreCustomer,
	checkRemoveOnSuccess,
} from '../../helpers'
import {
	Box,
	Button,
	DatePickerWithLabel,
	Input,
	Label,
	Radio,
	Select,
	Span,
} from '../../components'
import {
	addressController,
	paymentController,
	systemController,
} from '../../apiServices'
import { loadingAction, customerAction } from '../../actions'

const CarInsurance = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.authenReducer.dataResult)
	const customer = useSelector((state) => state.customerReducer)
	const premistions = useSelector((state) => state.premissionsReducer)
	const dataFilesSuccess = useSelector((state) => state.filesSuccessReducer)
	const [input, setInput] = useState({})
	const [select, setSelect] = useState({})
	const [fieldError, setFieldError] = useState({})
	//-------------------------- INPUT ------------------------------------
	const [brand, setBrand] = useState(null)
	const [year, setYear] = useState(null)
	const [series, setSeries] = useState(null)
	const [subSeries, setSubSeries] = useState(null)
	const [protectedDate, setProtectedDate] = useState()
	const [lastProtectedDate, setLastProtectedDate] = useState()
	const [taxExpireDate, setTaxExpireDate] = useState()
	const [legal, setLegal] = useState('บุคคลทั่วไป')
	const [camera, setCamera] = useState('no')
	const [addressDeliveryRadio, setAddressDeliveryRadio] = useState(
		'addressSameInsurance'
	)
	const [workType, setWorkType] = useState('N')
	const [isPassport, setIsPassport] = useState(false)
	const [fetchDataFirst, setFetchDataFirst] = useState(false)
	//-------------------------- LIST ------------------------------------
	const [brandList, setBrandList] = useState([])
	const [, setBrandListAxaCmi] = useState([])
	const [brandListAxaIns, setBrandListAxaIns] = useState([])
	const [brandListIntraV2, setBrandListIntraV2] = useState([])
	const [brandListJaymart, setBrandListJaymart] = useState([])
	const [brandListThaisri, setBrandListThaisri] = useState([])
	const [brandListDhipaya, setBrandListDhipaya] = useState([])
	const [brandListThaiSetakij, setBrandListThaiSetakij] = useState([])
	const [brandListKwi, setBrandListKwi] = useState([])
	const [brandListChubb, setBrandListChubb] = useState([])
	const [brandListViriyaIns, setBrandListViriyaIns] = useState([])
	const [yearList, setYearList] = useState([])
	const [seriesList, setSeriesList] = useState([])
	const [subSeriesList, setSubSeriesList] = useState([])
	const [carCodeList, setCarCodeList] = useState([])
	const [titleList, setTitleList] = useState([])
	const [carTypeList, setCarTypeList] = useState([])
	const [companyInsuranceList, setCompanyInsuranceList] = useState([])
	const [companyList, setCompanyList] = useState([])
	const [compulsoryTypeList, setCompulsoryTypeList] = useState([])
	const [insureTypeList, setInsureTypeList] = useState([])
	const [colorList, setColorList] = useState([])
	const [nationalKwiList, setNationalKwiList] = useState([])
	const [address, setAddress] = useState({
		addressList: [],
		provinceList: [],
		amphoeList: [],
		districtList: [],
		zipcodeList: [],
	})
	const [addressDeliveryList, setAddressDeliveryList] = useState({
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

	const handleChangeNumInput = (e) => {
		const { name, value } = e.currentTarget
		setInput({ ...input, [name]: value.replace(/[^0-9.]/gi, '') })
	}

	const fetchData = useCallback(async () => {
		if (await checkRemoveOnSuccess(dataFilesSuccess)) {
			removeStoreCustomer()
			setFilesSuccess('')
		} else {
			if (!_.isEmpty(customer) && !fetchDataFirst) {
				setFetchDataFirst(true)
				dispatch(loadingAction(true))
				if (customer.quoNum) {
					const API = systemController()
					const res = await API.getPlanByQuoVif(customer.quoNum)
					if (isValidResponse(res)) {
						const data = res.result[0]
						console.log(data)
						const checkCompanyTrue =
							data.company === 'แอกซ่าประกันภัย' ||
							data.company === 'ไทยศรีประกันภัย' ||
							data.company === 'ทิพยประกันภัย' ||
							data.company === 'วิริยะประกันภัย' ||
							data.company === 'ชับบ์สามัคคีประกันภัย' ||
							data.company === 'เคดับบลิวไอประกันภัย'
						setInput((e) => ({
							...e,
							insurePrice:
								customer.amountNew || data.amount_inc.replace(',', ''),
							insureNet: data.amount,
							newInsureBudget: data.assured_insurance_capital1,
							vehicleRegistrationNumber: data.idcar,
							idCard: data.idcard,
							name: data.name,
							lastname: data.lastname,
							engineCC: data.cc_car,
							carWeight: data.weight_car,
							tel: data.tel === '-' ? '' : data.tel,
							damage1: data.deductible,
							damage2: data.respon1,
							damage3: data.respon2,
							damage4: data.respon3,
							damage5: data.respon4,
							damage6: data.respon5,
							damage7: data.respon6,
							damage8: data.respon7,
							engineNo: data.id_motor1,
							chassisSerialNumber: data.id_motor2,
							addressInsurance: customer.input?.addressInsurance,
							roadInsurance: customer.input?.roadInsurance,
							soiInsurance: customer.input?.soiInsurance,
							addressDelivery: data.addressnew,
							receiver: data.nameaddressnew,
							telDelivery: data.telnew,
							policyNo: customer.input?.policyNo,
						}))
						setSelect((e) => ({
							...e,
							companyInsurance: data.company,
							companyCompulsory:
								customer.customerType === 'old' ? null : data.company_prb,
							compulsoryType:
								customer.customerType === 'old' ? null : data.prb_type,
							registerYear: data.registerYear,
							carCode: data.no_car,
							title: data?.title,
							gender: data.gender,
							birthDay: data.birthDate
								? moment(data.birthDate).format('DD')
								: null,
							birthMonth: data.birthDate
								? moment(data.birthDate).format('MM')
								: null,
							birthYear: data.birthDate
								? moment(data.birthDate).format('YYYY')
								: null,
							insuranceType:
								data.type && data.repair_type
									? `ชั้น ${data.type} ${data.repair_type}`
									: null,
							carType: data.car_type,
							bodyType: data.vehBodyTypeDesc,
							colorCar: customer.select?.colorCar,
							seat: data.seatingCapacity,
							vehicleRegistrationArea: data.carprovince,
							amphoeInsurance: data.amphoe,
							amphoeDelivery: data.amphoenew,
							districtInsurance: data.district,
							districtDelivery: data.districtnew,
							provinceInsurance: data.province,
							provinceDelivery: data.provincenew,
							zipcodeInsurance: data.zipcode,
							zipcodeDelivery: data.zipcodenew,
						}))
						setBrand(checkCompanyTrue ? null : customer.brand || data.brandplan)
						setYear(checkCompanyTrue ? null : customer.year || data.yearplan)
						setSeries(
							checkCompanyTrue ? null : customer.series || data.seriesplan
						)
						setSubSeries(
							checkCompanyTrue
								? null
								: customer.subSeries || data.sub_seriesplan
						)
						setLegal(legal || 'บุคคลทั่วไป')
						setCamera(data.camera || 'no')
						setProtectedDate(
							customer?.policyNoOld
								? moment(data.date_exp)
								: data.date_warranty
								? moment(data.date_warranty)
								: moment()
						)
						setLastProtectedDate(
							customer?.policyNoOld
								? moment(data.date_exp).add(1, 'years')
								: data.date_exp
								? moment(data.date_exp)
								: moment().add(1, 'years')
						)
						setTaxExpireDate(
							customer?.policyNoOld
								? moment(data.date_exp).add(1, 'years')
								: data.date_exp
								? moment(data.date_exp)
								: moment().add(1, 'years')
						)
						setWorkType(customer?.policyNoOld ? 'R' : customer?.workType || 'N')
						setIsPassport(customer.isPassport)
						const getYear = await getYearPrb(
							customer.select?.companyCompulsory,
							customer.brand || data.brandplan
						)
						const getSeries = await getSeriesPrb(
							customer.select?.companyCompulsory,
							customer.brand,
							customer.year || data.yearplan
						)
						const getSubSeries = await getSubSeriesPrb(
							customer.select?.companyCompulsory,
							customer.brand || data.brandplan,
							customer.year || data.yearplan,
							customer.series || data.seriesplan
						)
						Promise.all([
							getYear,
							getSeries,
							getSubSeries,
							LIST.CAR_TYPE_PRB(),
						]).then((e) => {
							setYearList(e[0])
							setSeriesList(e[1])
							setSubSeriesList(e[2])
							if (data.prb_type) {
								const type = e[3].find((e) => e.prb_type_code === data.prb_type)
								const { duty_tax_price, net_price } = type
								const netPrice = +net_price.replace(',', '')
								const duty = +duty_tax_price.replace(',', '')
								const price = calCompulsoryTaxDay(
									netPrice,
									calProtectDate(
										moment(data.date_warranty),
										moment(data.date_exp),
										data.company_prb
									),
									customer.select?.companyCompulsory
								)
								setInput((e) => ({
									...e,
									compulsoryPrice: {
										netPrice,
										duty,
										price,
									},
								}))
							}
						})
						dispatch(loadingAction(false))
					}
				} else {
					setInput(customer.input)
					setSelect(customer.select)
					setBrand(customer.brand)
					setYear(customer.year)
					setSeries(customer.series)
					setSubSeries(customer.subSeries)
					setProtectedDate(moment(customer.protectedDate))
					setLastProtectedDate(moment(customer.lastProtectedDate))
					setTaxExpireDate(moment(customer.taxExpireDate))
					setLegal(customer.legal)
					setCamera(customer.camera || 'no')
					setIsPassport(customer.isPassport)
					setAddressDeliveryRadio(
						customer?.addressDeliveryRadio || 'addressSameInsurance'
					)
					setWorkType(customer?.workType || 'N')
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
					dispatch(loadingAction(false))
				}
			}
			if (_.isEmpty(customer) && !fetchDataFirst) {
				setProtectedDate(moment())
				setLastProtectedDate(moment().add(1, 'years'))
				setTaxExpireDate(moment().add(1, 'years'))
				setFetchDataFirst(true)
			}
		}
	}, [dispatch, customer, fetchDataFirst, legal, dataFilesSuccess])

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
			setAddressDeliveryList((e) => {
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
						provinceDelivery:
							addressDeliveryRadio === 'addressSameInsurance' ? value : null,
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
						amphoeDelivery:
							addressDeliveryRadio === 'addressSameInsurance' ? value : null,
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
						districtDelivery:
							addressDeliveryRadio === 'addressSameInsurance' ? value : null,
						zipcodeDelivery:
							addressDeliveryRadio === 'addressSameInsurance'
								? zipcode[0].value
								: null,
					}
				}
			})
		}
	}

	const handleChangeSecondAddress = (v, e, obj) => {
		const { name, value } = obj
		setSelect({ ...select, [name]: value })
		if (name === 'provinceDelivery') {
			const amphoe = filterAddress('province', value, address)
			setAddressDeliveryList({ ...addressDeliveryList, amphoeList: amphoe })
			setSelect((prev) => {
				if (prev.provinceDelivery !== select.provinceDelivery) {
					return {
						...select,
						provinceDelivery: value,
						amphoeDelivery: null,
						districtDelivery: null,
						zipcodeDelivery: null,
					}
				}
			})
		}
		if (name === 'amphoeDelivery') {
			const district = filterAddress('amphoe', value, address)
			setAddressDeliveryList({ ...addressDeliveryList, districtList: district })
			setSelect((prev) => {
				if (prev.amphoeDelivery !== select.amphoeDelivery) {
					return {
						...select,
						amphoeDelivery: value,
						districtDelivery: null,
						zipcodeDelivery: null,
					}
				}
			})
		}
		if (name === 'districtDelivery') {
			const zipcode = filterAddress('district', value, address, select)
			setAddressDeliveryList({ ...addressDeliveryList, zipcodeList: zipcode })
			setSelect((prev) => {
				if (prev.districtDelivery !== select.districtDelivery) {
					return {
						...select,
						districtDelivery: value,
						zipcodeDelivery: zipcode[0].value,
					}
				}
			})
		}
	}

	const handleChangeAddressDeliveryRadio = (e) => {
		const { value } = e.target
		setAddressDeliveryRadio(value)
		if (value === 'addressSameInsurance') {
			setInput({
				...input,
				addressDelivery: input?.addressInsurance,
			})
			setSelect({
				...select,
				provinceDelivery: select?.provinceInsurance,
				amphoeDelivery: select?.amphoeInsurance,
				districtDelivery: select?.districtInsurance,
				zipcodeDelivery: select?.zipcodeInsurance,
			})
		} else if (value === 'newAddress') {
			setInput({
				...input,
				addressDelivery: null,
				receiver: null,
				telDelivery: null,
			})
			setSelect({
				...select,
				provinceDelivery: null,
				amphoeDelivery: null,
				districtDelivery: null,
				zipcodeDelivery: null,
			})
		} else if (value === 'addressInspection') {
			setInput({
				...input,
				receiver: user.name,
				telDelivery: user.tel,
				addressDelivery: user.address,
			})
			setSelect({
				...select,
				provinceDelivery: user.province,
				amphoeDelivery: user.city,
				districtDelivery: user.district,
				zipcodeDelivery: user.postcode,
			})
		}
	}

	useEffect(() => {
		fetchData()
		fetchAddress()
		Promise.all([
			LIST.CAR_BRAND(),
			LIST.CAR_TYPE(),
			LIST.CAR_TYPE_PRB(),
			LIST.COMPANY_INSURE_BRAND(),
			LIST.COMPANY_PRB_BRAND(),
			LIST.INSURE_TYPE(),
			LIST.CAR_CODE(),
			LIST.CAR_BRAND_Jaymart(),
			LIST.CAR_BRAND_THAISRI_INS(),
			LIST.CAR_BRAND_INTRA_V2(),
			LIST.CAR_BRAND_DHIPAYA(),
			LIST.CAR_BRAND_AXA_CMI(),
			LIST.CAR_BRAND_THAISETAKIJ(),
			LIST.CAR_BRAND_KWI(),
			LIST.CAR_BRAND_AXA_INS(),
			LIST.CAR_BRAND_CHUBB(),
			LIST.COLORCARAXA(),
			LIST.CAR_BRAND_VIRIYA_INS(),
			LIST.NATIONALKWI(),
		]).then((e) => {
			setBrandList(e[0])
			setCarTypeList(e[1])
			setCompulsoryTypeList(e[2])
			setCompanyInsuranceList(e[3])
			setCompanyList(e[4])
			setInsureTypeList(e[5])
			setCarCodeList(e[6])
			setBrandListJaymart(e[7])
			setBrandListThaisri(e[8])
			setBrandListIntraV2(e[9])
			setBrandListDhipaya(e[10])
			setBrandListAxaCmi(e[11])
			setBrandListThaiSetakij(e[12])
			setBrandListKwi(e[13])
			setBrandListAxaIns(e[14])
			setBrandListChubb(e[15])
			setColorList(e[16])
			setBrandListViriyaIns(e[17])
			setNationalKwiList(e[18])
		})
	}, [fetchData, fetchAddress])

	useEffect(() => {
		Promise.all([LIST.TITLE(legal)]).then((e) => {
			setTitleList(e[0])
		})
	}, [legal])

	const getBrandList = () => {
		if (select?.companyInsurance === 'ไทยศรีประกันภัย') {
			return brandListThaisri
		} else if (
			select?.companyInsurance === 'ชับบ์สามัคคีประกันภัย' ||
			select?.companyCompulsory === 'ชับบ์สามัคคีประกันภัย'
		) {
			return brandListChubb
		} else if (
			select?.companyInsurance === 'แอกซ่าประกันภัย' ||
			select?.companyCompulsory === 'แอกซ่าประกันภัย'
		) {
			return brandListAxaIns
		} else if (
			select?.companyInsurance === 'ทิพยประกันภัย' ||
			select?.companyCompulsory === 'ทิพยประกันภัย'
		) {
			return brandListDhipaya
		} else if (select?.companyInsurance === 'วิริยะประกันภัย') {
			return brandListViriyaIns
		} else if (select?.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)') {
			return brandListJaymart
		} else if (select?.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)') {
			return brandListIntraV2
		} else if (select?.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย') {
			return brandListThaiSetakij
		} else if (select?.companyInsurance === 'เคดับบลิวไอประกันภัย') {
			return brandListKwi
		} else {
			return brandList
		}
	}

	const getYearList = (value) => {
		if (select?.companyInsurance === 'ไทยศรีประกันภัย') {
			return LIST.CAR_YEAR_THAISRI_INS(value).then((e) => {
				setYearList(e)
			})
		} else if (select?.companyInsurance === 'ชับบ์สามัคคีประกันภัย') {
			return LIST.CAR_YEAR_CHUBB(value).then((e) => setYearList(e))
		} else if (select?.companyInsurance === 'แอกซ่าประกันภัย') {
			return LIST.CAR_YEAR_AXA_INS(value).then((e) => setYearList(e))
		}
		// else if (select?.companyInsurance === 'วิริยะประกันภัย') {
		// 	return LIST.CAR_YEAR_VIRIYA_INS(value).then((e) => setYearList(e))
		// }
		else {
			return LIST.CAR_YEAR(value).then((e) => setYearList(e))
		}
	}

	const getSeriesList = (value) => {
		if (select?.companyInsurance === 'ไทยศรีประกันภัย') {
			return LIST.CAR_SERIES_THAISRI_INS(brand, value).then((e) =>
				setSeriesList(e)
			)
		} else if (
			select?.companyInsurance === 'ทิพยประกันภัย' ||
			select?.companyCompulsory === 'ทิพยประกันภัย'
		) {
			return LIST.CAR_SERIES_DHIPAYA(brand).then((e) => setSeriesList(e))
		} else if (
			select?.companyInsurance === 'ชับบ์สามัคคีประกันภัย' ||
			select?.companyCompulsory === 'ชับบ์สามัคคีประกันภัย'
		) {
			return LIST.CAR_SERIES_CHUBB(brand, value).then((e) => setSeriesList(e))
		} else if (select?.companyInsurance === 'วิริยะประกันภัย') {
			return LIST.CAR_SERIES_VIRIYA_INS(brand).then((e) => setSeriesList(e))
		} else if (select?.companyInsurance === 'แอกซ่าประกันภัย') {
			return LIST.CAR_SERIES_AXA_INS(brand, value).then((e) => setSeriesList(e))
		} else if (select?.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)') {
			return LIST.CAR_SERIES_Jaymart(brand, value).then((e) => setSeriesList(e))
		} else if (select?.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)') {
			return LIST.CAR_SERIES_INTRA_V2(brand).then((e) => setSeriesList(e))
		} else if (select?.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย') {
			return LIST.CAR_SERIES_THAISETAKIJ(brand).then((e) => setSeriesList(e))
		} else if (select?.companyInsurance === 'เคดับบลิวไอประกันภัย') {
			return LIST.CAR_SERIES_KWI(brand).then((e) => setSeriesList(e))
		} else {
			return LIST.CAR_SERIES(brand, value).then((e) => setSeriesList(e))
		}
	}

	const getSubSeriesList = (value) => {
		if (select?.companyInsurance === 'ไทยศรีประกันภัย') {
			return LIST.CAR_SUB_SERIES_THAISRI_INS(brand, value, year).then((e) =>
				setSubSeriesList(e)
			)
		} else if (
			select?.companyInsurance === 'ทิพยประกันภัย' ||
			select?.companyCompulsory === 'ทิพยประกันภัย'
		) {
			return LIST.CAR_SUB_SERIES_DHIPAYA(value).then((e) => setSubSeriesList(e))
		} else if (select?.companyInsurance === 'วิริยะประกันภัย') {
			return LIST.CAR_SUB_SERIES_VIRIYA_INS(brand, value).then((e) => {
				setSubSeriesList(e)
			})
		} else if (select?.companyInsurance === 'แอกซ่าประกันภัย') {
			return LIST.CAR_SUB_SERIES_AXA_INS(brand, year, value).then((e) => {
				setSubSeriesList(e)
			})
		} else {
			return LIST.CAR_SUB_SERIES(brand, year, value).then((e) =>
				setSubSeriesList(e)
			)
		}
	}

	const getBrandTitle = (company) => {
		switch (company) {
			case 'แอกซ่าประกันภัย':
				return brandListAxaIns.find((e) => e.value === brand)
			case 'วิริยะประกันภัย':
				return brandListViriyaIns.find((e) => e.value === brand)
			case 'ไทยศรีประกันภัย':
				return brandListThaisri.find((e) => e.value === brand)
			case 'เจมาร์ทประกันภัย (เจพี)':
				return brandListJaymart.find((e) => e.value === brand)
			case 'อินทรประกันภัย(สาขาสีลม)':
				return brandListIntraV2.find((e) => e.value === brand)
			case 'ทิพยประกันภัย':
				return brandListDhipaya.find((e) => e.value === brand)
			case 'ไทยเศรษฐกิจประกันภัย':
				return brandListThaiSetakij.find((e) => e.value === brand)
			case 'เคดับบลิวไอประกันภัย':
				return brandListKwi.find((e) => e.value === brand)
			case 'ชับบ์สามัคคีประกันภัย':
				return brandListChubb.find((e) => e.value === brand)
			default:
				return brandList.find((e) => e.value === brand)
		}
	}

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
		// if (!select.registerYear) {
		// 	formIsValid = false
		// 	errors['registerYear'] = 'กรุณาเลือกปีที่จดทะเบียนรถ'
		// }
		if (!series) {
			formIsValid = false
			errors['series'] =
				brand !== 'none' ? 'กรุณาเลือกรุ่นรถ' : 'กรุณาระบุรุ่นรถ'
		}
		if (series === 'none' && !input.seriesOther) {
			formIsValid = false
			errors['seriesOther'] = 'กรุณาระบุรุ่นรถ'
		}
		if (
			!subSeries &&
			[
				'ไทยศรีประกันภัย',
				'ทิพยประกันภัย',
				'แอกซ่าประกันภัย',
				'วิริยะประกันภัย',
			].includes(select.companyInsurance)
		) {
			formIsValid = false
			errors['subSeries'] = 'กรุณาระบุรุ่นย่อยรถ'
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
		if (
			!select.colorCar &&
			['ชับบ์สามัคคีประกันภัย'].includes(select?.companyInsurance)
		) {
			formIsValid = false
			errors['colorCar'] = 'กรุณาเลือกสีรถ'
		}
		if (!select.seat) {
			formIsValid = false
			errors['seat'] = 'กรุณาเลือกจำนวนที่นั่ง'
		}
		if (!input.engineCC) {
			formIsValid = false
			errors['engineCC'] = 'กรุณาระบุเครื่องยนต์ (CC)'
		}
		if (!input.carWeight) {
			formIsValid = false
			errors['carWeight'] = 'กรุณาระบุน้ำหนักรถ'
		}
		if (!input.chassisSerialNumber) {
			formIsValid = false
			errors['chassisSerialNumber'] = 'กรุณาระบุเลขตัวถัง'
		}
		if (!select.carCode) {
			formIsValid = false
			errors['carCode'] = 'กรุณาเลือกรหัสรถยนต์'
		}
		if (!input.policyNo && workType === 'R') {
			formIsValid = false
			errors['policyNo'] = 'กรุณาระบุเลขกรมเดิม'
		}
		if (!select.title) {
			formIsValid = false
			errors['title'] = 'กรุณาระบุคำนำหน้า'
		}
		if (!input.name) {
			formIsValid = false
			errors['name'] = 'กรุณาระบุชื่อ'
		}
		if (!input.lastname && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['lastname'] = 'กรุณาระบุนามสกุล'
		}
		if (!select.gender && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['gender'] = 'กรุณาระบุเพศ'
		}
		if (!select.birthDay && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['birthDay'] = 'กรุณาเลือกวันเกิด'
		}
		if (!select.birthMonth && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['birthMonth'] = 'กรุณาเลือกเดือนเกิด'
		}
		if (!select.birthYear && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['birthYear'] = 'กรุณาเลือกปีเกิด'
		}
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
			!select?.national &&
			isPassport &&
			['เคดับบลิวไอประกันภัย'].includes(select?.companyInsurance)
		) {
			formIsValid = false
			errors['national'] = 'กรุณาเลือกเพศสัญชาติ'
		}
		if (!input.tel) {
			formIsValid = false
			errors['tel'] = 'กรุณาระบุเบอร์โทรศัพท์'
		}
		if (!input.addressInsurance) {
			formIsValid = false
			errors['addressInsurance'] = 'กรุณาระบุที่อยู่'
		}
		if (!select.provinceInsurance) {
			formIsValid = false
			errors['provinceInsurance'] = 'กรุณาระบุจังหวัด'
		}
		if (!select.amphoeInsurance) {
			formIsValid = false
			errors['amphoeInsurance'] = 'กรุณาระบุเขต/อำเภอ'
		}
		if (!select.districtInsurance) {
			formIsValid = false
			errors['districtInsurance'] = 'กรุณาระบุแขวง/ตำบล'
		}
		if (!select.zipcodeInsurance) {
			formIsValid = false
			errors['zipcodeInsurance'] = 'กรุณาระบุรหัสไปรษณีย์'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!select.title &&
				!input.name &&
				!input.lastname) ||
			(addressDeliveryRadio === 'newAddress' && !input.receiver)
		) {
			formIsValid = false
			errors['receiver'] = 'กรุณาระบุชื่อผู้รับ'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' && !input.tel) ||
			(addressDeliveryRadio === 'newAddress' && !input.telDelivery)
		) {
			formIsValid = false
			errors['telDelivery'] = 'กรุณาระบุเบอร์โทรศัพท์'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!input.addressInsurance) ||
			(addressDeliveryRadio === 'newAddress' && !input.addressDelivery)
		) {
			formIsValid = false
			errors['addressDelivery'] = 'กรุณาระบุที่อยู่'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!select?.provinceInsurance) ||
			(addressDeliveryRadio === 'newAddress' && !select?.provinceDelivery)
		) {
			formIsValid = false
			errors['provinceDelivery'] = 'กรุณาระบุจังหวัด'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!select?.amphoeInsurance) ||
			(addressDeliveryRadio === 'newAddress' && !select?.amphoeDelivery)
		) {
			formIsValid = false
			errors['amphoeDelivery'] = 'กรุณาระบุเขต/อำเภอ'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!select?.districtInsurance) ||
			(addressDeliveryRadio === 'newAddress' && !select?.districtDelivery)
		) {
			formIsValid = false
			errors['districtDelivery'] = 'กรุณาระบุแขวง/ตำบล'
		}
		if (
			(addressDeliveryRadio === 'addressSameInsurance' &&
				!select?.zipcodeInsurance) ||
			(addressDeliveryRadio === 'newAddress' && !select?.zipcodeDelivery)
		) {
			formIsValid = false
			errors['zipcodeDelivery'] = 'กรุณาระบุรหัสไปรษณีย์'
		}
		if (!select.companyInsurance) {
			formIsValid = false
			errors['companyInsurance'] = 'กรุณาเลือกบริษัทประกัน'
		}
		if (!select.insuranceType) {
			formIsValid = false
			errors['insuranceType'] = 'กรุณาเลือกประเภทประกัน'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const getNationalList = () => {
		switch (select?.companyInsurance) {
			case 'เคดับบลิวไอประกันภัย':
				return nationalKwiList || []
			default:
				return nationalKwiList || []
		}
	}

	const getCompulsoryTypeList = () => {
		const cTypeListThaiSet = [
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
		const cTypeListViriya = [
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
		if (select?.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย') {
			return compulsoryTypeList.filter(
				(e) => !cTypeListThaiSet.includes(e.prb_type_code)
			)
		} else if (select?.companyCompulsory === 'วิริยะประกันภัย') {
			return compulsoryTypeList.filter(
				(e) => !cTypeListViriya.includes(e.prb_type_code)
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

	const handleClick = {
		checkDuplicate: async () => {
			const id_motor2 = input?.chassisSerialNumber
			const params = {
				id_motor2,
				type: 'CMI',
				date_warranty: moment(protectedDate).format('YYYY-MM-DD'),
				company: select?.companyCompulsory,
				type_work: workType,
			}
			const API = systemController()
			const res = await API.checkDuplicateVif(params)
			if (isValidResponse(res) && select?.companyCompulsory) {
				const { check_same, msg } = res.result
				if (check_same) {
					dispatch(loadingAction(false))
					Modal.error({
						title: 'ไม่สามารถบันทึกได้',
						content: msg,
					})
					return false
				} else {
					return true
				}
			} else {
				return true
			}
		},
		submit: async () => {
			const {
				insurePrice,
				newInsureBudget,
				engineCC,
				vehicleRegistrationNumber,
				idCard,
				name,
				damage1,
				damage2,
				damage3,
				damage4,
				damage5,
				damage6,
				damage7,
				damage8,
				lastname,
				tel,
				compulsoryPrice,
				addressInsurance,
				carWeight,
				chassisSerialNumber,
				engineNo,
				roadInsurance,
				soiInsurance,
				addressDelivery,
			} = input
			const {
				carType,
				vehicleRegistrationArea,
				companyInsurance,
				carCode,
				birthYear,
				birthMonth,
				birthDay,
				insuranceType,
				gender,
				compulsoryType,
				registerYear,
				seat,
				title,
				bodyType,
				provinceInsurance,
				amphoeInsurance,
				districtInsurance,
				zipcodeInsurance,
				provinceDelivery,
				amphoeDelivery,
				districtDelivery,
				zipcodeDelivery,
				companyCompulsory,
				national,
			} = select
			const prbPrice = calCompulsoryTaxDay(
				compulsoryPrice?.netPrice,
				calProtectDate(protectedDate, lastProtectedDate, companyCompulsory),
				companyCompulsory
			)
			const companyInsure = companyInsuranceList.find(
				(e) => e.value === companyInsurance
			)
			const companyPrbTitle = companyList.find(
				(e) => e.value === companyCompulsory
			)
			const brandTitle = getBrandTitle(
				companyInsurance === 'ไทยศรีประกันภัย' ||
					companyInsurance === 'ทิพยประกันภัย'
					? companyInsurance
					: companyCompulsory
			)
			const nationalTitle = getNationalList().find((e) => e.value === national)
			const yearTitle = yearList.find((e) => e.value === +year)
			const seriesTitle = seriesList.find((e) => e.value === series)
			const subSeriesTitle = subSeriesList.find((e) => e.value === subSeries)
			const carCodeTitle = carCodeList.find((e) => e.value === carCode)
			const insureType = insureTypeList.find((e) => e.value === insuranceType)
			const carTypeTitle = carTypeList.find((e) => e.value === carType)
			const compulsoryTypeTitle = compulsoryTypeList.find(
				(e) => e.value === compulsoryType
			)
			const insureNet = Number(Number(insurePrice) / 1.0743).toFixed(2)
			const params = {
				quo_num:
					(customer?.policyNoOld && !dataFilesSuccess.type) ||
					(workType === 'R' && !dataFilesSuccess.type)
						? ''
						: customer.quoNum,
				amount: insureNet,
				amount_inc: insurePrice,
				amount_inc_prb: Number(Number(prbPrice) + Number(insurePrice)).toFixed(
					2
				),
				assured_insurance_capital1: newInsureBudget?.replace(',', '') || 0,
				birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
				brandplan: brand === 'none' ? brand : brandTitle?.text,
				camera,
				car_type: carType,
				carprovince: vehicleRegistrationArea,
				cc_car: convertCC(engineCC),
				company: companyInsure?.company_name,
				company_prb: companyPrbTitle?.company_name || null,
				deductible: damage1 || 0,
				gender,
				idcar: vehicleRegistrationNumber,
				idcard: idCard,
				name,
				no_car:
					carCode === '110.1' ? '110' : carCode === '320.1' ? '320' : carCode,
				policyStatus: workType,
				priceprb: prbPrice,
				prb: compulsoryPrice > 0 ? 'yeson' : 'no',
				prb_type: compulsoryType,
				registerYear: registerYear,
				repair_type: insureType?.repairType,
				respon1: damage2 || 0,
				respon2: damage3 || 0,
				respon3: damage4 || 0,
				respon4: damage5 || 0,
				respon5: damage6 || 0,
				respon6: damage7 || 0,
				respon7: damage8 || 0,
				seatingCapacity: seat,
				insuredType: legal === 'บุคคลทั่วไป' ? '1' : '2',
				isPassport,
				seriesplan:
					brand === 'none' || series === 'none' ? series : seriesTitle.text,
				sub_seriesplan: subSeriesTitle?.text || null,
				lastname: lastname,
				tel: tel === null ? null : tel.replace(/-/g, ''),
				title,
				type: insureType?.type,
				type_work: workType === 'N' ? 'งานใหม่' : 'งานต่ออายุ',
				type_insure: 'ตรอ',
				vehBodyTypeDesc: bodyType,
				weight_car: carWeight,
				yearplan: brand === 'none' || year === 'none' ? year : yearTitle?.text,
				status: 'wait',
				id_key: premistions.cuscode,

				// pay
				nameaddressnew:
					addressDeliveryRadio === 'addressSameInsurance'
						? select?.title &&
						  input.name &&
						  input.lastname &&
						  `${select?.title} ${input?.name} ${input?.lastname}`
						: input?.receiver,
				address:
					companyCompulsory === 'วิริยะประกันภัย' ||
					companyCompulsory === 'แอกซ่าประกันภัย'
						? `${addressInsurance} ${roadInsurance || ''} ${soiInsurance || ''}`
						: addressInsurance,
				addressnew:
					addressDeliveryRadio === 'addressSameInsurance'
						? companyCompulsory === 'วิริยะประกันภัย' ||
						  companyCompulsory === 'แอกซ่าประกันภัย'
							? `${addressInsurance} ${roadInsurance || ''} ${
									soiInsurance || ''
							  }`
							: addressInsurance
						: addressDelivery,
				amphoe: amphoeInsurance,
				amphoenew:
					addressDeliveryRadio === 'addressSameInsurance'
						? amphoeInsurance
						: amphoeDelivery,
				chanel: 'เข้าฟิน',
				date_warranty: moment(protectedDate).format('YYYY-MM-DD'),
				date_exp: moment(lastProtectedDate).format('YYYY-MM-DD'),
				district: districtInsurance,
				districtnew:
					addressDeliveryRadio === 'addressSameInsurance'
						? districtInsurance
						: districtDelivery,
				id_motor1: engineNo,
				id_motor2: chassisSerialNumber,
				province: provinceInsurance,
				provincenew:
					addressDeliveryRadio === 'addressSameInsurance'
						? provinceInsurance
						: provinceDelivery,
				sendtype:
					addressDeliveryRadio === 'addressSameInsurance'
						? 'ที่อยู่ตามกรมธรรม์'
						: addressDeliveryRadio === 'newAddress'
						? 'ที่อยู่ใหม่'
						: 'ที่อยู่ ตรอ.',
				show_price_ins: Number(insurePrice).toFixed(2),
				show_price_prb: Number(prbPrice).toFixed(2),
				show_price_total: Number(insurePrice) + Number(prbPrice),
				telnew:
					addressDeliveryRadio === 'addressSameInsurance'
						? input?.tel
						: input?.telDelivery,
				zipcode: zipcodeInsurance,
				zipcodenew:
					addressDeliveryRadio === 'addressSameInsurance'
						? zipcodeInsurance
						: zipcodeDelivery,
				tax_expire_date: moment(taxExpireDate).format('YYYY-MM-DD'),
				level_vif: user.level_vif,
				fin_sale: user.fin_sale,
			}

			let updatedCustomer = {
				input,
				select,
				brand,
				year,
				series,
				subSeries,
				protectedDate,
				lastProtectedDate,
				taxExpireDate,
				legal,
				camera,
				addressDeliveryRadio,
				companyCompulsory,
				prbPrice,
				workType,
				isPassport,
				carCodeTitle: carCodeTitle?.text,
				repairType: insureType?.repairType,
				insureType: insureType?.type,
				amount_inc: insurePrice,
				amount: insureNet,
				carType: carTypeTitle.text,
				compulsoryType: compulsoryTypeTitle?.text || null,
				receiver:
					addressDeliveryRadio === 'addressSameInsurance'
						? select?.title &&
						  input.name &&
						  input.lastname &&
						  `${select?.title} ${input?.name} ${input?.lastname}`
						: input?.receiver,
				telDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? input?.tel
						: input?.telDelivery,
				addressDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? addressInsurance
						: addressDelivery,
				amphoeDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? amphoeInsurance
						: amphoeDelivery,
				districtDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? districtInsurance
						: districtDelivery,
				provinceDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? provinceInsurance
						: provinceDelivery,
				zipcodeDelivery:
					addressDeliveryRadio === 'addressSameInsurance'
						? zipcodeInsurance
						: zipcodeDelivery,
				datestart: moment(new Date()).format('YYYYMMDD HH:mm:ss'),
				contactDate: moment(new Date()).format('YYYYMMDD HH:mm:ss'),
				sendtype:
					addressDeliveryRadio === 'addressSameInsurance'
						? 'ที่อยู่ตามกรมธรรม์'
						: addressDeliveryRadio === 'newAddress'
						? 'ที่อยู่ใหม่'
						: 'ที่อยู่ ตรอ.',
				model: series,
				brandTitle,
				seriesTitle,
				subSeriesTitle,
				bill_num: customer?.bill_num,
				nationalTitle,
			}

			if (await handleClick.checkDuplicate()) {
				const API = systemController()
				const paymentApi = paymentController()

				const res = await API.savePlanKey(params)
				if (isValidResponse(res)) {
					dispatch(loadingAction(true))
					const newQuoNum = res.result.quo_num
					const savePay = await paymentApi.savePay({
						...params,
						quo_num: newQuoNum,
					})
					if (isValidResponse(savePay)) {
						setFilesSuccess(companyCompulsory, companyInsurance)
						dispatch(
							customerAction({
								...updatedCustomer,
								quoNum: newQuoNum,
							})
						)
						return true
					}
				} else {
					Modal.error({
						title: 'ไม่สามารถบันทึกได้',
					})
				}
			}
		},
		submitToBill: async () => {
			if (validateFields()) {
				if (await handleClick.submit()) {
					redirect(ROUTE_PATH.BILL.LINK)
				}
			} else {
				Modal.error({
					title: 'กรุณากรอกให้ครบทุกช่อง',
				})
			}
		},
		submitToTax: () => {},
	}

	const form = [
		{
			section: {
				title: 'ข้อมูลประกันภัย',
				items: [
					{
						label: 'บริษัทประกัน',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
								name='companyInsurance'
								placeholder='บริษัทประกัน'
								options={companyInsuranceList}
								onChange={(v) => {
									setSelect((e) => ({ ...e, companyInsurance: v }))
									setBrand(null)
								}}
								value={select?.companyInsurance}
								error={fieldError.errors?.companyInsurance}
							/>
						),
					},
					{
						label: 'พ.ร.บ. (ถ้าซื้อเพิ่ม)',
						row: true,
						col: 8,
						item: (
							<Select
								name='companyCompulsory'
								placeholder='บริษัทประกัน'
								options={companyList.filter(
									(e) =>
										![
											'แอกซ่าประกันภัย',
											'ไทยศรีประกันภัย',
											'ฟอลคอนประกันภัย',
										].includes(e.value)
								)}
								onChange={(v) =>
									setSelect((e) => ({
										...e,
										companyCompulsory: v,
										compulsoryType: null,
									}))
								}
								value={select?.companyCompulsory}
								error={fieldError.errors?.companyCompulsory}
								allowClear
							/>
						),
					},
					{
						label: 'ประเภทประกันภัย',
						row: true,
						required: true,
						col: 4,
						item: (
							<Select
								name='insuranceType'
								placeholder='ประเภทประกันภัย'
								options={insureTypeList}
								onChange={(v) => setSelect((e) => ({ ...e, insuranceType: v }))}
								value={select?.insuranceType}
								error={fieldError.errors?.insuranceType}
							/>
						),
					},
					{
						label: 'ประเภทงาน',
						row: true,
						required: true,
						col: 4,
						item: (
							<Select
								name='workType'
								placeholder='ประเภทงาน'
								options={[
									{
										value: 'N',
										text: 'งานใหม่',
									},
									{
										value: 'R',
										text: 'งานต่ออายุ',
									},
								]}
								onChange={(v) => {
									if (v === 'R') {
										setProtectedDate(lastProtectedDate)
										setLastProtectedDate(
											moment(lastProtectedDate).add(1, 'years')
										)
									}
									setWorkType(v)
								}}
								value={workType}
								error={fieldError.errors?.workType}
							/>
						),
					},
					{
						label: 'ประเภท พ.ร.บ.',
						row: true,
						col: 10,
						item: (
							<Select
								name='compulsoryType'
								placeholder='ประเภท พ.ร.บ.'
								showSearch
								options={getCompulsoryTypeList()}
								onChange={(value) => {
									let carTypes = null
									const type = compulsoryTypeList.find(
										(e) => e.prb_type_code === value
									)
									if (value === '1.10' || value === '1.10E') {
										carTypes = 'รย.1'
									}
									const { duty_tax_price, net_price } = type
									const netPrice = +net_price.replace(',', '')
									const duty = +duty_tax_price.replace(',', '')
									const price = calCompulsoryTaxDay(
										netPrice,
										calProtectDate(
											protectedDate,
											lastProtectedDate,
											select?.companyCompulsory
										),
										select?.companyCompulsory
									)
									setSelect((e) => ({
										...e,
										compulsoryType: value,
										carType: carTypes,
									}))
									setInput((e) => ({
										...e,
										compulsoryPrice: {
											netPrice,
											duty,
											price,
										},
									}))
								}}
								value={select?.compulsoryType}
								error={fieldError.errors?.compulsoryType}
								disabled={!select?.companyCompulsory}
							/>
						),
					},
					{
						label: 'วันเริ่มคุ้มครอง',
						row: true,
						col: 7,
						item: (
							<DatePickerWithLabel
								name='วันเริ่มคุ้มครอง'
								placeholder='วันเริ่มคุ้มครอง'
								format='DD/MM/YYYY'
								value={protectedDate}
								onChange={(date) => {
									const price = calCompulsoryTaxDay(
										input?.compulsoryPrice?.netPrice,
										calProtectDate(
											date,
											moment(date).add(1, 'years'),
											select?.companyCompulsory
										),
										select?.companyCompulsory
									)
									setProtectedDate(date)
									setLastProtectedDate(moment(date).add(1, 'years'))
									setInput((e) => ({
										...e,
										compulsoryPrice: {
											...input?.compulsoryPrice,
											price,
										},
									}))
								}}
								disabledDate={(d) =>
									d.isBefore(moment().subtract(1, 'days')) ||
									d.isAfter(moment().add(90, 'days'))
								}
							/>
						),
					},
					{
						label: 'วันสิ้นสุดการคุ้มครอง',
						row: true,
						col: 7,
						item: (
							<>
								<DatePickerWithLabel
									name='วันสิ้นสุดการคุ้มครอง'
									placeholder='วันสิ้นสุดการคุ้มครอง'
									format='DD/MM/YYYY'
									value={lastProtectedDate}
									disabled
									onChange={(date) => {
										const price = calCompulsoryTaxDay(
											input?.compulsoryPrice?.netPrice,
											calProtectDate(
												protectedDate,
												date,
												select?.companyCompulsory
											),
											select?.companyCompulsory
										)
										setLastProtectedDate(moment(date))
										setTaxExpireDate(moment(date))
										setInput((e) => ({
											...e,
											compulsoryPrice: {
												...input?.compulsoryPrice,
												price: price,
											},
										}))
									}}
								/>
							</>
						),
					},
					{
						label: 'ราคาประกันเต็ม',
						row: true,
						required: true,
						col: 6,
						item: (
							<Input
								name='insurePrice'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeNumInput}
								value={input?.insurePrice}
							/>
						),
					},
					{
						label: 'ราคาประกันสุทธิ',
						row: true,
						col: 6,
						item: (
							<Input
								name='insureNet'
								addonAfter='บาท'
								placeholder='0.00'
								disabled
								value={convertStrToFormat(
									Number(Number(input?.insurePrice) / 1.0743).toFixed(2),
									'money_digit'
								)}
							/>
						),
					},
					{
						label: 'ราคา พ.ร.บ.',
						row: true,
						col: 6,
						item: (
							<Input
								name='compulsoryPrice'
								addonAfter='บาท'
								placeholder='0.00'
								disabled
								value={
									convertStrToFormat(
										calCompulsoryTaxDay(
											input?.compulsoryPrice?.netPrice,
											calProtectDate(
												protectedDate,
												lastProtectedDate,
												select?.companyCompulsory
											),
											select?.companyCompulsory
										),
										'money_digit'
									) || '0.00'
								}
							/>
						),
					},
					{
						label: 'ราคารวมทั้งหมด',
						row: true,
						col: 6,
						item: (
							<Input
								name='allPrice'
								addonAfter='บาท'
								disabled
								value={
									convertStrToFormat(
										Number(input?.compulsoryPrice?.price || 0) +
											Number(input?.insurePrice || 0),
										'money_digit'
									) || '0.00'
								}
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลรถยนต์',
				items: [
					{
						label: 'ยี่ห้อรถ',
						row: true,
						required: true,
						col: 4,
						item: (
							<>
								<Select
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
						col: 4,
						item:
							brand !== 'none' ? (
								<>
									<Select
										name='year'
										placeholder='ปีรถ'
										showSearch
										options={
											['วิริยะประกันภัย'].includes(select?.companyInsurance)
												? LIST.CAR_YEAR_ALL()
												: yearList
										}
										onChange={(value) => {
											getSeriesList(value)
											setYear(value)
											setSelect((e) => ({
												...e,
												registerYear: value,
											}))
											setSeries(null)
											setSubSeries(null)
											setSubSeriesList([])
										}}
										value={year}
										error={fieldError.errors?.year}
									/>
									{year === 'none' && (
										<Input
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
										name='series'
										placeholder='รุ่นรถ'
										showSearch
										options={seriesList}
										onChange={(value) => {
											getSubSeriesList(value)
											setSeries(value)
											setSubSeries(null)
										}}
										value={series}
										error={fieldError.errors?.series}
									/>
									{series === 'none' && (
										<Input
											name='seriesOther'
											placeholder='รุ่นรถ'
											style={{ marginTop: '15px', marginBottom: '10px' }}
											onChange={(e) => {
												const { value } = e.currentTarget
												setInput({
													...input,
													seriesOther: value.replace(/[^A-Za-z0-9]/gi, ''),
												})
											}}
											value={input?.seriesOther}
											error={fieldError.errors?.seriesOther}
										/>
									)}
								</>
							) : (
								<Input
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
						required: [
							'ไทยศรีประกันภัย',
							'ทิพยประกันภัย',
							'แอกซ่าประกันภัย',
							'วิริยะประกันภัย',
						].includes(select?.companyInsurance),
						col: 6,
						item: (
							<Select
								name='subSeries'
								placeholder='รุ่นย่อยรถ'
								showSearch
								options={subSeriesList}
								onChange={(value) => setSubSeries(value)}
								value={subSeries}
								error={fieldError.errors?.subSeries}
							/>
						),
					},
					{
						label: 'กล้องหน้ารถ',
						row: true,
						col: 4,
						item: (
							<Select
								name='camera'
								placeholder='กล้องหน้ารถ'
								options={[
									{ value: 'yes', text: 'มี' },
									{ value: 'no', text: 'ไม่มี' },
								]}
								onChange={(value) => setCamera(value)}
								value={camera}
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
						col: 4,
						item: (
							<Select
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
						col: 7,
						item: (
							<Select
								name='carType'
								placeholder='ประเภทรถ'
								showSearch
								options={
									['1.10', '1.10E'].includes(select?.compulsoryType)
										? carTypeList.filter((e) => e.value === 'รย.1')
										: carTypeList
								}
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
						col: 5,
						item: (
							<Select
								name='bodyType'
								placeholder='ชนิดรถ'
								showSearch
								options={LIST.BODY_TYPE}
								onChange={(v) => setSelect((e) => ({ ...e, bodyType: v }))}
								value={select?.bodyType}
								error={fieldError.errors?.bodyType}
							/>
						),
					},
					{
						label: 'สีรถ',
						row: true,
						required: true,
						col: 4,
						hide: !['ชับบ์สามัคคีประกันภัย'].includes(select?.companyInsurance),
						item: (
							<Select
								name='colorCar'
								placeholder='สีรถ'
								showSearch
								options={colorList}
								onChange={(v) => setSelect((e) => ({ ...e, colorCar: v }))}
								value={select?.colorCar}
								error={fieldError.errors?.colorCar}
							/>
						),
					},
					{
						label: 'จำนวนที่นั่ง',
						row: true,
						required: true,
						col: 4,
						item: (
							<Select
								name='seat'
								placeholder='จำนวนที่นั่ง'
								showSearch
								options={LIST.SEAT}
								onChange={(v) => setSelect((e) => ({ ...e, seat: v }))}
								value={select?.seat}
								error={fieldError.errors?.seat}
							/>
						),
					},
					{
						label: 'เครื่องยนต์ (CC)',
						row: true,
						required: true,
						col: 4,
						item: (
							<Input
								name='engineCC'
								placeholder='CC'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										engineCC: value.replace(/[^0-9.]+/g, ''),
									})
								}}
								value={input?.engineCC}
								error={fieldError.errors?.engineCC}
							/>
						),
					},
					{
						label: 'น้ำหนักรถ',
						row: true,
						required: true,
						col: 4,
						item: (
							<Input
								name='carWeight'
								placeholder='น้ำหนักรถ'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										carWeight: value.replace(/[^0-9.]+/g, ''),
									})
								}}
								value={input?.carWeight}
								error={fieldError.errors?.carWeight}
							/>
						),
					},
					{
						label: 'เลขตัวถัง',
						row: true,
						required: true,
						col: 6,
						item: (
							<Input
								name='chassisSerialNumber'
								placeholder='เลขตัวถัง'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										chassisSerialNumber: value
											.replace(/[^A-Za-z0-9]/gi, '')
											.toLocaleUpperCase(),
									})
								}}
								value={input?.chassisSerialNumber}
								error={fieldError.errors?.chassisSerialNumber}
							/>
						),
					},
					// {
					// 	label: 'เลขเครื่องยนต์',
					// 	row: true,
					// 	col: 6,
					// 	item: (
					// 		<Input
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
					// 		/>
					// 	),
					// },
					{
						label: 'รหัสรถยนต์',
						row: true,
						required: true,
						col: 6,
						item: (
							<Select
								name='carCode'
								placeholder='รหัสรถยนต์'
								options={carCodeList}
								onChange={(v) => setSelect((e) => ({ ...e, carCode: v }))}
								value={select?.carCode}
								error={fieldError.errors?.carCode}
							/>
						),
					},
					{
						label: 'เลขกรมเดิม',
						row: true,
						required: true,
						col: 6,
						hide: workType !== 'R',
						item: (
							<Input
								name='policyNo'
								placeholder='เลขกรมเดิม'
								onChange={(e) => {
									const { value } = e.currentTarget
									setInput({
										...input,
										policyNo: value
											.replace(/[^A-Za-z0-9]/gi, '')
											.toLocaleUpperCase(),
									})
								}}
								value={input?.policyNo}
								// disabled={customer?.policyNoOld}
								error={fieldError.errors?.policyNo}
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
								name='legal'
								showSearch
								options={LIST.LEGAL}
								onChange={(v) => {
									setLegal(v)
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
								name='title'
								placeholder='คำนำหน้า'
								showSearch
								options={titleList}
								onChange={(v) => setSelect((e) => ({ ...e, title: v }))}
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
								name='name'
								placeholder={legal === 'บุคคลทั่วไป' ? 'ชื่อ' : 'ชื่อบริษัท'}
								onChange={handleChangeInput}
								value={input?.name}
								error={fieldError.errors?.name}
							/>
						),
					},
					{
						label: 'นามสกุล',
						row: true,
						required: true,
						hide: legal === 'บุคคลทั่วไป' ? false : true,
						col: 8,
						item: (
							<Input
								name='lastname'
								placeholder='นามสกุล'
								onChange={handleChangeInput}
								value={input?.lastname}
								error={fieldError.errors?.lastname}
							/>
						),
					},
					{
						label: 'เพศ',
						row: true,
						required: true,
						hide: legal === 'บุคคลทั่วไป' ? false : true,
						col: 4,
						item: (
							<Select
								name='gender'
								placeholder='เพศ'
								options={LIST.GENDER}
								onChange={(v) => setSelect((e) => ({ ...e, gender: v }))}
								value={select?.gender}
								error={fieldError.errors?.gender}
							/>
						),
					},
					{
						label: 'วันเกิด',
						row: true,
						required: true,
						hide: legal === 'บุคคลทั่วไป' ? false : true,
						col: 4,
						item: (
							<Select
								name='birthDay'
								placeholder='วันเกิด'
								showSearch
								options={LIST.DAY}
								onChange={(v) => setSelect((e) => ({ ...e, birthDay: v }))}
								value={select?.birthDay}
								error={fieldError.errors?.birthDay}
							/>
						),
					},
					{
						label: 'เดือนเกิด',
						row: true,
						required: true,
						hide: legal === 'บุคคลทั่วไป' ? false : true,
						col: 8,
						item: (
							<Select
								name='birthMonth'
								placeholder='เดือนเกิด'
								showSearch
								options={LIST.MONTH}
								onChange={(v) => setSelect((e) => ({ ...e, birthMonth: v }))}
								value={select?.birthMonth}
								error={fieldError.errors?.birthMonth}
							/>
						),
					},
					{
						label: 'ปีเกิด',
						row: true,
						required: true,
						hide: legal === 'บุคคลทั่วไป' ? false : true,
						col: 8,
						item: (
							<Select
								name='birthYear'
								placeholder='ปีเกิด'
								showSearch
								options={LIST.YEAR()}
								onChange={(v) => setSelect((e) => ({ ...e, birthYear: v }))}
								value={select?.birthYear}
								error={fieldError.errors?.birthYear}
							/>
						),
					},
					{
						label:
							legal === 'บุคคลทั่วไป'
								? 'เลขบัตรประชาชน/หนังสือเดินทาง'
								: 'เลขที่ผู้เสียภาษี',
						row: true,
						required: true,
						col: legal === 'บุคคลทั่วไป' ? 8 : 4,
						item: (
							<Input
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
								valueCheckErr={!checkIdCard(input.idCard)}
								error={fieldError.errors?.idCard}
							/>
						),
					},
					{
						label: 'สัญชาติ',
						row: true,
						required: true,
						hide: !(
							isPassport &&
							['เคดับบลิวไอประกันภัย'].includes(select?.companyInsurance)
						),
						col: 6,
						item: (
							<Select
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
						required: true,
						col: 4,
						item: (
							<Input
								name='tel'
								placeholder='เบอร์โทรศัพท์'
								onChange={handleChangeInput}
								value={input?.tel}
								error={fieldError.errors?.tel}
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
						col:
							select.companyCompulsory === 'วิริยะประกันภัย' ||
							select.companyCompulsory === 'แอกซ่าประกันภัย'
								? 8
								: 16,
						item: (
							<Input
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
							select.companyCompulsory === 'วิริยะประกันภัย' ||
							select.companyCompulsory === 'แอกซ่าประกันภัย'
								? false
								: true,
						item: (
							<Input
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
							select.companyCompulsory === 'วิริยะประกันภัย' ||
							select.companyCompulsory === 'แอกซ่าประกันภัย'
								? false
								: true,
						item: (
							<Input
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
						required: true,
						col: 8,
						item: (
							<Select
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
				hide: true,
				title: (
					<Box className='d-flex'>
						<Label>ที่อยู่จัดส่ง</Label>
						<Radio.Group
							style={{ marginLeft: '5px' }}
							options={[
								{
									value: 'addressSameInsurance',
									label: 'ที่อยู่เดียวกับที่อยู่หน้ากรมธรรม์',
								},
								{ value: 'newAddress', label: 'ที่อยู่ใหม่' },
								{ value: 'addressInspection', label: 'ที่อยู่ ตรอ.' },
							]}
							value={addressDeliveryRadio}
							onChange={handleChangeAddressDeliveryRadio}
						/>
					</Box>
				),
				items: [
					{
						label: 'ชื่อผู้รับ',
						row: true,
						required: true,
						col: 16,
						item: (
							<Input
								name='receiver'
								placeholder='ชื่อผู้รับ'
								onChange={handleChangeInput}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.title && input.name && input.lastname
											? `${select?.title} ${input?.name} ${input?.lastname}`
											: `${select?.title || ''} ${input?.name || ''}`
										: input?.receiver
								}
								disabled={addressDeliveryRadio !== 'newAddress'}
								error={fieldError.errors?.receiver}
							/>
						),
					},
					{
						label: 'เบอร์โทรศัพท์',
						row: true,
						required: true,
						col: 8,
						item: (
							<Input
								name='telDelivery'
								placeholder='เบอร์โทรศัพท์'
								onChange={handleChangeInput}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? input?.tel
										: input?.telDelivery
								}
								disabled={addressDeliveryRadio !== 'newAddress'}
								error={fieldError.errors?.telDelivery}
							/>
						),
					},
					{
						label: 'ที่อยู่',
						row: true,
						required: true,
						col: 16,
						item: (
							<Input
								name='addressDelivery'
								placeholder='ที่อยู่'
								disabled={
									addressDeliveryRadio === 'addressSameInsurance' ||
									addressDeliveryRadio === 'addressInspection'
								}
								onChange={handleChangeInput}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.companyCompulsory === 'วิริยะประกันภัย' ||
										  select?.companyCompulsory === 'แอกซ่าประกันภัย'
											? `${input?.addressInsurance} ${input?.roadInsurance} ${input?.soiInsurance}`
											: input?.addressInsurance
										: input?.addressDelivery
								}
								error={fieldError.errors?.addressDelivery}
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
								name='provinceDelivery'
								placeholder='จังหวัด'
								showSearch
								disabled={
									addressDeliveryRadio === 'addressSameInsurance' ||
									addressDeliveryRadio === 'addressInspection'
								}
								options={addressDeliveryList.provinceList}
								onChange={handleChangeSecondAddress}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.provinceInsurance
										: select?.provinceDelivery
								}
								error={fieldError.errors?.provinceDelivery}
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
								name='amphoeDelivery'
								placeholder='เขต/อำเภอ'
								showSearch
								disabled={
									addressDeliveryRadio === 'addressSameInsurance' ||
									addressDeliveryRadio === 'addressInspection'
								}
								options={addressDeliveryList.amphoeList}
								onChange={handleChangeSecondAddress}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.amphoeInsurance
										: select?.amphoeDelivery
								}
								error={fieldError.errors?.amphoeDelivery}
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
								name='districtDelivery'
								placeholder='แขวง/ตำบล'
								showSearch
								disabled={
									addressDeliveryRadio === 'addressSameInsurance' ||
									addressDeliveryRadio === 'addressInspection'
								}
								options={addressDeliveryList.districtList}
								onChange={handleChangeSecondAddress}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.districtInsurance
										: select?.districtDelivery
								}
								error={fieldError.errors?.districtDelivery}
							/>
						),
					},
					{
						label: 'รหัสไปรษณีย์',
						row: true,
						required: true,
						col: 8,
						item: (
							<Select
								name='zipcodeDelivery'
								placeholder='รหัสไปรษณีย์'
								showSearch
								disabled={
									addressDeliveryRadio === 'addressSameInsurance' ||
									addressDeliveryRadio === 'addressInspection'
								}
								options={addressDeliveryList.zipcodeList}
								onChange={handleChangeSecondAddress}
								value={
									addressDeliveryRadio === 'addressSameInsurance'
										? select?.zipcodeInsurance
										: select?.zipcodeDelivery
								}
								error={fieldError.errors?.zipcodeDelivery}
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ความคุ้มครอง',
				items: [
					{
						label: 'ทุนประกัน',
						row: true,
						col: 8,
						item: (
							<Input
								name='newInsureBudget'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeNumInput}
								value={convertStrToFormat(input?.newInsureBudget, 'money')}
							/>
						),
					},
					{
						label: 'ค่าเสียหายส่วนแรก',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage1'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage1, 'money')}
							/>
						),
					},
					{
						label: 'ความเสียหายต่อชีวิต ร่างกาย หรืออนามัย (คน)',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage2'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage2, 'money')}
							/>
						),
					},
					{
						label: 'ความเสียหายต่อชีวิต ร่างกาย หรืออนามัย (ครั้ง)',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage3'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage3, 'money')}
							/>
						),
					},
					{
						label: 'ความเสียหายต่อทรัพย์สิน',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage4'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage4, 'money')}
							/>
						),
					},
					{
						label: 'รย.01 ก.ขับขี่ 1 คน',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage5'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage5, 'money')}
							/>
						),
					},
					{
						label: 'รย.01 ก.ขับขี่ 6 คน',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage6'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage6, 'money')}
							/>
						),
					},
					{
						label: 'รย.02 ค่ารักษาพยาบาล',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage7'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage7, 'money')}
							/>
						),
					},
					{
						label: 'รย.03 การประกันผู้ขับขี่',
						row: true,
						col: 8,
						item: (
							<Input
								name='damage8'
								addonAfter='บาท'
								placeholder='0'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.damage8, 'money')}
							/>
						),
					},
				],
			},
		},
	]

	return (
		<DetailLayout
			isPreve={true}
			onClickPrevious={() => redirect(ROUTE_PATH.COMPULSORY_MOTOR.LINK)}
			onClickForward={handleClick.submitToBill}
			isStep={true}
		>
			<Label className='title-form'>{`แจ้งงาน ${
				!input?.compulsoryPrice?.price ? '' : 'พ.ร.บ./'
			}ประกัน`}</Label>
			{form.map((e, i) => {
				const { section } = e
				return (
					!section.hide && (
						<Box key={i}>
							<Label className='title-second-form'>{section?.title}</Label>
							<Row gutter={[16, 8]}>
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
						</Box>
					)
				)
			})}
			<Box className='accept-group-btn-wrapper'>
				<Button
					className='accept-btn'
					width='140'
					onClick={handleClick.submitToTax}
					disabled={true}
				>
					คำนวณภาษีรถ
				</Button>
				<Button
					className='accept-btn'
					width='140'
					onClick={handleClick.submitToBill}
				>
					สรุปรายการชำระเงิน
				</Button>
			</Box>
		</DetailLayout>
	)
}

export default CarInsurance

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
