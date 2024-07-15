import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Container,
	Box,
	Card,
	Image,
	Label,
	Modal as ModalCustom,
	Input,
	Icons,
	NewsNotify,
	Select,
} from '../../components'
import {
	systemController,
	addressController,
	newsController,
} from '../../apiServices'
import {
	isValidResponse,
	redirect,
	removeStoreCreditPay,
	removeStoreCustomer,
	removeStoreQuotation,
	ROUTE_PATH,
	convertStrToFormat,
	setFilesSuccess,
	checkCustomer,
} from '../../helpers'
import { customerAction, loadingAction, popupAction } from '../../actions'
import { IMAGES } from '../../themes'
import _ from 'lodash'
import { message } from 'antd'
import moment from 'moment'

const Homepage = () => {
	const modal = useRef(null)
	const modalRenew = useRef(null)
	const popupBroadcast = useRef(null)
	const dispatch = useDispatch()
	const popupList = useSelector((state) => state.popupReducer)
	const [textNews, setTextNews] = useState(null)
	const [carProvince, setCarProvince] = useState(null)
	const [searchCar, setSearchCar] = useState('')
	const user = useSelector((state) => state.profileReducer)
	const [provinceList, setProvinceList] = useState([])
	const [listBroadcast, setListBroadcast] = useState([])

	const handleSearch = async () => {
		dispatch(loadingAction(true))
		const API = systemController()
		const res = await API.findCustomer({
			search: searchCar.replace('-', ''),
			carProvince,
		})
		if (isValidResponse(res)) {
			const customerDetail = res.result
			if (customerDetail.length > 0) {
				const customer = await Object.assign(customerDetail[0], {
					customerType: 'old',
				})
				const {
					quo_num,
					title,
					name,
					lastname,
					tel,
					brandplan,
					yearplan,
					seriesplan,
					sub_seriesplan,
					idcar,
					policyno,
					amountNew,
				} = customer
				const customerList = {
					quoNum: quo_num,
					brand: brandplan,
					year: yearplan,
					series: seriesplan,
					subSeries: sub_seriesplan,
					policyNoOld: !!policyno,
					amountNew,
					input: {
						name: name,
						lastname: lastname,
						tel: tel,
						vehicleRegistrationNumber: idcar,
						policyNo: policyno,
					},
					select: {
						title: title,
					},
					customerType: 'old',
				}
				console.log(customerList)
				dispatch(customerAction(customerList))
				redirect(ROUTE_PATH.CAR_INSURANCE.LINK)
			} else {
				dispatch(loadingAction(false))
				message.error(`ไม่พบข้อมูล`)
			}
		}
	}

	const handleClickCreateNew = async () => {
		dispatch(customerAction({ customerType: 'new' }))
		redirect(ROUTE_PATH.VEHICLE_SELECTION.LINK)
	}

	const getNewsBroadcasts = async () => {
		const API = systemController()
		const res = await API.getNewsBroadcast()
		if (isValidResponse(res)) {
			const news = res.result
			setTextNews(news[0]?.detail)
		}
	}

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
			setProvinceList(province)
		}
	}, [])

	const fetchPopup = useCallback(async () => {
		const currDate = moment().format('YYYY-MM-DD')
		if (popupList?.date !== currDate) {
			dispatch(popupAction({}))
		}

		const API = newsController()
		const res = await API.getBroadcastPopup()
		if (isValidResponse(res) && !['FNG24-114726'].includes(user.cuscode)) {
			let popup = res.result
			popup = popup.filter((e) => e.page === 'homePage')
			setListBroadcast(popup)

			if (popup.length > 0) {
				if (_.isEmpty(popupList)) {
					popupBroadcast.current.open()
				}
			}
		}
	}, [dispatch])

	const handleOkPopup = () => {
		const updatedPopup = {
			...popupList,
			numHomepage: 1,
			date: moment().format('YYYY-MM-DD'),
		}
		dispatch(
			popupAction({
				...updatedPopup,
			})
		)
	}

	useEffect(() => {
		getNewsBroadcasts()
		removeStoreCustomer()
		removeStoreQuotation()
		removeStoreCreditPay()
		fetchAddress()
		fetchPopup()
		setFilesSuccess('')
	}, [fetchAddress, fetchPopup])

	return (
		<Container>
			{!(
				user.name.trim().slice(-14) === '(ควิกเซอร์วิส)' ||
				user.name.trim().slice(-22) === '(บริษัท ชิปป๊อป จำกัด)'
			) &&
				textNews && <NewsNotify text={textNews} />}
			<Box
				style={{
					paddingTop:
						!(
							user.name.trim().slice(-14) === '(ควิกเซอร์วิส)' ||
							user.name.trim().slice(-22) === '(บริษัท ชิปป๊อป จำกัด)'
						) && textNews
							? '40px'
							: 0,
				}}
			>
				<Image
					src={IMAGES['info_2.png']}
					alt='info_2'
					className='info-homepage-img'
				/>
			</Box>
			<Container className='section section-menu-info'>
				<Box className='main-menu'>
					<Card className='menu-card' onClick={() => modal.current.open()}>
						<Image src={IMAGES['auto.png']} alt='check' className='menu-img' />
						<Label className='menu-lb'>เช็คเบี้ยออโต้</Label>
					</Card>
					<ModalCustom
						modalHead='modal-header'
						ref={modal}
						iconsClose={<Icons.CloseOutlined />}
					>
						<Box className='modal-customer'>
							<Box className='modal-customer-old-new'>
								<Label className='topic-cus-old-new'>เช็คเบี้ยลูกค้าใหม่</Label>
								<Box onClick={handleClickCreateNew}>
									<Image
										src={IMAGES['auto.png']}
										alt='check'
										className='cus-old-new-icon-pointer'
									/>
									<Label className='create-data'>กดเช็คเบี้ยรายการใหม่</Label>
								</Box>
								<Label style={{ marginTop: '20px' }}>
									หากไม่มีข้อมูลลูกค้าในระบบ
								</Label>
								<Label>
									<span style={{ color: 'red' }}>กรุณา</span> กดสร้างข้อมูลใหม่
								</Label>
							</Box>
							<Box className='modal-customer-old-new'>
								<Label className='topic-cus-old-new'>เช็คเบี้ยลูกค้าเก่า</Label>
								<Image
									src={IMAGES['auto.png']}
									alt='tax'
									className='cus-old-new-icon'
								/>
								<Box>
									<Select
										style={{
											width: '200px',
											marginBottom: '10px',
											textAlign: 'left',
										}}
										name='carProvince'
										placeholder='จังหวัดป้ายทะเบียน'
										showSearch
										notvalue
										options={provinceList}
										onChange={(v) => setCarProvince(v)}
										value={carProvince}
									/>
									<Input.Search
										style={{
											width: '200px',
										}}
										onSearch={() => {
											if (carProvince && searchCar) {
												handleSearch()
											} else {
												message.error(
													`กรุณากรอกจังหวัดป้ายทะเบียนและเลขทะเบียนให้ครบถ้วน`
												)
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
								</Box>
								<Label style={{ marginTop: '20px' }}>
									หากมีข้อมูลลูกค้าในระบบอยู่แล้ว
								</Label>
								<Label>
									<span style={{ color: 'red' }}>กรุณา</span>{' '}
									กรอกจังหวัดป้ายทะเบียน
									<br />
									และเลขทะเบียนรถ
								</Label>
							</Box>
						</Box>
					</ModalCustom>
					<Card className='menu-card' onClick={() => modalRenew.current.open()}>
						<Image src={IMAGES['tax.png']} alt='tax' className='menu-img' />
						<Label className='menu-lb'>ต่ออายุประกัน</Label>
					</Card>
					<ModalCustom
						modalHead='modal-header'
						ref={modalRenew}
						iconsClose={<Icons.CloseOutlined />}
					>
						<Box className='modal-customer-renew'>
							<Box className='modal-customer-old-new'>
								<Label className='topic-cus-old-new'>ต่ออายุลูกค้าเก่า</Label>
								<Image
									src={IMAGES['tax.png']}
									alt='tax'
									className='cus-old-new-icon'
								/>
								<Box>
									<Select
										style={{
											width: '200px',
											marginBottom: '10px',
											textAlign: 'left',
										}}
										name='carProvince'
										placeholder='จังหวัดป้ายทะเบียน'
										showSearch
										notvalue
										options={provinceList}
										onChange={(v) => setCarProvince(v)}
										value={carProvince}
									/>
									<br />
									<Input.Search
										style={{
											width: '200px',
										}}
										onSearch={() => {
											if (carProvince && searchCar) {
												handleSearch()
											} else {
												message.error(
													`กรุณากรอกจังหวัดป้ายทะเบียนและเลขทะเบียนให้ครบถ้วน`
												)
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
								</Box>
								<Label style={{ marginTop: '20px' }}>
									ค้นหาข้อมูลลูกค้าในระบบสำหรับต่ออายุ
								</Label>
								<Label>
									<span style={{ color: 'red' }}>โดย</span>{' '}
									กรอกจังหวัดป้ายทะเบียน และเลขทะเบียนรถ
								</Label>
							</Box>
						</Box>
					</ModalCustom>
					{/* <Card className='menu-card-disabled'>
						<Image src={IMAGES['tax.png']} alt='tax' className='menu-img' />
						<Label className='menu-lb'>คำนวณภาษีรถ</Label>
					</Card> */}
					<Card
						className='menu-card'
						onClick={() => {
							redirect(ROUTE_PATH.COMPULSORY_MOTOR.LINK)
						}}
					>
						<Image
							src={IMAGES['compulsory.png']}
							alt='compulsory'
							className='menu-img'
						/>
						<Label className='menu-lb'>แจ้งงาน พ.ร.บ.</Label>
					</Card>
					<Card
						className='menu-card'
						onClick={() => redirect(ROUTE_PATH.WORKWAITING.LINK)}
					>
						<Image
							src={IMAGES['work-waiting.png']}
							alt='work-waiting'
							className='menu-img'
						/>
						<Label className='menu-lb'>แจ้งงาน ประกัน / พ.ร.บ.</Label>
					</Card>
					<Card
						className='menu-card'
						onClick={() => redirect(ROUTE_PATH.TAXRENEW.LINK)}
					>
						<Image
							src={IMAGES['tax.png']}
							alt='work-waiting'
							className='menu-img'
						/>
						<Label className='menu-lb'>ต่อภาษี</Label>
					</Card>
					{checkCustomer(user.cuscode) && (
						<Card
							className='menu-card'
							onClick={() => redirect(ROUTE_PATH.BILLLIST.LINK)}
						>
							<Image
								src={IMAGES['info-customer.png']}
								alt='info-customer'
								className='menu-img'
							/>
							<Label className='menu-lb'>ตรวจสภาพรถ / ล้างรถ / โอนรถ</Label>
						</Card>
					)}
					<ModalCustom
						modalHead='modal-header-red'
						ref={popupBroadcast}
						headerText='ประกาศ'
						okText='ตกลง'
						onCallback={handleOkPopup}
					>
						<Box className='modal-broadcast'>
							{listBroadcast.map((e, i) => {
								return (
									<Box style={{ paddingBottom: '5px' }} key={i}>
										- {e.detail?.replaceAll('n', '\n')}
									</Box>
								)
							})}
						</Box>
					</ModalCustom>
				</Box>
			</Container>
		</Container>
	)
}

export default Homepage
