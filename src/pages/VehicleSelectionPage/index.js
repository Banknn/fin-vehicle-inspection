import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import { LeftOutlined, CarOutlined } from '@ant-design/icons'
import {
	Container,
	Box,
	Image,
	Label,
	Button,
	Step,
	Input,
} from '../../components'
import { carController, defaultController } from '../../apiServices'
import { isValidResponse } from '../../helpers'
import { loadingAction, customerAction } from '../../actions'
import { AdditionalInfo } from './AdditionalInfo'
import { Quotation } from './Quotation'

export const VehicleSelectionPage = () => {
	const dispatch = useDispatch()
	const customer = useSelector((state) => state.customerReducer)
	const [currentStep, setCurrentStep] = useState(0)
	const [currentSubstep, setCurrentSubstep] = useState(0)
	const [carBrand, setCarBrand] = useState({ brand: '', no: '' })
	const [carYear, setCarYear] = useState({ year: '', id_year: '' })
	const [carSeries, setCarSeries] = useState({
		series: '',
		id_series: '',
	})
	const [carSubSeries, setCarSubSeries] = useState({
		sub_series: '',
		id_subseries: '',
	})
	const [searchValue, setSearchValue] = useState('')
	const [additionalValue, setAdditionalValue] = useState({
		legal: 'บุคคลทั่วไป',
		plans: [],
	})
	const [quotationCampaign, setQuotationCampaign] = useState({})
	//-------------------------- LIST ------------------------------------
	const [brandList, setBrandList] = useState([])
	const [yearList, setYearList] = useState([])
	const [seriesList, setSeriesList] = useState([])
	const [subSeriesList, setSubSeriesList] = useState([])

	const fetchBrands = useCallback(async () => {
		dispatch(loadingAction(true))
		const carAPI = carController()
		const carRes = await carAPI.getAllBrands()
		if (isValidResponse(carRes)) {
			const brandsList = carRes.result.filter(
				(e) => !['BMW', 'Mercedes-Benz'].includes(e.brand)
			)
			console.log(brandsList)

			setBrandList(brandsList)
		}
		dispatch(loadingAction(false))
	}, [dispatch])

	const fetchYears = useCallback(
		async (brand) => {
			dispatch(loadingAction(true))
			const API = carController()
			const res = await API.getYearsByBrandID(brand)
			if (isValidResponse(res)) {
				const yearsList = res.result
				setYearList(yearsList)
			}
			dispatch(loadingAction(false))
		},
		[dispatch]
	)

	const fetchSeries = useCallback(
		async (year) => {
			dispatch(loadingAction(true))
			const API = carController()
			const res = await API.getSeriesByYearID(year)
			if (isValidResponse(res)) {
				const seriesList = res.result
				setSeriesList(seriesList)
			}
			dispatch(loadingAction(false))
		},
		[dispatch]
	)

	const fetchSubseries = useCallback(
		async (series) => {
			dispatch(loadingAction(true))
			const API = carController()
			const res = await API.getSubseriesBySeriesID(series)
			if (isValidResponse(res)) {
				const subseriesList = res.result
				setSubSeriesList(subseriesList)
			}
			dispatch(loadingAction(false))
		},
		[dispatch]
	)

	const fetchCarDetail = useCallback(
		async (params) => {
			const defaultAPI = defaultController()
			const carAPI = carController()
			const carDetailRes = await carAPI.findDetailCar(params)
			const autoSceneRes = await defaultAPI.getAutoScene()
			if (isValidResponse(carDetailRes) && isValidResponse(autoSceneRes)) {
				const codeList = autoSceneRes.result.idcar

				const carDetailResult = carDetailRes.result
				const { price, no_car } = carDetailResult[1]
				const carCode = codeList.find((el) => {
					if (el.value === no_car.toString()) return true
					return false
				})
				setAdditionalValue({
					...additionalValue,
					carCode: { label: carCode.label, idcar: carCode.value },
					assured: price,
					newInsuranceBudget: price,
				})
			}
		},
		[additionalValue]
	)

	useEffect(() => {
		fetchBrands()
	}, [fetchBrands])

	useEffect(() => {
		const store = async () => {
			const updatedCustomer = {
				...customer,
				legal: additionalValue.legal,
				brand: carBrand.brand,
				year: carYear.year,
				series: carSeries.series,
				subSeries: carSubSeries.sub_series,
				input: {
					name: additionalValue.name,
					lastname: additionalValue.lastname,
					tel: additionalValue.tel,
					vehicleRegistrationNumber: additionalValue.vehicleRegistrationNumber,
				},
				select: {
					title: additionalValue.title,
					vehicleRegistrationArea: additionalValue.vehicleRegistrationArea,
				},
			}

			dispatch(customerAction(updatedCustomer))
		}
		store()
	}, [carBrand, carYear, carSeries, carSubSeries, additionalValue, dispatch])

	const onStepChange = (current) => {
		let count = currentStep
		if (count === 4) {
			setAdditionalValue({ legal: 'บุคคลทั่วไป' })
			setCurrentSubstep(0)
			if (count === current) count = -1
			else count--
		}
		if (count === 3) {
			setCarSubSeries({ sub_series: '', id_subseries: '' })
			if (count === current) count = -1
			else count--
		}
		if (count === 2) {
			setCarSeries({ series: '', id_series: '' })
			if (count === current) count = -1
			else count--
		}
		if (count === 1) {
			setCarYear({ year: '', id_year: '' })
			if (count === current) count = -1
			else count--
		}
		if (count === 0) {
			setCarBrand({ brand: '', no: '' })
		}
		setSearchValue('')
		setCurrentStep(current)
	}

	const incStep = () => {
		setSearchValue('')
		setCurrentStep(currentStep + 1)
	}

	const decStep = () => {
		switch (currentStep) {
			case 1:
				setCarBrand({ brand: '', no: '' })
				setCarYear({ year: '', id_year: '' })
				break
			case 2:
				setCarYear({ year: '', id_year: '' })
				setCarSeries({ series: '', id_series: '' })
				break
			case 3:
				setCarSeries({ series: '', id_series: '' })
				setCarSubSeries({ sub_series: '', id_subseries: '' })
				break
			case 4:
				setCarSubSeries({ sub_series: '', id_subseries: '' })
				setAdditionalValue({ legal: 'บุคคลทั่วไป' })
				break
			default:
				break
		}
		setCurrentStep(currentStep - 1)
	}

	const updateCurrentSubstep = (opr) => {
		if (opr === 'inc') {
			setCurrentSubstep(currentSubstep + 1)
		} else if (opr === 'dec') {
			switch (currentSubstep) {
				case 1:
					const {
						camera,
						vehicleRegistrationArea,
						carCode,
						insuranceType,
						addon,
						oldInsuranceBudget,
						newInsuranceBudget,
						assured,
					} = additionalValue
					setAdditionalValue({
						camera,
						vehicleRegistrationArea,
						carCode,
						insuranceType,
						addon,
						oldInsuranceBudget,
						newInsuranceBudget,
						assured,
						plans: [],
						legal: 'บุคคลทั่วไป',
					})
					break
				case 2:
					setAdditionalValue({ ...additionalValue, plans: [] })
					break
				default:
					break
			}
			setCurrentSubstep(currentSubstep - 1)
		}
	}

	const onSelectBrand = (brand) => {
		setCarBrand(brand)
		incStep()
		fetchYears(brand.no)
	}

	const onSelectYear = (year) => {
		setCarYear(year)
		incStep()
		fetchSeries(year.id_year)
	}

	const onSelectSeries = (series) => {
		setCarSeries(series)
		incStep()
		fetchSubseries(series.id_series)
	}

	const onSelectSubseries = async (subseries) => {
		setCarSubSeries(subseries)
		await fetchCarDetail({
			id_brand: carBrand.no,
			id_year: carYear.id_year,
			id_series: carSeries.id_series,
			id_subseries: subseries.id_subseries,
		})
		incStep()
	}

	const onInputChange = (e) => {
		const { name, value } = e.target
		setAdditionalValue({ ...additionalValue, [name]: value })
	}

	const onSelectChange = (obj) => {
		const { name, value, calculated } = obj
		if (name === 'oldInsuranceBudget') {
			setAdditionalValue({
				...additionalValue,
				[name]: value,
				newInsuranceBudget: calculated,
			})
		} else {
			setAdditionalValue({ ...additionalValue, [name]: value })
			if (name === 'insuranceType') {
				setAdditionalValue({
					...additionalValue,
					[name]: value,
					assured:
						value.type === '1' || value.type === '1+'
							? 470000
							: value.type === '2' || value.type === '2+'
							? 1000000
							: 0,
					newInsuranceBudget:
						value.type === '1' || value.type === '1+'
							? 470000
							: value.type === '2' || value.type === '2+'
							? 100000
							: value.type === '3+'
							? 90000
							: 0,
				})
			}
		}
	}

	const stepTitle = (step) => {
		if (currentStep === step) return 'กำลังดำเนินการ'
		else if (currentStep >= step) return 'ดำเนินการแล้ว'
		else return 'รอดำเนินการ'
	}

	const stepDescription = (step, description) => {
		let waiting = '-waiting'
		let status = '-'
		if (currentStep >= step) waiting = ''
		switch (step) {
			case 0:
				status = carBrand.brand ? carBrand.brand : status
				break
			case 1:
				status = carYear.year ? carYear.year : status
				break
			case 2:
				status = carSeries.series ? carSeries.series : status
				break
			case 3:
				status = carSubSeries.sub_series ? carSubSeries.sub_series : status
				break
			case 4:
				return (
					<Label className={'step-description' + waiting}>{description}</Label>
				)
			default:
				break
		}
		return (
			<div>
				<Label className={'step-description' + waiting}>{description}</Label>
				<Label className={'step-state' + waiting}>{status}</Label>
			</div>
		)
	}

	const stepSelection = () => {
		switch (currentStep) {
			case 0:
				return brandSelection(brandList, onSelectBrand, searchValue)
			case 1:
				return yearSelection(yearList, decStep, onSelectYear, searchValue)
			case 2:
				return seriesSelection(seriesList, decStep, onSelectSeries, searchValue)
			case 3:
				return subseriesSelection(
					subSeriesList,
					decStep,
					onSelectSubseries,
					searchValue
				)
			case 4:
				return additionalInfo(
					decStep,
					currentSubstep,
					updateCurrentSubstep,
					onInputChange,
					onSelectChange,
					additionalValue,
					{
						carBrand,
						carYear,
						carSeries,
						carSubSeries,
					},
					setQuotationCampaign
				)
			default:
				return
		}
	}

	return (
		<Container>
			{currentSubstep !== 2 ? (
				<Row>
					<Col span={15} offset={1} style={{ marginBottom: '3em' }}>
						<Container className='selection-info'>
							<Box className='car-detail-header-wrapper'>
								<CarOutlined
									style={{
										color: 'white',
										fontSize: '40px',
										marginRight: '0.5em',
									}}
								></CarOutlined>
								<Label className='step-header'>ระบุข้อมูลรถยนต์</Label>
								{currentStep < 4 && (
									<Input.Search
										style={{ width: '40%', alignSelf: 'center' }}
										placeholder='ค้นหา'
										onChange={(e) => setSearchValue(e.target.value)}
										value={searchValue}
									/>
								)}
							</Box>
							{stepSelection()}
						</Container>
					</Col>
					<Col span={8} style={{ marginBottom: '8em' }}>
						<Container className='selection-step'>
							<Box className='car-detail-header-wrapper'>
								<Box className='selection-header'>
									<Label className='step-header'>ขั้นตอน</Label>
								</Box>
							</Box>
							<Container className='step-wrapper'>
								<Step
									className='vehicle-selection-steps'
									direction='vertical'
									current={currentStep}
									onChange={onStepChange}
									steps={[
										{
											title: stepTitle(0),
											description: stepDescription(0, 'ยี่ห้อรถยนต์'),
											disabled: currentStep < 0,
										},
										{
											title: stepTitle(1),
											description: stepDescription(1, 'ปีรถยนต์'),
											disabled: currentStep < 1,
										},
										{
											title: stepTitle(2),
											description: stepDescription(2, 'รุ่นรถยนต์'),
											disabled: currentStep < 2,
										},
										{
											title: stepTitle(3),
											description: stepDescription(3, 'รุ่นย่อยรถยนต์'),
											disabled: currentStep < 3,
										},
										{
											title: stepTitle(4),
											description: stepDescription(4, 'บันทึกข้อมูล'),
											disabled: currentStep < 4,
										},
									]}
								/>
							</Container>
						</Container>
						{currentSubstep === 1 && (
							<Container className='selection-step'>
								<Box className='car-detail-header-wrapper'>
									<Box className='selection-header'>
										<Label className='step-header'>ข้อมูลเพิ่มเติม</Label>
									</Box>
								</Box>
								<Box className='additional-info-box'>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>จังหวัดป้ายทะเบียน: </span>
										{additionalValue.vehicleRegistrationArea}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>รหัสรถยนต์: </span>
										{additionalValue.carCode.label}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>ประเภทประกัน: </span>
										{additionalValue.insuranceType.label}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>กล้องหน้ารถ: </span>
										{additionalValue.camera === 'yes' ? 'มี' : 'ไม่มี'}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>อุปกรณ์เพิ่มเติม: </span>
										{additionalValue.addon.label}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>ทุนประกันเดิม: </span>
										{Intl.NumberFormat().format(
											additionalValue.oldInsuranceBudget || 0
										)}
									</Label>
									<Label className='additional-info'>
										<span style={{ color: 'red' }}>ทุนประกันใหม่: </span>
										{Intl.NumberFormat().format(
											additionalValue.newInsuranceBudget
										)}
									</Label>
								</Box>
							</Container>
						)}
					</Col>
				</Row>
			) : (
				quotation(updateCurrentSubstep, quotationCampaign, additionalValue, {
					carBrand,
					carYear,
					carSeries,
					carSubSeries,
				})
			)}
		</Container>
	)
}
export default VehicleSelectionPage

