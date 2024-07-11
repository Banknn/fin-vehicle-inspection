import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Modal, Divider } from 'antd'
import {
	Box,
	Label,
	Button,
	Span,
	Input,
	Select,
	Radio,
	Modal as ModalCustom,
	Icons,
	Table,
} from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	redirect,
	ROUTE_PATH,
	LIST,
	checkIdCard,
	filterAddress,
} from '../../helpers'
import { loadingAction, customerAction } from '../../actions'
import { addressController, systemController } from '../../apiServices'
import { THEME } from '../../themes'
import _ from 'lodash'
import { SearchOutlined } from '@ant-design/icons'
import { message } from 'antd'
import moment from 'moment'

const DataCustomer = () => {
	const dispatch = useDispatch()
	const customer = useSelector((state) => state.customerReducer)
	const [legal, setLegal] = useState('บุคคลทั่วไป')
	const [choiceInput, setChoiceInput] = useState('customerAndCar')
	const [input, setInput] = useState({})
	const [select, setSelect] = useState({})
	const [fieldError, setFieldError] = useState({})
	const [brand, setBrand] = useState(null)
	const [year, setYear] = useState(null)
	const [series, setSeries] = useState(null)
	const [subSeries, setSubSeries] = useState(null)
	const [isPassport, setIsPassport] = useState(false)
	const [fetchDataFirst, setFetchDataFirst] = useState(false)
	//-------------------------- LIST ------------------------------------
	const [brandList, setBrandList] = useState([])
	const [yearList, setYearList] = useState([])
	const [seriesList, setSeriesList] = useState([])
	const [subSeriesList, setSubSeriesList] = useState([])
	const [titleList, setTitleList] = useState([])
	const [carTypeList, setCarTypeList] = useState([])
	const [address, setAddress] = useState({
		addressList: [],
		provinceList: [],
		amphoeList: [],
		districtList: [],
		zipcodeList: [],
	})

	const fetchData = useCallback(async () => {
		if (!_.isEmpty(customer) && !fetchDataFirst) {
			setFetchDataFirst(true)

			setInput(customer.input)
			setSelect(customer.select)
			setBrand(customer.brand)
			setYear(customer.year)
			setSeries(customer.series)
			setSubSeries(customer.subSeries)
			setLegal(customer.legal || legal)
			setChoiceInput(customer.choiceInput)
		}
	}, [customer, legal, fetchDataFirst])

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
		fetchData()
		fetchAddress()
		Promise.all([LIST.CAR_BRAND(), LIST.CAR_TYPE()]).then((e) => {
			setBrandList(e[0])
			setCarTypeList(e[1])
		})
	}, [fetchData, fetchAddress])

	useEffect(() => {
		Promise.all([LIST.TITLE(legal)]).then((e) => {
			setTitleList(e[0])
		})
	}, [legal])

	const handleChangeInput = (e) => {
		const { name, value } = e.currentTarget
		setInput({ ...input, [name]: value })
	}

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!select.title) {
			formIsValid = false
			errors['title'] = 'กรุณาเลือกคำนำหน้า'
		}
		if (!input.name) {
			formIsValid = false
			errors['name'] = 'กรุณากรอกชื่อ'
		}
		if (!input.lastname && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['lastname'] = 'กรุณากรอกนามสกุล'
		}
		if (!select.gender && legal === 'บุคคลทั่วไป') {
			formIsValid = false
			errors['gender'] = 'กรุณาเลือกเพศ'
		}
		if (
			((legal === 'บุคคลทั่วไป' && isPassport) || legal === 'นิติบุคคล'
				? !input.idCard
				: !checkIdCard(input.idCard)) &&
			choiceInput === 'customerAndCar'
		) {
			formIsValid = false
			errors['idCard'] =
				legal === 'บุคคลทั่วไป' && isPassport
					? 'กรุณาระบุเลขหนังสือเดินทาง '
					: legal === 'นิติบุคคล'
					? 'กรุณาระบุเลขที่ผู้เสียภาษี'
					: 'กรุณาระบุเลขบัตรประชาชนให้ถูกต้อง'
		}
		if (!input.tel) {
			formIsValid = false
			errors['tel'] = 'กรุณากรอกเบอร์โทรศัพท์'
		}
		if (!input.addressInsurance && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['addressInsurance'] = 'กรุณาระบุที่อยู่'
		}
		if (!select.provinceInsurance && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['provinceInsurance'] = 'กรุณาเลือกจังหวัด'
		}
		if (!select.amphoeInsurance && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['amphoeInsurance'] = 'กรุณาเลือกเขต/อำเภอ'
		}
		if (!select.districtInsurance && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['districtInsurance'] = 'กรุณาเลือกแขวง/ตำบล'
		}
		if (!select.zipcodeInsurance && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['zipcodeInsurance'] = 'กรุณาเลือกรหัสไปรษณีย์'
		}
		if (!select.registerYear && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['registerYear'] = 'กรุณาเลือกปีที่จดทะเบียนรถ'
		}
		if (!input.vehicleRegistrationNumber) {
			formIsValid = false
			errors['vehicleRegistrationNumber'] = 'กรุณาระบุเลขทะเบียน'
		}
		if (!select.vehicleRegistrationArea) {
			formIsValid = false
			errors['vehicleRegistrationArea'] = 'กรุณาเลือกจังหวัดป้ายทะเบียน'
		}
		if (!select.carType && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['carType'] = 'กรุณาเลือกประเภทรถ'
		}
		if (!input.engineCC && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['engineCC'] = 'กรุณาระบุเครื่องยนต์ (CC)'
		}
		if (!input.carWeight && choiceInput === 'customerAndCar') {
			formIsValid = false
			errors['carWeight'] = 'กรุณาระบุน้ำหนักรถ'
		}
		// if (!select.vehicleType) {
		// 	formIsValid = false
		// 	errors['vehicleType'] = 'ประเภทตรวจสภาพรถ'
		// }
		setFieldError({ errors })
		return formIsValid
	}

	const handleClick = {
		submit: async () => {
			console.log('submit')
			let updatedCustomer = {
				input,
				select,
				brand,
				year,
				series,
				subSeries,
				legal,
				choiceInput,
				isPassport,
			}
			dispatch(
				customerAction({
					...updatedCustomer,
				})
			)
			dispatch(loadingAction(true))
			return true
		},
		submitToBill: async () => {
			if (validateFields()) {
				if (await handleClick.submit()) {
					redirect(ROUTE_PATH.BILL.LINK)
				} else {
					Modal.error({
						title: 'ไม่สามารถบันทึกได้',
					})
				}
			} else {
				Modal.error({
					title: 'กรุณากรอกให้ครบทุกช่อง',
				})
			}
		},
	}

	const form = [
		{
			section: {
				title: 'เลือกข้อมูลสำหรับกรอก',
				items: [
					{
						row: true,
						col: 10,
						item: (
							<Box>
								<Radio.GroupBtn
									className='group-radio'
									lbClassName='input-label'
									value={choiceInput}
									name='choiceInput'
									optionType='button'
									options={[
										{
											label: 'ข้อมูลลูกค้าพร้อมรายละเอียดรถยนต์',
											value: 'customerAndCar',
										},
										{
											label: 'ข้อมูลลูกค้าเท่านั้น',
											value: 'customerOnly',
										},
									]}
									onChange={(e) => {
										const value = e.target.value
										setChoiceInput(value)
									}}
								/>
							</Box>
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
						hide: legal !== 'บุคคลทั่วไป',
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
						hide: legal !== 'บุคคลทั่วไป',
						col: 5,
						item: (
							<Select
								name='gender'
								placeholder='เพศ'
								showSearch
								options={LIST.GENDER}
								onChange={(v) => setSelect((e) => ({ ...e, gender: v }))}
								value={select?.gender}
								error={fieldError.errors?.gender}
							/>
						),
					},
					{
						label: 'เบอร์โทรศัพท์',
						row: true,
						required: true,
						col: 6,
						item: (
							<Input
								name='tel'
								placeholder='เบอร์โทรศัพท์'
								onChange={handleChangeInput}
								value={convertStrToFormat(input?.tel, 'phone_number')}
								error={fieldError.errors?.tel}
							/>
						),
					},
					{
						label:
							legal === 'บุคคลทั่วไป'
								? 'เลขบัตรประชาชน/หนังสือเดินทาง'
								: 'เลขที่ผู้เสียภาษี',
						row: true,
						required: choiceInput === 'customerAndCar',
						col: 8,
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
								valueCheckErr={
									!checkIdCard(input?.idCard) &&
									choiceInput === 'customerAndCar'
								}
								error={fieldError.errors?.idCard}
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
						col: 6,
						hide: choiceInput === 'customerOnly',
						item: (
							<>
								<Select
									name='brand'
									placeholder='ยี่ห้อรถ'
									showSearch
									options={brandList}
									onChange={(value) => {
										LIST.CAR_YEAR(value).then((e) => setYearList(e))
										setBrand(value)
										setYear(null)
										setSeries(null)
										setSeriesList([])
										setSubSeries(null)
										setSubSeriesList([])
									}}
									value={brand}
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
									/>
								)}
							</>
						),
					},
					{
						label: brand === 'none' ? 'ปีรถ (ค.ศ.)' : 'ปีรถ',
						row: true,
						col: 6,
						hide: choiceInput === 'customerOnly',
						item:
							brand !== 'none' ? (
								<>
									<Select
										name='year'
										placeholder='ปีรถ'
										showSearch
										options={yearList}
										onChange={(value) => {
											LIST.CAR_SERIES(brand, value).then((e) =>
												setSeriesList(e)
											)
											setYear(value)
											setSeries(null)
											setSubSeries(null)
											setSubSeriesList([])
										}}
										value={year}
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
											}}
											value={input?.yearOther}
										/>
									)}
								</>
							) : (
								<Input
									name='year'
									placeholder='ปีรถ (ค.ศ.)'
									onChange={(even) => {
										const { value } = even.currentTarget
										LIST.CAR_SERIES(brand, value).then((e) => setSeriesList(e))
										setYear(value.replace(/[^0-9]/gi, ''))
										setSeries(null)
										setSubSeries(null)
										setSubSeriesList([])
									}}
									value={year}
								/>
							),
					},
					{
						label: 'รุ่นรถ',
						row: true,
						col: 6,
						hide: choiceInput === 'customerOnly',
						item:
							brand !== 'none' ? (
								<>
									<Select
										name='series'
										placeholder='รุ่นรถ'
										showSearch
										options={seriesList}
										onChange={(value) => {
											LIST.CAR_SUB_SERIES(brand, year, value).then((e) =>
												setSubSeriesList(e)
											)
											setSeries(value)
											setSubSeries(null)
										}}
										value={series}
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
													seriesOther: value.replace(/[^A-Za-z0-9-]/gi, ''),
												})
											}}
											value={input?.seriesOther}
										/>
									)}
								</>
							) : (
								<Input
									name='serie'
									placeholder='รุ่นรถ'
									onChange={(even) => {
										const { value } = even.currentTarget
										LIST.CAR_SUB_SERIES(brand, year, value).then((e) =>
											setSubSeriesList(e)
										)
										setSeries(value.replace(/[^A-Za-z0-9]/gi, ''))
										setSubSeries(null)
									}}
									value={series}
								/>
							),
					},
					{
						label: 'รุ่นย่อยรถ',
						row: true,
						col: 6,
						hide: choiceInput === 'customerOnly',
						item: (
							<Select
								name='subSeries'
								placeholder='รุ่นย่อยรถ'
								showSearch
								options={subSeriesList}
								onChange={(value) => {
									setSubSeries(value)
								}}
								value={subSeries}
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
						col: 7,
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
						col: 8,
						hide: choiceInput === 'customerOnly',
						item: (
							<Select
								name='carType'
								placeholder='ประเภทรถ'
								showSearch
								options={carTypeList}
								onChange={(v) => setSelect((e) => ({ ...e, carType: v }))}
								value={select?.carType}
								error={fieldError.errors?.carType}
							/>
						),
					},
					{
						label: 'เครื่องยนต์ (CC)',
						row: true,
						required: true,
						col: 5,
						hide: choiceInput === 'customerOnly',
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
						hide: choiceInput === 'customerOnly',
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
						label: 'วันจดทะเบียน',
						row: true,
						col: 5,
						hide: choiceInput === 'customerOnly',
						item: (
							<Select
								name='registerDay'
								placeholder='วันเกิด'
								showSearch
								options={LIST.DAY}
								onChange={(v) => setSelect((e) => ({ ...e, registerDay: v }))}
								value={select?.registerDay}
							/>
						),
					},
					{
						label: 'เดือนจดทะเบียน',
						row: true,
						col: 5,
						hide: choiceInput === 'customerOnly',
						item: (
							<Select
								name='registerMonth'
								placeholder='เดือนเกิด'
								showSearch
								options={LIST.MONTH}
								onChange={(v) => setSelect((e) => ({ ...e, registerMonth: v }))}
								value={select?.registerMonth}
							/>
						),
					},
					{
						label: 'ปีที่จดทะเบียนรถ',
						row: true,
						required: true,
						col: 5,
						hide: choiceInput === 'customerOnly',
						item: (
							<Select
								name='registerYear'
								placeholder='ปีที่จดทะเบียนรถ'
								showSearch
								options={LIST.YEAR()}
								onChange={(v) => setSelect((e) => ({ ...e, registerYear: v }))}
								value={select?.registerYear}
								error={fieldError.errors?.registerYear}
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ที่อยู่ลูกค้า',
				items: [
					{
						label: 'ที่อยู่',
						row: true,
						required: choiceInput === 'customerAndCar',
						col: 8,
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
						label: 'จังหวัด',
						row: true,
						required: choiceInput === 'customerAndCar',
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
						required: choiceInput === 'customerAndCar',
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
						required: choiceInput === 'customerAndCar',
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
				title: 'ข้อมูลตรวจสภาพรถ',
				items: [
					{
						label: 'ประเภทตรวจสภาพรถ',
						row: true,
						// required: true,
						col: 6,
						item: (
							<Select
								name='vehicleType'
								placeholder='ประเภทตรวจสภาพรถ'
								showSearch
								options={[
									{
										text: 'รถยนต์ที่มีน้ำหนักไม่เกิน 2,000 กิโลกรัม',
										value: 'carThan2000',
									},
									{
										text: 'รถยนต์ที่มีน้ำหนักเกิน 2,000 กิโลกรัม',
										value: 'carOver2000',
									},
									{
										text: 'รถจักรยานยนต์',
										value: 'motorcycle',
									},
								]}
								onChange={(v) => setSelect((e) => ({ ...e, vehicleType: v }))}
								value={select?.vehicleType}
								// error={fieldError.errors?.vehicleType}
							/>
						),
					},
				],
			},
		},
	]

	return (
		<Box>
			{SearchCustomer(
				setInput,
				setSelect,
				setBrand,
				setYear,
				setSeries,
				setLegal,
				setSubSeries
			)}
			{form.map((e, i) => {
				const { section } = e
				return (
					!section.hide && (
						<Box key={i}>
							<Divider
								orientation='left'
								plain
								style={{
									borderColor: THEME.COLORS.RED,
									fontSize: '16px',
									fontWeight: 'bold',
								}}
							>
								<Label className='title-second-form-divider'>
									{section.title}
								</Label>
							</Divider>
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
						</Box>
					)
				)
			})}
			<Box className='accept-group-btn-wrapper'>
				<Button
					className='accept-btn'
					width='140'
					onClick={handleClick.submitToBill}
				>
					ออกบิลชำระ
				</Button>
			</Box>
		</Box>
	)
}

export default DataCustomer

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

const SearchCustomer = (
	setInput,
	setSelect,
	setBrand,
	setYear,
	setSeries,
	setLegal,
	setSubSeries
) => {
	const modal = useRef(null)
	const dispatch = useDispatch()
	const [searchCar, setSearchCar] = useState('')
	const [selectedRow, setSelectedRow] = useState([])
	const [listSelect, setListSelect] = useState([])
	const [dataList, setDataList] = useState([])

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			width: 60,
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'name',
			key: 'name',
			width: 220,
			render: (text, record) => {
				return (
					<Label>
						{record.title} {record.name} {record.lastname}
					</Label>
				)
			},
		},
		{
			title: 'ทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			width: 110,
			render: (text, record) => {
				return (
					<Label>
						{record.idcar} <br />
						{record.carprovince}
					</Label>
				)
			},
		},
		{
			title: 'เบอร์โทร',
			dataIndex: 'tel',
			key: 'tel',
			width: 110,
		},
		{
			title: 'วันที่',
			dataIndex: 'date',
			key: 'date',
			width: 100,
			render: (text, record) => {
				return <Label>{moment(text).format('DD-MM-YYYY')}</Label>
			},
		},
	]

	const handleSearch = async () => {
		dispatch(loadingAction(true))
		const API = systemController()
		const res = await API.findCustomerTroFin({
			search: searchCar.replace('-', ''),
		})
		if (isValidResponse(res)) {
			const customerDetail = res.result
			const data = customerDetail.map((e, i) => {
				return {
					key: i + 1,
					no: i + 1,
					...e,
				}
			})

			setDataList(data)
		}
		dispatch(loadingAction(false))
	}

	const onSelectChange = (newSelectedRow, result) => {
		setSelectedRow(newSelectedRow)
		setListSelect(result)
	}

	const rowSelection = {
		selectedRowKeys: selectedRow,
		onChange: onSelectChange,
	}

	const handleSelect = () => {
		const {
			insuredType,
			title,
			name,
			lastname,
			gender,
			idcard,
			tel,
			brandplan,
			seriesplan,
			yearplan,
			sub_seriesplan,
			registerDay,
			registerMonth,
			registerYear,
			idcar,
			carprovince,
			car_type,
			vehicle_type,
			cc_car,
			weight_car,
			address,
			amphoe,
			district,
			province,
			zipcode,
			quo_num,
		} = listSelect[0]
		const legal = insuredType === '2' ? 'นิติบุคคล' : 'บุคคลทั่วไป'

		const list = {
			input: {
				name,
				lastname,
				idCard: idcard,
				tel,
				vehicleRegistrationNumber: idcar,
				engineCC: cc_car,
				carWeight: weight_car,
				addressInsurance: address,
			},
			select: {
				title,
				gender,
				registerDay,
				registerMonth,
				registerYear,
				vehicleRegistrationArea: carprovince,
				carType: car_type,
				vehicleType: vehicle_type,
				amphoeInsurance: amphoe,
				districtInsurance: district,
				provinceInsurance: province,
				zipcodeInsurance: zipcode,
			},
		}
		setInput(list.input)
		setSelect(list.select)
		setLegal(legal)
		if (!quo_num) {
			setBrand(brandplan)
			setYear(yearplan)
			setSeries(seriesplan)
			setSubSeries(sub_seriesplan)
		}
	}

	return (
		<Box style={{ display: 'flex', justifyContent: 'end' }}>
			<Button
				className='btn-search-customer-tro'
				onClick={() => modal.current.open()}
			>
				<SearchOutlined /> ค้นหาข้อมูลลูกค้า
			</Button>
			<ModalCustom
				ref={modal}
				headerText={
					<Input.Search
						style={{
							width: '200px',
						}}
						onSearch={(value) => {
							if (value) {
								handleSearch()
							} else {
								message.error(`กรุณากรอกเลขทะเบียน`)
							}
						}}
						placeholder='กรอกเลขทะเบียนรถ'
						enterButton
						value={convertStrToFormat(searchCar, 'idcar')}
						onChange={(e) => {
							const { value } = e.currentTarget
							setSearchCar(value.replace(/[^A-Za-zก-ฮ0-9-]/gi, ''))
						}}
					/>
				}
				modalHead='modal-header'
				iconsClose={<Icons.CloseOutlined />}
			>
				<Box className='modal-customer-tro'>
					<Table
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						columns={columns}
						dataSource={dataList}
						scroll={{
							y: 320,
						}}
					/>
					<Box
						style={{ display: 'flex', justifyContent: 'end', marginTop: '5px' }}
					>
						<Button className='select-btn' onClick={() => setDataList([])}>
							เคลียร์ข้อมูล
						</Button>
						<Button
							className='accept-btn'
							disabled={listSelect.length < 0}
							onClick={handleSelect}
						>
							เลือกข้อมูล
						</Button>
					</Box>
				</Box>
			</ModalCustom>
		</Box>
	)
}
