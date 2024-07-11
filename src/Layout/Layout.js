import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'
import { Drawer, Dropdown, Menu, Modal } from 'antd'
import {
	creditAction,
	loadingAction,
	setRouteHistory,
	profileAction,
	permissionsAction,
	notiOverdueAction,
} from '../actions'
import {
	Box,
	Container,
	Header,
	Image,
	Label,
	Footer,
	Link,
	Hamburger,
	MenuList,
	Loading,
} from '../components'
import {
	convertStrToFormat,
	isValidResponse,
	LIST,
	processLogout,
	redirect,
	ROUTE_PATH,
	setUserAuth,
} from '../helpers'
import { userController, systemController } from '../apiServices'
import moment from 'moment'

export const Layout = ({ children }) => {
	const dispatch = useDispatch()
	const isLoading = useSelector((state) => state.loadingReducer)
	const userAuth = useSelector((state) => state.authenReducer)
	const { creditBalance } = useSelector((state) => state.creditReducer)
	const premistions = useSelector((state) => state.premissionsReducer)
	const notiOverdue = useSelector((state) => state.notiOverdueReducer)
	const history = useHistory()
	const location = useLocation()
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [profile, setProfile] = useState({})

	const fetchData = useCallback(async () => {
		if (userAuth.status) {
			const { access_token } = userAuth
			const API = userController({ access_token })
			const res = await API.getProfile()
			if (isValidResponse(res)) {
				const dataResult = res.result
				const { credit_vif_cur, credit_vif_total, credit_vif_use } = dataResult
				setProfile(dataResult)
				setUserAuth({ access_token, dataResult })
				dispatch(loadingAction(false))
				dispatch(
					creditAction({
						creditBalance: credit_vif_cur,
						creditTotal: credit_vif_total,
						creditUse: credit_vif_use,
					})
				)
				dispatch(profileAction(dataResult))
			} else {
				await processLogout()
				setProfile({})
				window.location.href =
					'https://www.fininsurance.co.th/finlock?action=logout'
			}
		}
	}, [dispatch, userAuth])

	const fetchPremission = useCallback(async () => {
		if (userAuth.status && premistions.sha_code) {
			const API = userController()
			const res = await API.checkPremissionteam(premistions.sha_code)
			if (isValidResponse(res)) {
				const paramsPremiss = res.result
				dispatch(permissionsAction(paramsPremiss))
			}
		}
	}, [dispatch, userAuth, premistions.sha_code])

	const fetchOverDue = useCallback(async () => {
		if (
			(location.pathname === ROUTE_PATH.HOMEPAGE.LINK ||
				location.pathname === ROUTE_PATH.COMPULSORY_MOTOR.LINK ||
				location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK ||
				location.pathname === ROUTE_PATH.VEHICLE_SELECTION.LINK ||
				location.pathname === ROUTE_PATH.WORKWAITING.LINK) &&
			profile.vif_type === '2'
		) {
			const API = systemController()
			const res = await API.checkNotiOverdue()
			if (isValidResponse(res)) {
				const dataResult = res.result
				const { overdue } = dataResult[0]
				const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
				const dateShowOverDue = moment(notiOverdue.date_show || dateNow).format(
					'YYYY-MM-DD HH:mm:ss'
				)
				if (overdue && dateShowOverDue <= dateNow) {
					dispatch(
						notiOverdueAction({
							date_show: moment().add(2, 'hours'),
						})
					)
					Modal.warning({
						title: `ท่านมียอดค้างชำระเกินดิว !!`,
						content: `กรุณาชำระยอดคงค้าง จำนวน ${convertStrToFormat(
							overdue,
							'money'
						)} บาท ให้เรียบร้อย`,
					})
				}
			}
		}
	}, [dispatch, location, profile.vif_type, notiOverdue.date_show])

	useEffect(() => {
		fetchData()
		fetchPremission()
		fetchOverDue()
		dispatch(setRouteHistory(history))
		if (location.pathname === '/') {
			redirect(ROUTE_PATH.HOMEPAGE.LINK)
		}

		if (profile.vif_type && profile.vif_type !== '1' && creditBalance <= 0) {
			if (
				location.pathname === ROUTE_PATH.COMPULSORY_MOTOR.LINK ||
				location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK ||
				location.pathname === ROUTE_PATH.VEHICLE_SELECTION.LINK ||
				location.pathname === ROUTE_PATH.WORKWAITING.LINK
			) {
				redirect(ROUTE_PATH.HOMEPAGE.LINK)
				Modal.error({
					title: 'ไม่สามารถใช้งานได้',
					content: 'กรุณาชำระเงิน เนื่องจากวงเงินคงเหลือไม่เพียงพอ',
					onOk: () => redirect(`${ROUTE_PATH.REPORT.LINK}/invoice`),
					okText: 'ชำระเครดิต',
				})
			}
		} else if (
			profile.vif_type &&
			profile.vif_type === '1' &&
			creditBalance < 0
		) {
			if (
				location.pathname === ROUTE_PATH.COMPULSORY_MOTOR.LINK ||
				location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK ||
				location.pathname === ROUTE_PATH.VEHICLE_SELECTION.LINK ||
				location.pathname === ROUTE_PATH.WORKWAITING.LINK
			) {
				redirect(ROUTE_PATH.HOMEPAGE.LINK)
				Modal.error({
					title: 'ไม่สามารถใช้งานได้',
					content: 'กรุณาเติมเงิน เนื่องจากวงเงินคงเหลือไม่เพียงพอ',
					onOk: () => redirect(`${ROUTE_PATH.DEBIT.LINK}/plusmoney`),
					okText: 'เติมเครดิต',
				})
			}
		}

		if (profile.is_payment_vif === 'no') {
			if (
				location.pathname === ROUTE_PATH.COMPULSORY_MOTOR.LINK ||
				location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK ||
				location.pathname === ROUTE_PATH.VEHICLE_SELECTION.LINK ||
				location.pathname === ROUTE_PATH.WORKWAITING.LINK
			) {
				redirect(ROUTE_PATH.HOMEPAGE.LINK)
				Modal.error({
					title: 'เนื่องจากเกินเวลากำหนดชำระ ระบบจึงทำการล็อกรหัสผู้ใช้งาน',
					content: 'กรุณาติดต่อเจ้าหน้าที่เพื่อทำการปลดล็อกระบบ',
				})
			}
		}
	}, [
		dispatch,
		history,
		location,
		fetchData,
		fetchPremission,
		fetchOverDue,
		creditBalance,
		profile.vif_type,
		profile.is_payment_vif,
	])

	const handleShowDrawer = () => {
		setDrawerVisible(true)
	}

	const handleCloseDrawer = () => {
		setDrawerVisible(false)
	}

	const logout = async () => {
		await processLogout()
		setProfile({})
		const { device_id, dataResult } = userAuth
		const body = {
			cuscode: dataResult?.cuscode,
			device_id,
		}
		if (dataResult?.cuscode) {
			const API = userController()
			await API.logout(body)
		}
		window.location.href =
			'https://www.fininsurance.co.th/finlock?action=logout'
	}

	const menu = (
		<Menu>
			<Menu.Item key='1'>
				<Label onClick={logout}>ออกจากระบบ</Label>
			</Menu.Item>
		</Menu>
	)

	return (
		<>
			{isLoading && <Loading />}
			<Header>
				<Container className='header-wrapper'>
					<Box className='left-menu'>
						<div>
							<Hamburger onClick={handleShowDrawer} />
							<Drawer
								title={
									<Label className='menu-title'>
										<Image
											//fin-red src='https://www.fininsurance.co.th/wp-content/uploads/2017/01/logo-fin-600x242.png'
											src='https://www.fininsurance.co.th/wp-content/uploads/2017/01/logo-fin-thai.png'
											alt='fin'
											className='logo-header'
										/>
									</Label>
								}
								placement='left'
								closable={false}
								onClose={handleCloseDrawer}
								key='left'
								visible={drawerVisible}
								bodyStyle={{
									padding: 0,
								}}
								width='250'
								headerStyle={{
									background: '#f14d51',
								}}
							>
								<MenuList
									dataList={LIST.MENU(
										profile.vif_type,
										profile.admin_vif,
										profile.role,
										premistions.status_permissions,
										premistions.cuscode
									)}
								/>
							</Drawer>
						</div>
						<Link to={ROUTE_PATH.HOMEPAGE.LINK}>
							<Image
								src='https://www.fininsurance.co.th/wp-content/uploads/2017/01/logo-fin-thai.png'
								alt='ฟินประกันรถ'
								className='logo-header'
							/>
						</Link>
					</Box>
					<Box className='profile-header'>
						<Dropdown overlay={menu} trigger={['click']}>
							<Box>
								<Label className='profile-header-text'>
									ID : {premistions.cuscode} <DownOutlined />
								</Label>
							</Box>
						</Dropdown>
						<Label className='name'>{`ชื่อร้าน: ${premistions.name}`}</Label>
						<Label className='credit'>
							{`วงเงินคงเหลือ: ${
								profile.credit_vif_cur
									? convertStrToFormat(creditBalance, 'money_digit')
									: ''
							} บาท`}{' '}
							{profile.vif_type !== '1' ? '(เครดิต)' : '(เติมเงิน)'}
						</Label>
					</Box>
				</Container>
			</Header>
			{children}
			<Footer>
				<Container className='footer-wrapper'>
					<Box className='social-media-logo-footer-wrapper'>
						<a href='tel:0914939999'>
							<Image
								src='https://fininsurance.co.th/wp-content/uploads/2017/01/tel-test.png'
								alt='FininsuranceTel'
								className='social-media-logo-footer'
							/>
						</a>
						<a href='https://www.facebook.com/fininsurance/'>
							<Image
								src='https://fininsurance.co.th/wp-content/uploads/2017/01/facebooktest.png'
								alt='FininsuranceFacebook'
								className='social-media-logo-footer'
							/>
						</a>
						<a href='https://line.me/R/ti/p/@fininsurance'>
							<Image
								src='https://fininsurance.co.th/wp-content/uploads/2017/01/linetest.png'
								alt='FininsuranceLine'
								className='social-media-logo-footer'
							/>
						</a>
					</Box>
					<div>
						<Label color='white'>Fin Insurance Broker Co,. Ltd.</Label>
					</div>
				</Container>
			</Footer>
		</>
	)
}