const brandSelection = (brandList, onSelectBrand, searchValue) => {
	return (
		<Container className='selection-wrapper'>
			<Row align='middle' style={{ marginBottom: '20px' }}>
				<Col span={24}>
					<Label className='title-form'>เลือกยี่ห้อรถยนต์</Label>
				</Col>
			</Row>
			<Row
				gutter={[16, 16]}
				style={{
					marginLeft: '30px',
					marginRight: '30px',
					marginBottom: '40px',
				}}
			>
				{BrandTable(brandList, onSelectBrand, searchValue)}
			</Row>
			{selectionFooter('รูปโลโก้', 'ยี่ห้อรถยนต์')}
		</Container>
	)
}

const yearSelection = (yearList, decStep, onSelectYear, searchValue) => {
	return (
		<Container className='selection-wrapper'>
			{selectionHeader('เลือกปีรถยนต์', decStep)}
			<Row
				gutter={[16, 16]}
				style={{
					marginLeft: '30px',
					marginRight: '30px',
					marginBottom: '40px',
				}}
			>
				{YearsTable(yearList, onSelectYear, searchValue)}
			</Row>
			{selectionFooter('ปี', 'ปีรถยนต์')}
		</Container>
	)
}

const seriesSelection = (seriesList, decStep, onSelectSeries, searchValue) => {
	return (
		<Container className='selection-wrapper'>
			{selectionHeader('เลือกรุ่นรถยนต์', decStep)}
			<Row
				gutter={[16, 16]}
				style={{
					marginLeft: '30px',
					marginRight: '30px',
					marginBottom: '40px',
				}}
			>
				{SeriesTable(seriesList, onSelectSeries, searchValue)}
			</Row>
			{selectionFooter('รุ่น', 'รุ่นรถยนต์')}
		</Container>
	)
}

