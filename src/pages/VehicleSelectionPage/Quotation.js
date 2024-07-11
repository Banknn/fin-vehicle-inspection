import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { saveAs } from 'file-saver'
import { Container, Box, Image, Label, Button } from '../../components'
import {
	isValidResponse,
	redirect,
	ROUTE_PATH,
	storeCustomer,
} from '../../helpers'
import {
	paymentController,
	quotationController,
	systemController,
} from '../../apiServices'
import { loadingAction } from '../../actions'

export const Quotation = ({
	selectionHeader,
	updateCurrentSubstep,
	quotationCampaign,
	additionalValue,
	carInfo,
}) => {
	const dispatch = useDispatch()
	const campaignData = useSelector(
		(state) => state.quotationReducer.campaignData
	)
	const customer = useSelector(
		(state) => state.customerReducer
	)
	const [isModalOpen, setModalOpen] = useState(false)
	const [saveStatus, setSaveStatus] = useState(false)
	const [addressBill, setAddressBill] = useState('fin')
	const [finAddress, setFinAddress] = useState('')
	const [vifAddress, setVifAddress] = useState('')
	const [finColor, setFinColor] = useState('#f14d51')
	const [vifColor, setVifColor] = useState('#c4c4c4')

	const toggleModal = () => {
		setModalOpen(!isModalOpen)
	}

	const handleDownload = (downloadOption) => {
		switch (downloadOption) {
			case 'pdf':
				const quotationUrl = addressBill === "fin" ? finAddress.url : vifAddress.url
				saveAs(quotationUrl, 'quotation_pdf')
				break
			case 'img':
				const quotationImg = addressBill === "fin" ? finAddress.url_img : vifAddress.url_img
				saveAs(quotationImg, 'quotation_img')
				break
			default:
				break
		}
	}

	const handleWorkWaiting = async () => {
		const success = !saveStatus && (await savePlan())
		if (success || saveStatus) {
			redirect(ROUTE_PATH.SELECT_PLAN.LINK)
		} else {
			Modal.error({
				title: 'บันทึกไม่สำเร็จสำเร็จ',
			})
		}
	}

	const handleSavePlan = async () => {
		const success = !saveStatus && (await savePlan())
		if (success || saveStatus) {
			toggleModal()
		} else {
			Modal.error({
				title: 'บันทึกไม่สำเร็จสำเร็จ',
			})
		}
	}

	const savePlan = useCallback(async () => {
		dispatch(loadingAction(true))
		const systemAPI = systemController()
		const paymentAPI = paymentController()
		const {
			name,
			tel,
			vehicleRegistrationNumber,
			purchaseSelected,
			camera,
			plans,
			carCode,
			insuranceType,
			lastname,
			title,
      vehicleRegistrationArea,
		} = additionalValue
		const { carBrand, carYear, carSeries, carSubSeries } = carInfo
		const planAuto = {
			title,
			name,
			lastname: lastname || null,
			tel: tel || '-',
			idcar: vehicleRegistrationNumber || '-',
			selectprb: purchaseSelected,
			selectcamera: camera,
			brandplan: carBrand.brand,
			seriesplan: carSeries.series,
			sub_seriesplan: carSubSeries.sub_series,
			yearplan: carYear.year,
			plans,
			no_car: parseInt(carCode.idcar),
			type_status: 'auto',
			type: insuranceType.type,
			repair_type: insuranceType.repair_type,
			type_insure: 'ตรอ',
      carprovince_type: vehicleRegistrationArea,
		}
		const savePlanRes = await systemAPI.savePlanAuto(planAuto)
		if (isValidResponse(savePlanRes)) {
			const quoNum = savePlanRes.result.quo_num
			const paymentParams = {
				quo_num: quoNum,
				chanel: 'เข้าฟิน',
			}
			const saveTranRes = await paymentAPI.savePay(paymentParams)
			if (isValidResponse(saveTranRes)) {
				await storeCustomer({ ...customer, quoNum: quoNum })
				setSaveStatus(true)
				dispatch(loadingAction(false))
				return true
			}
		}
		dispatch(loadingAction(false))
		return false
	}, [dispatch, additionalValue, carInfo, customer])

	const handleBillAddress = async (address) => {
		dispatch(loadingAction(true))
		if (address === 'fin') {
			setAddressBill(address)
			dispatch(loadingAction(false))
		}
		if (address === 'vif') {
			setAddressBill(address)
			if (vifAddress.length === 0) {
				const API = quotationController()
				const res = await API.generateCampaignQuotation({
					...campaignData,
					addressBill: address,
				})
				if (isValidResponse(res)) {
					const quotationResult = res.result
					setVifAddress(quotationResult)
					dispatch(loadingAction(false))
				}
			}
			dispatch(loadingAction(false))
		}
	}

	useEffect(() => {
		setFinAddress(quotationCampaign)
		addressBill === 'fin' ? setFinColor('#f14d51') : setFinColor('#c4c4c4')
		addressBill === 'vif' ? setVifColor('#f14d51') : setVifColor('#c4c4c4')
	}, [quotationCampaign, addressBill])

	return (
		<div>
			<Modal
				footer={[
					<Button key='cancel' className='cancel-btn' onClick={toggleModal}>
						<Label style={{ fontSize: '16px', fontWeight: 'bold' }}>
							ยกเลิก
						</Label>
					</Button>,
				]}
				title={
					<Box
						className='col-center-wrapper'
						style={{ justifyContent: 'flex-start' }}
					>
						<InfoCircleOutlined
							style={{
								fontSize: '30px',
								color: 'yellowgreen',
								marginRight: '15px',
							}}
						/>
						<Label style={{ fontSize: '22px', fontFamily: 'anakotmai-bold' }}>
							ต้องการดาวน์โหลดอย่างไร?
						</Label>
					</Box>
				}
				visible={isModalOpen}
				onCancel={toggleModal}
				centered
			>
				<Box
					className='col-center-wrapper'
					style={{ justifyContent: 'space-evenly' }}
				>
					<Button
						className='save-btn'
						style={{ width: '170px' }}
						onClick={() => handleDownload('pdf')}
					>
						<Label className='save-label'>PDF</Label>
					</Button>
					<Button
						className='save-btn'
						style={{ width: '170px' }}
						onClick={() => handleDownload('img')}
					>
						<Label className='save-label'>รูปภาพ</Label>
					</Button>
				</Box>
			</Modal>
			<Container className='quotation-wrapper'>
				<Container className='selection-wrapper'>
					{selectionHeader('ใบเสนอราคา', () => updateCurrentSubstep('dec'))}
					<Box className='col-center-wrapper'>
						<Button
							className='accept-btn'
							width='200'
							bgColor={finColor}
							onClick={() => handleBillAddress('fin')}
						>
							<Label className='save-label'>หัวบิลในนามบริษัท</Label>
						</Button>
						<Button
							className='accept-btn'
							width='200'
							bgColor={vifColor}
							onClick={() => handleBillAddress('vif')}
						>
							<Label className='save-label'>หัวบิลในนาม (ตรอ)</Label>
						</Button>
					</Box>
					<Image
						src={
							addressBill === 'fin' ? finAddress.url_img : vifAddress.url_img
						}
						className='quotation-img'
					/>
					<Box className='col-center-wrapper'>
						<Button
							className='accept-btn'
							width='220'
							bgColor='#04CD00'
							onClick={handleSavePlan}
						>
							<Label className='save-label'>บันทึกและดาวน์โหลด</Label>
						</Button>
						<Button
							className='accept-btn'
							width='180'
							style={{ width: '170px' }}
							onClick={handleWorkWaiting}
						>
							<Label className='save-label'>แจ้งงาน</Label>
						</Button>
					</Box>
				</Container>
			</Container>
		</div>
	)
}
