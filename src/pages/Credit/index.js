import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse, Modal, Progress, Form } from 'antd'
import { saveAs } from 'file-saver'
import _ from 'lodash'
import io from 'socket.io-client'
import moment from 'moment'
import {
	Box,
	Button,
	Container,
	Image,
	InputNumber,
	Select,
	Label,
	Input,
	UploadFiles,
} from '../../components'
import {
	convertStrToFormat,
	getCreditPay,
	isValidResponse,
	LIST,
	redirect,
	removeStoreCreditPay,
	ROUTE_PATH,
} from '../../helpers'
import {
	BASE_API,
	invoiceController,
	qrController,
	systemController,
} from '../../apiServices'
import { loadingAction } from '../../actions'

const Credit = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.profileReducer)
	const { creditBalance, creditTotal } = useSelector(
		(state) => state.creditReducer
	)
	const params = useParams()
	const [creditPercent, setCreditPercent] = useState(0)
	const [data, setData] = useState({})
	const [credit, setCredit] = useState(0)
	const [commission, setCommisstion] = useState(0)
	const [balance, setBalance] = useState(0)
	const [creditPay, setCreditPay] = useState(0)
	const [qrCodeImage, setQrCodeImage] = useState('')
	const [previewImage, setPreviewImage] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [daysInMonth, setDaysInMonth] = useState('')
	const [slipImage, setSlipImage] = useState({})
	const [bank, setBank] = useState('')
	const [typePay, setTypePay] = useState(undefined)
	const [bankList, setBankList] = useState([])
	const [periodDate, setPeriodDate] = useState('')
	const [invNo, setInvNo] = useState('')
	const [note, setNote] = useState('')

	const generateQr = useCallback(
		async (paybill_clear_no, credit) => {
			dispatch(loadingAction(true))
			const params = {
				quo_num: user.vif_type === '2' ? paybill_clear_no : user.cuscode,
				amount: credit,
				tel: typePay === 'clear' ? '0102VIF' : '0101VIF',
				exp_day: '10',
			}
			const API = qrController()
			const res = await API.genCreditTopUp(params)
			if (isValidResponse(res)) {
				const qrCode = res.result.img
				setQrCodeImage(qrCode)
				setCreditPay(credit)
				dispatch(loadingAction(false))
			}
		},
		[user, typePay, dispatch]
	)

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const creditPaymentPrice = getCreditPay()
		const dayOfMonth = moment(new Date()).daysInMonth()
		const { type, period } = params
		const { credit, commission, balance } = creditPaymentPrice
		const percent = (+creditBalance / +creditTotal) * 100
		setCreditPercent(percent)
		setData({ creditBalance, creditTotal })
		setDaysInMonth(dayOfMonth)
		if (type === 'clear') {
			const API = invoiceController()
			const res = await API.genLastInvoiceNumberVif()
			if (isValidResponse(res)) {
				const { name: paybill_clear_no } = res.result[0]
				setInvNo(paybill_clear_no)
				await generateQr(paybill_clear_no, balance)
				dispatch(loadingAction(false))
			}
			setCredit(credit)
			setCommisstion(commission)
			setBalance(balance)
			setTypePay(type)
			setPeriodDate(period)
		}
		Promise.all([LIST.BANKS()]).then((e) => {
			setBankList(e[0])
		})
	}, [params, generateQr, creditBalance, creditTotal, dispatch])

	useEffect(() => {
		fetchData()
		const socket = io(BASE_API, {
			transports: ['websocket'],
			query: {
				quo_num: user.cuscode,
			},
		})
		socket.on('ThaiQRnotification', async (e) => {
			Modal.success({
				title: 'ชำระเครดิตสำเร็จ',
				onOk: async () => {
					await removeStoreCreditPay()
					setBalance(0)
					setCredit(0)
					setCommisstion(0)
					setCreditPay(0)
					redirect(ROUTE_PATH.HOMEPAGE.LINK)
				},
			})
		})
		return () => {
			socket.disconnect()
		}
	}, [fetchData, user, commission, balance, invNo])

	const handleClickGenerateQrCode = async () => {
		await generateQr(credit)
	}

	const handlePreview = (e) => {
		const { src } = e.target
		setModalVisible(true)
		setPreviewImage(src)
	}

	const handleSaveImage = () => {
		saveAs(previewImage, 'fin-qrcode')
	}

	const handleTriggerSlip = (props) => {
		setSlipImage(props)
	}

	const handleSubmitForm = (method) => {
		if (_.isEmpty(slipImage) || !bank) {
			return Modal.error({
				title: `${
					_.isEmpty(slipImage) && !bank
						? 'กรุณาเลือกบัญชีธนาคารและแนบสลิปโอนเงิน'
						: _.isEmpty(slipImage)
						? 'กรุณาแนบสลิปโอนเงิน'
						: 'กรุณาเลือกธนาคาร'
				}`,
			})
		}
		Modal.confirm({
			content: 'ยืนยันการชำระเงิน',
			cancelText: 'ยกเลิก',
			okText: 'ตกลง',
			onOk: () => handleSubmit(method),
		})
	}

	const handleSubmit = useCallback(
		async (method) => {
			dispatch(loadingAction(true))
			let formData = new FormData()
			formData.append('chanel_main', method)
			formData.append('credit', credit)
			formData.append('bank', bank)
			formData.append('vif_type', user.vif_type)
			formData.append('commission', commission)
			formData.append('balance', balance)
			user.vif_type === '2' && formData.append('invNo', invNo)
			formData.append('note', note || null)
			if (slipImage[0]) {
				formData.append('img_credit_vif', slipImage[0].originFileObj)
			}
			const API = systemController()
			const res = await API.saveCreditSlipVif(formData)
			if (isValidResponse(res)) {
				Modal.success({
					title: 'บันทึกสำเร็จ',
					content: 'กรุณารอเจ้าหน้าที่ยืนยันการเติมเครดิต',
					onOk: () => {
						removeStoreCreditPay()
						setBalance(0)
						setCredit(0)
						setCommisstion(0)
						setCreditPay(0)
						setNote('')
						redirect(ROUTE_PATH.HOMEPAGE.LINK)
					},
				})
				dispatch(loadingAction(false))
			} else {
				Modal.error({
					title: 'บันทึกไม่สำเร็จ',
					content: 'กรุณาติดต่อผู้พัฒนา',
				})
				dispatch(loadingAction(false))
			}
		},
		[credit, slipImage, bank, user, balance, commission, invNo, dispatch, note]
	)

	return (
		<Container className='container'>
			<Form>
				<Box className='credit-show-wrapper'>
					<Label className='title-form'>
						{typePay === 'clear' ? 'ระบบชำระเครดิต' : 'ระบบเติมเงิน'}
					</Label>
					<Box className='credit-balance'>
						<Progress type='circle' percent={creditPercent} format={() => ``} />
						<Box className='credit-balance-wrapper'>
							<Label className='balance-text'>ยอดวงเงินเครดิตของคุณ</Label>
							<Label className='balance-credit'>
								{convertStrToFormat(data.creditBalance, 'money_digit')}
							</Label>
						</Box>
					</Box>
					{user.vif_type === '2' && (
						<Box className='amount-credit-wrapper'>
							<Box className='amount-credit'>
								<Label>ยอดเบี้ยรวม</Label>
								<Label>{convertStrToFormat(credit, 'money_digit')}</Label>
							</Box>
							<Box className='amount-credit'>
								<Label>คอมมิชชั่น</Label>
								<Label>{convertStrToFormat(commission, 'money_digit')}</Label>
							</Box>
							<Box className='amount-credit'>
								<Label>ยอดชำระ</Label>
								<Label>{convertStrToFormat(balance, 'money_digit')}</Label>
							</Box>
						</Box>
					)}
					<Box className='credit-addition'>
						{user.vif_type === '2' && (
							<>
								<Label>ช่วงการแจ้งงาน</Label>
								<Select
									name='periodDate'
									value={periodDate}
									placeholder='ช่วงการแจ้งงาน'
									options={[
										{
											key: '1',
											value: '1',
											text: 'วันที่ 1 - 15',
										},
										{
											key: '2',
											value: '2',
											text: `วันที่ 16 - ${daysInMonth}`,
										},
										{
											key: '3',
											value: '3',
											text: 'ทั้งหมด',
										},
									]}
									style={{ marginBottom: '10px' }}
									disabled
								/>
							</>
						)}
						<Label>
							{typePay
								? 'จำนวนเงินเครดิตที่ต้องชำระ'
								: 'กรุณากรอกจำนวนเงินที่ต้องการเพิ่ม'}
						</Label>
						<InputNumber
							name='credit'
							placeholder='จำนวนเงิน'
							value={balance}
							defaultValue={balance}
							onChange={(value) => setCredit(value)}
							formatter={(value) =>
								`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							}
							parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							min={0}
							style={{ marginBottom: '0' }}
							isNotForm
							disabled={typePay}
						/>
						<Collapse
							defaultActiveKey={['1', '2']}
							style={{ marginTop: '10px' }}
						>
							<Collapse.Panel header='QR Code' key='1' showArrow>
								{qrCodeImage === '' ? (
									<Button
										className='credit-accept'
										onClick={handleClickGenerateQrCode}
									>
										สร้าง QR Code เพื่อจ่ายเงิน
									</Button>
								) : (
									<>
										<Box style={{ textAlign: 'center' }}>
											<Image
												src={qrCodeImage}
												className='payment-selected-img'
												onClick={handlePreview}
												alt='qrcode'
											/>
											<Label>
												{`จำนวนเงิน ${convertStrToFormat(
													creditPay.toString(),
													'money_digit'
												)} บาท`}
											</Label>
											<Modal
												visible={modalVisible}
												onCancel={() => setModalVisible(false)}
												onOk={handleSaveImage}
												okText='บันทึก'
												cancelText='ยกเลิก'
											>
												<Image
													alt='qrcode-example'
													style={{ width: '100%' }}
													src={previewImage}
												/>
											</Modal>
										</Box>
										{!typePay && (
											<Button
												className='credit-accept'
												onClick={handleClickGenerateQrCode}
											>
												สร้าง QR Code เพื่อจ่ายเงินใหม่
											</Button>
										)}
									</>
								)}
							</Collapse.Panel>
							<Collapse.Panel header='โอนผ่านธนาคาร' key='2'>
								<Box>
									<Select
										placeholder='เลือกบัญชีธนาคาร'
										options={bankList}
										onChange={(e) => setBank(e)}
										className='choose-bank'
									/>
								</Box>
								<Box>
									<Label className='subject'>แนบสลิปโอนเงิน</Label>
									<UploadFiles onTrigger={handleTriggerSlip} maxCount={1} />
								</Box>
								<Box>
									<Input
										placeholder='หมายเหตุ'
										onChange={(e) => setNote(e.target.value)}
										value={note}
									/>
								</Box>
								<Button
									className='credit-save'
									onClick={() => handleSubmitForm('โอนเงิน')}
								>
									{typePay === 'clear' ? 'ชำระเครดิต' : 'เติมเครดิต'}
								</Button>
							</Collapse.Panel>
						</Collapse>
					</Box>
				</Box>
			</Form>
		</Container>
	)
}

export default Credit
