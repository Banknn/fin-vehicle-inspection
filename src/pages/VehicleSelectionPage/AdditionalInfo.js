import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Alert } from 'antd'
import {
	Container,
	Box,
	Image,
	Label,
	Button,
	Input,
	Select,
	Table,
	InputNumber,
} from '../../components'
import {
	carController,
	defaultController,
	quotationController,
	priceAutoController,
} from '../../apiServices'
import { loadingAction } from '../../actions'
import {
	isValidResponse,
	LIST,
	storeQuotation,
	convertStrToFormat,
} from '../../helpers'
import moment from 'moment'

export const AdditionalInfo = ({
	selectionHeader,
	decStep,
	currentSubstep,
	updateCurrentSubstep,
	onInputChange,
	onSelectChange,
	additionalValue,
	carInfo,
	setQuotationCampaign,
}) => {
	const user = useSelector((state) => state.authenReducer.dataResult)
	const dispatch = useDispatch()
	const [query, setQuery] = useState()
	const [incompleteInfo, setIncompleteInfo] = useState(false)
	const [fetched, setFetched] = useState(false)
	const [queried, setQueried] = useState(false)
	const [fieldError, setFieldError] = useState({})
	//-------------------------- LIST ------------------------------------
	const [title, setTitle] = useState([])
	const [insurOption, setInsurOption] = useState([])
	const [carCodeOption, setCarCodeOption] = useState([])
	const [addonOption, setAddonOption] = useState([])
	const [selectedInsur, setSelectedInsur] = useState([])
	const [provinceList, setProvinceList] = useState([])

	const fetchAdditionalInfo = useCallback(async () => {
		dispatch(loadingAction(true))
		const { carBrand, carYear, carSeries, carSubSeries } = carInfo
		const defaultAPI = defaultController()
		const carAPI = carController()
		const autoSceneRes = await defaultAPI.getAutoScene()
		const carDetailRes = await carAPI.findDetailCar({
			id_brand: carBrand.no,
			id_year: carYear.id_year,
			id_series: carSeries.id_series,
			id_subseries: carSubSeries.id_subseries,
		})
		if (isValidResponse(autoSceneRes) && isValidResponse(carDetailRes)) {
			const insureTypeResult = autoSceneRes.result.type
			const filterInsureTypeList = insureTypeResult.filter(
				(e) => e.value !== 'T0' && e.value !== 'T1' && e.value !== 'T6'
			)
			const insureTypeList = filterInsureTypeList.map((el) => ({
				text: el.label,
				value: el.label,
			}))
			setInsurOption(insureTypeList)

			const codeResult = autoSceneRes.result.idcar
			const codeList = codeResult
				.filter(
					(e) =>
						![
							'320.1',
							'420',
							'520',
							'540',
							'610',
							'620',
							'630',
							'730',
						].includes(e.value) &&
						!(e.value === '210' && e.label === '(210)-รถกระบะ-ส่วนบุคคล')
				)
				.map((el) => ({
					text: el.label,
					value: el.value,
				}))
			setCarCodeOption(codeList)

			const addonResult = autoSceneRes.result.addon
			const addonList = addonResult.map((el) => ({
				text: el.label,
				value: el.value,
			}))
			setAddonOption(addonList)
		}
		dispatch(loadingAction(false))
		setFetched(true)
	}, [dispatch, carInfo])

	useEffect(() => {
		Promise.all([LIST.PROVINCES()]).then((e) => setProvinceList(e[0]))
		!fetched && fetchAdditionalInfo()
	}, [fetchAdditionalInfo, fetched])

	useEffect(() => {
		Promise.all([LIST.TITLE(additionalValue.legal || 'บุคคลทั่วไป')]).then(
			(e) => setTitle(e[0])
		)
	}, [additionalValue.legal])

	const getQuery = useCallback(
		(additionalValue) => {
			const { carBrand, carYear, carSeries, carSubSeries } = carInfo
			const data = {
				brand: carBrand.brand,
				year: carYear.year.toString(),
				series: carSeries.series,
				subseries: carSubSeries.sub_series,
				type: additionalValue.insuranceType.type,
				repair_type: additionalValue.insuranceType.repair_type,
				idcar: additionalValue.carCode.idcar,
				addon: additionalValue.addon.value,
				selectprovince_car: additionalValue.vehicleRegistrationArea,
				camera: additionalValue.camera,
				assured_insurance_capital1:
					additionalValue.newInsuranceBudget.toString(),
				type_vif:
					(user.user_adviser === 'FNG22-055001' &&
						user.name.trim().slice(-14) === '(ควิกเซอร์วิส)') ||
					user.name.trim().slice(-22) === '(บริษัท ชิปป๊อป จำกัด)'
						? 'quick'
						: 'vif',
			}
			return data
		},
		[carInfo, user.name, user.user_adviser]
	)

	useEffect(() => {
		const fetchCustomer = () => {
			if (Object.keys(additionalValue).length > 5) {
				setQuery(getQuery(additionalValue))
			}
			setQueried(true)
		}
		!queried && fetchCustomer()
	}, [getQuery, queried, additionalValue])

	const substepSelection = () => {
		switch (currentSubstep) {
			case 0:
				return (
					<>
						{selectionHeader('กรอกข้อมูลเพิ่มเติม', decStep)}
						{InfoForm(
							insurOption,
							carCodeOption,
							addonOption,
							onSelectChange,
							handleClick,
							additionalValue,
							incompleteInfo,
							carInfo,
							fieldError,
							provinceList
						)}
					</>
				)
			case 1:
				return (
					<>
						{selectionHeader('ตารางเปรียบเทียบเบี้ยประกันภัย', () => {
							setIncompleteInfo(false)
							updateCurrentSubstep('dec')
						})}
						<InsuranceTable
							query={query}
							selectedInsur={selectedInsur}
							setSelectedInsur={setSelectedInsur}
							onSelectChange={onSelectChange}
							additionalValue={additionalValue}
							user={user}
						/>
						{InsurForm(
							title,
							onInputChange,
							onSelectChange,
							handleClick,
							additionalValue,
							incompleteInfo,
							fieldError,
							convertStrToFormat
						)}
					</>
				)
			default:
				return
		}
	}

	const validateFields = {
		ToCheckRate: () => {
			let errors = {}
			let formIsValid = true
			if (!additionalValue.camera) {
				formIsValid = false
				errors['camera'] = 'กรุณาเลือก'
			}
			if (!additionalValue.vehicleRegistrationArea) {
				formIsValid = false
				errors['vehicleRegistrationArea'] = 'กรุณาเลือกจังหวัด'
			}
			if (!additionalValue.carCode) {
				formIsValid = false
				errors['carCode'] = 'กรุณาเลือกรหัสรถยนต์'
			}
			if (!additionalValue.insuranceType) {
				formIsValid = false
				errors['insuranceType'] = 'กรุณาเลือกประเภทประกัน'
			}
			if (!additionalValue.addon) {
				formIsValid = false
				errors['addon'] = 'กรุณาเลือกอุปกรณ์เพิ่มเติม'
			}
			if (
				!additionalValue?.newInsuranceBudget &&
				additionalValue?.newInsuranceBudget !== 0
			) {
				formIsValid = false
				errors['newInsuranceBudget'] = 'กรุณาระบุทุนประกันใหม่'
			}
			setFieldError({ errors })
			return formIsValid
		},
		ToInsur: () => {
			let errors = {}
			let formIsValid = true
			if (!additionalValue.title) {
				formIsValid = false
				errors['title'] = 'กรุณาเลือก'
			}
			if (!additionalValue.name) {
				formIsValid = false
				errors['name'] = 'กรุณาระบุชื่อ'
			}
			if (!additionalValue.purchaseSelected) {
				formIsValid = false
				errors['purchaseSelected'] = 'กรุณาเลือก'
			}
			setFieldError({ errors })
			return formIsValid
		},
	}

	const generateCampaign = useCallback(async () => {
		dispatch(loadingAction(true))
		const quotationAPI = quotationController()
		const { carBrand, carYear, carSeries, carSubSeries } = carInfo
		const {
			addon,
			carCode,
			installment,
			insuranceType,
			name,
			vehicleRegistrationNumber,
			purchaseSelected,
			lastname,
			tel,
			title,
		} = additionalValue
		const no = selectedInsur.map(
			(el) =>
				`${el.data.no},${el.company_name},${el.data.assured_insurance_capital1},${el.data.amount_inc},${el.data.coverage_id}`
		)
		const campaignData = {
			addon: addon.value,
			brands: carBrand.brand,
			chanel_buy: '',
			cuscode: user.cuscode,
			discount: '',
			lastname: lastname || '',
			name: name ? `${name}` : name && lastname && `${name} ${lastname}`,
			no,
			no_car: carCode.idcar,
			number_car: vehicleRegistrationNumber || '-',
			prb: purchaseSelected,
			repair_type: insuranceType.repair_type,
			series: carSeries.series,
			show_ins: (installment && installment.show_ins) || 'no',
			sub_series: carSubSeries.sub_series,
			tel: tel || '-',
			title: title || 'คุณ',
			type: insuranceType.type,
			type_pay: (installment && installment.typePay) || 0,
			year: carYear.year.toString(),
		}
		const quotationRes = await quotationAPI.generateCampaignQuotation(
			campaignData
		)
		if (isValidResponse(quotationRes)) {
			const quotationResult = quotationRes.result
			setQuotationCampaign(quotationResult)
			updateCurrentSubstep('inc')
			storeQuotation({ campaignData })
			dispatch(loadingAction(false))
		}
	}, [
		dispatch,
		additionalValue,
		carInfo,
		selectedInsur,
		setQuotationCampaign,
		updateCurrentSubstep,
		user.cuscode,
	])

	const handleClick = {
		submitToCheckRate: () => {
			onSelectChange({
				name: 'installment',
				value: { show_ins: 'no', typePay: 0 },
			})
			if (validateFields.ToCheckRate()) {
				const data = getQuery(additionalValue)
				setIncompleteInfo(false)
				setQuery(data)
				updateCurrentSubstep('inc')
			} else {
				setIncompleteInfo(true)
			}
		},
		submitToInsur: () => {
			if (validateFields.ToInsur() && additionalValue.plans.length > 0) {
				setIncompleteInfo(false)
				generateCampaign()
			} else {
				setIncompleteInfo(true)
			}
		},
	}

	return (
		<Container className='selection-wrapper'>{substepSelection()}</Container>
	)
}