const subseriesSelection = (
	subSeriesList,
	decStep,
	onSelectSubseries,
	searchValue
) => {
	return (
		<Container className='selection-wrapper'>
			{selectionHeader('เลือกรุ่นย่อยรถยนต์', decStep)}
			<Row
				gutter={[16, 16]}
				style={{
					marginLeft: '30px',
					marginRight: '30px',
					marginBottom: '40px',
				}}
			>
				{SubseriesTable(subSeriesList, onSelectSubseries, searchValue)}
			</Row>
			{selectionFooter('รุ่นย่อย', 'รุ่นย่อยรถยนต์')}
		</Container>
	)
}

const additionalInfo = (
	decStep,
	currentSubstep,
	updateCurrentSubstep,
	onInputChange,
	onSelectChange,
	additionalValue,
	carInfo,
	setQuotationCampaign
) => {
	return (
		<AdditionalInfo
			selectionHeader={selectionHeader}
			decStep={decStep}
			currentSubstep={currentSubstep}
			updateCurrentSubstep={updateCurrentSubstep}
			onInputChange={onInputChange}
			onSelectChange={onSelectChange}
			additionalValue={additionalValue}
			carInfo={carInfo}
			setQuotationCampaign={setQuotationCampaign}
		/>
	)
}

const selectionHeader = (description, decStep) => {
	return (
		<Row align='middle' style={{ marginBottom: '20px' }}>
			<Col span={6}>
				<Box className='prev-wrapper'>
					<Button className='next-back-btn' onClick={decStep}>
						<LeftOutlined
							style={{ color: 'red', fontSize: '26px', marginRight: '10px' }}
						/>
						ย้อนกลับ
					</Button>
				</Box>
			</Col>
			<Col span={12}>
				<Label className='title-form'>{description}</Label>
			</Col>
		</Row>
	)
}

const selectionFooter = (target, destination) => {
	return (
		<Row align='middle' style={{ marginBottom: '20px' }}>
			<Col span={24}>
				<Label className='selection-footer'>
					กดที่ <span style={{ color: 'red' }}>{target}</span> เพื่อเลือก
					{destination}
				</Label>
			</Col>
		</Row>
	)
}

const BrandTable = (brandList, onSelectBrand, searchValue) => {
	const brandsItem = brandList
		.filter(
			(el) => el.brand.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
		)
		.map((el, index) => (
			<Col key={index} span={12}>
				<Button
					className='brand-btn'
					onClick={() => onSelectBrand({ brand: el.brand, no: el.no })}
				>
					<Image src={el.icon} className='brand-logo' />
					<Label className='car-brand'>{el.brand}</Label>
				</Button>
			</Col>
		))

	return brandsItem
}

const YearsTable = (yearList, onSelectYear, searchValue) => {
	const yearsItem = yearList
		.filter(
			(el) =>
				el.year.toString().indexOf(searchValue) >= 0 ||
				(el.year + 543).toString().indexOf(searchValue) >= 0
		)
		.sort((el1, el2) => {
			return el2.year - el1.year
		})
		.map((el, index) => (
			<Col key={index} span={24}>
				<Button
					className='selection-btn'
					onClick={() => onSelectYear({ year: el.year, id_year: el.id_year })}
				>
					<Label className='selection-option'>
						ปี {el.year} (พ.ศ.{el.year + 543})
					</Label>
				</Button>
			</Col>
		))

	return yearsItem
}