const InfoForm = (
	insurOption,
	carCodeOption,
	addonOption,
	onSelectChange,
	handleClick,
	additionalValue,
	incompleteInfo,
	carInfo,
	fieldError,
	provinceList
) => {
	const onOldInsureChange = (value) => {
		const { carBrand } = carInfo
		const { no } = carBrand
		if (value && value >= 0) {
			let ass = +value - +value * (+no === 4 ? 0.35 : 0.1)
			let ass_round = Math.round(ass / 10000) * 10000
			if (ass < 100000) {
				ass_round = Math.round(ass / 1000) * 1000
			}
			onSelectChange({
				name: 'oldInsuranceBudget',
				value,
				calculated: ass > 10000 ? ass_round : ass,
			})
		} else {
			onSelectChange({
				name: 'oldInsuranceBudget',
				value,
				calculated: additionalValue.assured,
			})
		}
	}

	const form = [
		{
			section: {
				title: '',
				items: [
					{
						label: 'กล้องหน้ารถ',
						required: true,
						col: 4,
						hide: false,
						item: (
							<Select
								name='camera'
								placeholder='กรุณาระบุ'
								options={[
									{ value: 'yes', text: 'มี' },
									{ value: 'no', text: 'ไม่มี' },
								]}
								onChange={(v) => onSelectChange({ name: 'camera', value: v })}
								value={additionalValue?.camera}
								error={fieldError.errors?.camera}
							/>
						),
					},
					{
						label: 'จังหวัดป้ายทะเบียน',
						required: true,
						col: 8,
						hide: false,
						item: (
							<Select
								name='vehicleRegistrationArea'
								placeholder='กรุณาเลือกจังหวัด'
								showSearch
								options={provinceList}
								onChange={(v) =>
									onSelectChange({ name: 'vehicleRegistrationArea', value: v })
								}
								value={additionalValue?.vehicleRegistrationArea}
								error={fieldError.errors?.vehicleRegistrationArea}
							/>
						),
					},
					{
						label: 'รหัสรถยนต์',
						required: true,
						col: 12,
						hide: false,
						item: (
							<Select
								name='carCode'
								placeholder='กรุณาเลือกรหัสรถยนต์'
								options={carCodeOption}
								onChange={(v, option) => {
									onSelectChange({
										name: 'carCode',
										value: { label: option.children, idcar: v },
									})
								}}
								value={additionalValue?.carCode?.label}
								error={fieldError.errors?.carCode}
							/>
						),
					},
					{
						label: 'ประเภทประกัน',
						required: true,
						col: 10,
						hide: false,
						item: (
							<Select
								name='insuranceType'
								placeholder='กรุณาเลือกประเภทประกัน'
								options={insurOption}
								onChange={(v) => {
									const splitted = v.split(' ')
									onSelectChange({
										name: 'insuranceType',
										value: {
											label: v,
											type: splitted[1],
											repair_type: splitted[2],
										},
									})
								}}
								value={additionalValue?.insuranceType?.label}
								error={fieldError.errors?.insuranceType}
							/>
						),
					},
					{
						label: 'อุปกรณ์เพิ่มเติม',
						required: true,
						col: 10,
						hide: false,
						item: (
							<Select
								name='addon'
								placeholder='กรุณาระบุ'
								options={addonOption}
								onChange={(v, option) => {
									onSelectChange({
										name: 'addon',
										value: { label: option.children, value: v },
									})
								}}
								value={additionalValue?.addon?.value}
								error={fieldError.errors?.addon}
							/>
						),
					},
					{
						label: 'ทุนประกันเดิม',
						col: 12,
						hide: false,
						item: (
							<InputNumber
								name='oldInsuranceBudget'
								placeholder='0'
								formatter={(value) => convertStrToFormat(value, 'number_Int')}
								onChange={onOldInsureChange}
								step={10000}
								min={0}
								value={additionalValue?.oldInsuranceBudget}
							/>
						),
					},
					{
						label: 'ทุนประกันใหม่',
						required: true,
						col: 12,
						hide: false,
						item: (
							<InputNumber
								name='newInsuranceBudget'
								placeholder='0'
								step={10000}
								min={0}
								formatter={(value) => convertStrToFormat(value, 'number_Int')}
								onChange={(v) => {
									onSelectChange({ name: 'newInsuranceBudget', value: v })
								}}
								value={additionalValue?.newInsuranceBudget}
								error={fieldError.errors?.newInsuranceBudget}
							/>
						),
					},
					{
						label: '',
						col: 24,
						hide: !incompleteInfo,
						item: (
							<Alert
								style={{ textAlign: 'center' }}
								type='error'
								message='กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
							/>
						),
					},
					{
						label: '',
						col: 24,
						item: (
							<Box style={{ textAlign: 'center' }}>
								<Button
									className='accept-btn'
									style={{ marginTop: '20px' }}
									width='180'
									onClick={handleClick.submitToCheckRate}
								>
									<Label className='save-label'>เช็คเบี้ย</Label>
								</Button>
							</Box>
						),
					},
				],
			},
		},
	]

	return (
		<>
			{form.map((e, i) => {
				const { section } = e
				return (
					<Box key={i}>
						<Row
							gutter={[16, 16]}
							style={{
								marginLeft: '20px',
								marginRight: '20px',
								textAlign: 'start',
							}}
						>
							{section.items.map((el, il) => {
								return (
									!el.hide && (
										<Col xs={el.col} key={il}>
											{el.label && (
												<Label>
													{el.label}{' '}
													{el.required && (
														<span style={{ color: 'red' }}>*</span>
													)}
												</Label>
											)}
											<Box>{el.item}</Box>
										</Col>
									)
								)
							})}
						</Row>
					</Box>
				)
			})}
		</>
	)
}

const InsuranceTable = ({
	query,
	selectedInsur,
	setSelectedInsur,
	onSelectChange,
}) => {
	const maximumSelectionCount = 4
	const [dataList, setDataList] = useState([])
	const [tableLoading, setTableLoading] = useState(true)
	const [maxedSelect, setMaxedSelect] = useState(false)

	const fetchInsur = useCallback(async (query) => {
		let listCompany = [
			'คุ้มภัยโตเกียวมารีนประกันภัย',
			'ชับบ์สามัคคีประกันภัย',
			'วิริยะประกันภัย',
			'แอกซ่าประกันภัย',
			'เคดับบลิวไอประกันภัย',
			'เมืองไทยประกันภัย'
		]
		const diffYear = moment().diff(query.year, 'year')

		if (query.brand === 'Chevrolet' && diffYear > 5 && query.type !== '3') {
			listCompany = listCompany.filter(
				(e) => e !== 'คุ้มภัยโตเกียวมารีนประกันภัย'
			)
		}

		const priceListAPI = priceAutoController()
		const InsurRes = await priceListAPI.getPriceAuto(query)
		if (isValidResponse(InsurRes)) {
			const InsurList = InsurRes.result.filter(
				(e) => listCompany.includes(e?.company_name)
				// || e?.company_name === 'อินทรประกันภัย'
				// || e?.company_name === 'ทิพยประกันภัย'
			)
			setDataList(InsurList)
		}
		setTableLoading(false)
	}, [])

	useEffect(() => {
		query && fetchInsur(query)
	}, [query, fetchInsur])

	const insurColumns = [
		{
			title: 'บริษัท',
			dataIndex: 'company',
			width: '20%',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Image src={`${row.logoPath}`} className='table-logo-img' />
							<Label>{row.company}</Label>
							<Label>
								(ค่าคอมการค้า 18%,
								<br /> ค่าคอมตามแคมเปญ {row.com - 19}%)
							</Label>
							<Label>{row.description2}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'ราคาเบี้ย',
			dataIndex: 'amountInc',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'ทุนประกัน',
			dataIndex: 'assuredInsuranceCapital',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'บุคคลภายนอก',
			dataIndex: 'outsiderLife',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'บุคคลภายนอกสูงสุด',
			dataIndex: 'outsiderLifeMax',
			// width: '100px',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'ทรัพย์สินภายนอก',
			dataIndex: 'outsiderAsset',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'อุบัติเหตุ',
			dataIndex: 'accident',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'รักษาพยาบาล',
			dataIndex: 'medicalFee',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
		{
			title: 'ประกันตัว',
			dataIndex: 'bail',
			align: 'center',
			render: (text, row, index) => {
				return {
					children: (
						<Box className='row-center-wrapper'>
							<Label>{text}</Label>
						</Box>
					),
				}
			},
		},
	]

	const data = () => {
		return dataList.map((el, index) => ({
			key: index,
			logoPath: el.logo_path,
			company: el.company_name,
			com: el.data.com_sp || '',
			description2: el.description2 || '',
			amountInc: new Intl.NumberFormat().format(el.data.amount_inc),
			assuredInsuranceCapital: new Intl.NumberFormat().format(
				el.data.assured_insurance_capital1
			),
			outsiderLife: new Intl.NumberFormat().format(el.data.protect1),
			outsiderLifeMax: new Intl.NumberFormat().format(el.data.protect2),
			outsiderAsset: new Intl.NumberFormat().format(el.data.protect3),
			accident: new Intl.NumberFormat().format(el.data.protect4),
			medicalFee: new Intl.NumberFormat().format(el.data.protect5),
			bail: new Intl.NumberFormat().format(el.data.protect6),
		}))
	}

	const onRowSelect = (record, selected, selectedRows) => {
		if (selectedRows.length >= maximumSelectionCount) {
			setMaxedSelect(true)
		} else {
			setMaxedSelect(false)
		}
		const selectedData = selectedRows.reduce((result, current) => {
			let dataKey = current.key
			result.push(dataList[dataKey])
			return result
		}, [])
		onSelectChange({
			name: 'plans',
			value: selectedData.map(
				(el) =>
					`${el.data.no},${el.company_name},${el.data.assured_insurance_capital1},${el.data.amount_inc},${el.data.coverage_id}`
			),
		})
		setSelectedInsur(selectedData)
	}

	const rowSelection = {
		type: 'checkbox',
		hideSelectAll: true,
		columnTitle: 'เลือก',
		onSelect: onRowSelect,
		getCheckboxProps: (record) => ({
			disabled: maxedSelect && !selectedInsur.includes(dataList[record.key]), // Column configuration not to be checked
		}),
	}

	return (
		<Table
			rowSelection={rowSelection}
			columns={insurColumns}
			dataSource={data()}
			size='middle'
			bordered
			pagination={false}
			loading={tableLoading}
		/>
	)
}

const InsurForm = (
	title,
	onInputChange,
	onSelectChange,
	handleClick,
	additionalValue,
	incompleteInfo,
	fieldError,
	convertStrToFormat
) => {
	const installmentOption = [
		{ text: 'ไม่ต้องการ', value: 0 },
		// { text: 'ผ่อน 3 งวด', value: 3 },
		// { text: 'ผ่อน 6 งวด', value: 6 },
		// { text: 'ผ่อน 8 งวด', value: 8 },
		// { text: 'ผ่อน 10 งวด', value: 10 },
	]

	const form = [
		{
			section: {
				title: '',
				items: [
					{
						label: 'นิติบุคล/บุคคลทั่วไป',
						col: 5,
						item: (
							<Select
								options={LIST.LEGAL}
								name='legal'
								onChange={(v) => {
									onSelectChange({ name: 'legal', value: v })
								}}
								value={additionalValue?.legal}
							/>
						),
					},
					{
						label: 'คำนำหน้า',
						required: true,
						col: 4,
						item: (
							<Select
								placeholder='คำนำหน้า'
								name='title'
								options={title}
								onChange={(v) => {
									onSelectChange({ name: 'title', value: v })
								}}
								value={additionalValue?.title}
								error={fieldError.errors?.title}
							/>
						),
					},
					{
						label: 'ชื่อ',
						required: true,
						col: 5,
						item: (
							<Input
								placeholder='ชื่อ'
								name='name'
								onChange={onInputChange}
								value={additionalValue?.name}
								error={fieldError.errors?.name}
							/>
						),
					},
					{
						label: 'นามสกุล',
						col: 5,
						hide: additionalValue.legal !== 'บุคคลทั่วไป',
						item: (
							<Input
								placeholder='นามสกุล'
								name='lastname'
								onChange={onInputChange}
								value={additionalValue?.lastname}
							/>
						),
					},
					{
						label: 'เบอร์โทรศัพท์',
						col: 5,
						item: (
							<Input
								placeholder='เบอร์โทรศัพท์'
								name='tel'
								onChange={onInputChange}
								value={convertStrToFormat(additionalValue?.tel, 'phone_number')}
							/>
						),
					},
					{
						label: 'เลขทะเบียนรถ',
						col: 5,
						item: (
							<Input
								placeholder='เช่น กก1234'
								name='vehicleRegistrationNumber'
								onChange={onInputChange}
								value={additionalValue?.vehicleRegistrationNumber}
							/>
						),
					},
					{
						label: 'เลือกซื้อ',
						required: true,
						col: 6,
						item: (
							<Select
								placeholder='กรุณาเลือก'
								name='purchaseSelected'
								options={[
									{ value: 'no', text: 'ประกัน' },
									{ value: 'yes', text: 'ประกัน + พ.ร.บ.' },
								]}
								onChange={(v) => {
									onSelectChange({ name: 'purchaseSelected', value: v })
								}}
								value={additionalValue?.purchaseSelected}
								error={fieldError.errors?.purchaseSelected}
							/>
						),
					},
					{
						label: 'ต้องการแสดงงวดผ่อนในใบเสนอราคา',
						col: 8,
						item: (
							<Select
								placeholder='กรุณาระบุ'
								name='installment'
								options={installmentOption}
								onChange={(v) => {
									onSelectChange({
										name: 'installment',
										value: { show_ins: v === 0 ? 'no' : 'yes', typePay: v },
									})
								}}
								value={additionalValue?.installment?.typePay}
							/>
						),
					},
					{
						label: '',
						col: 24,
						hide: !incompleteInfo,
						item: (
							<Alert
								style={{ textAlign: 'center' }}
								type='error'
								message='กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและเลือกประกันอย่างน้อย 1 แคมเปญ'
							/>
						),
					},
					{
						label: '',
						col: 24,
						item: (
							<Box style={{ textAlign: 'center' }}>
								<Button
									className='accept-btn'
									width='180'
									style={{ marginTop: '20px' }}
									onClick={handleClick.submitToInsur}
								>
									<Label className='save-label'>ออกใบเสนอราคา</Label>
								</Button>
							</Box>
						),
					},
				],
			},
		},
	]

	return (
		<>
			{form.map((e, i) => {
				const { section } = e
				return (
					<Box key={i}>
						<Row
							gutter={[16, 16]}
							style={{
								marginLeft: '20px',
								marginRight: '20px',
								marginTop: '30px',
								textAlign: 'start',
							}}
						>
							{section.items.map((el, il) => {
								return (
									!el.hide && (
										<Col xs={el.col} key={il}>
											{el.label && (
												<Label>
													{el.label}{' '}
													{el.required && (
														<span style={{ color: 'red' }}>*</span>
													)}
												</Label>
											)}
											<Box>{el.item}</Box>
										</Col>
									)
								)
							})}
						</Row>
					</Box>
				)
			})}
		</>
	)
}