const SeriesTable = (seriesList, onSelectSeries, searchValue) => {
	const seriesItem = seriesList
		.filter(
			(el) => el.series.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
		)
		.map((el, index) => (
			<Col key={index} span={24}>
				<Button
					className='selection-btn'
					onClick={() =>
						onSelectSeries({ series: el.series, id_series: el.id_series })
					}
				>
					<Label className='selection-option'>{el.series}</Label>
				</Button>
			</Col>
		))

	return seriesItem
}

const SubseriesTable = (subSeriesList, onSelectSubseries, searchValue) => {
	const subseriesItem = subSeriesList
		.filter(
			(el) =>
				el.sub_series.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
		)
		.map((el, index) => (
			<Col key={index} span={24}>
				<Button
					className='selection-btn'
					onClick={() =>
						onSelectSubseries({
							sub_series: el.sub_series,
							id_subseries: el.id_subseries,
						})
					}
				>
					<Label className='selection-option'>{el.sub_series}</Label>
				</Button>
			</Col>
		))

	return subseriesItem
}

const quotation = (
	updateCurrentSubstep,
	quotationCampaign,
	additionalValue,
	carInfo
) => {
	return (
		<Quotation
			selectionHeader={selectionHeader}
			updateCurrentSubstep={updateCurrentSubstep}
			quotationCampaign={quotationCampaign}
			additionalValue={additionalValue}
			carInfo={carInfo}
		/>
	)
}
