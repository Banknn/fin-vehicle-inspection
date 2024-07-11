import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse, Modal, Progress, Form } from 'antd'
import { saveAs } from 'file-saver'
import _ from 'lodash'
import { io } from 'socket.io-client'
import {
	Box,
	Button,
	Container,
	Image,
	InputNumber,
	Select,
	Label,
	Table,
	UploadFiles,
} from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	LIST,
	redirect,
	removeStoreCreditPay,
	ROUTE_PATH,
} from '../../helpers'
import {
	BASE_API,
	qrController,
	systemController,
	reportController,
} from '../../apiServices'
import { loadingAction } from '../../actions'
import moment from 'moment'
import { TableComponent } from '../../components/Table/styled'

const Debit = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.profileReducer)
	const { creditBalance, creditTotal } = useSelector(
		(state) => state.creditReducer
	)
	const [creditPercent, setCreditPercent] = useState(0)
	const [data, setData] = useState({})
	const [dataTable, setDataTable] = useState([])
	const [credit, setCredit] = useState(0)
	const [creditOld, setCreditOld] = useState(0)
	const [commission, setCommisstion] = useState(0)
	const [balance, setBalance] = useState(0)
	const [creditPay, setCreditPay] = useState(0)
	const [qrCodeImage, setQrCodeImage] = useState('')
	const [previewImage, setPreviewImage] = useState('')
	const [modalVisible, setModalVisible] = useState(false)
	const [slipImage, setSlipImage] = useState({})
	const [bank, setBank] = useState('')
	const [bankList, setBankList] = useState([])

	const generateQr = useCallback(
		async (credit) => {
			if (typeof credit === 'number') {
				dispatch(loadingAction(true))
				const params = {
					quo_num: user.cuscode,
					amount: credit,
					tel: '0101VIF',
					exp_day: '10',
				}

				const API = qrController()
				const res = await API.genCreditTopUp(params)
				if (isValidResponse(res)) {
					const qrCode = res.result.img
					setQrCodeImage(qrCode)
					setCreditPay(credit)
					setCreditOld(credit)
					dispatch(loadingAction(false))
				}
			}
		},
		[user, dispatch]
	)

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const percent = (+creditBalance / +creditTotal) * 100
		setCreditPercent(percent)
		setData({ creditBalance, creditTotal })

		const API = reportController()
		const res = await API.getReportDebit()
		if (isValidResponse(res)) {
			const { result } = res
			const data = result.map((e, i) => {
				return {
					key: i,
					...e,
				}
			})
			setDataTable(data)
		}

		dispatch(loadingAction(false))
		Promise.all([LIST.BANKS()]).then((e) => {
			setBankList(e[0])
		})
	}, [creditBalance, creditTotal, dispatch])

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
				title: 'เติมเงินสำเร็จ',
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
	}, [fetchData, user, commission, balance])

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
		[credit, slipImage, bank, user, balance, commission, dispatch]
	)

	const columns = [
		{
			title: 'วันที่เติมเงิน',
			dataIndex: 'date_add',
			key: 'date_add',
			width: 200,
			render: (value) => {
				return <Label>{moment(value).format('DD-MM-YYYY HH:mm:ss')}</Label>
			},
		},
		{
			title: 'จำนวน',
			dataIndex: 'credit',
			key: 'credit',
			width: 100,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
	]

	const summaryRow = () => {
		const creditTotal = dataTable.reduce((acc, curr) => acc + +curr.credit, 0)
		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row>
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(creditTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<Container className='container'>
			<Form>
				<Box className='credit-show-wrapper'>
					<Label className='title-form'>ระบบเติมเงิน</Label>
					<Box className='credit-balance'>
						<Progress type='circle' percent={creditPercent} format={() => ``} />
						<Box className='credit-balance-wrapper'>
							<Label className='balance-text'>ยอดวงเงินของคุณ</Label>
							<Label className='balance-credit'>
								{convertStrToFormat(data.creditBalance, 'money_digit')}
							</Label>
						</Box>
					</Box>
					<Box className='credit-addition'>
						<Label>ระบุจำนวนเงิน</Label>
						<InputNumber
							name='credit'
							placeholder='จำนวนเงิน'
							value={credit}
							onChange={(value) => setCredit(value)}
							formatter={(value) => convertStrToFormat(value, 'number_Int')}
							min={0}
							style={{ marginBottom: '0' }}
							isNotForm
						/>
						{qrCodeImage === '' ? (
							<Button
								className='credit-accept'
								onClick={handleClickGenerateQrCode}
							>
								ยืนยันการเติมเงิน
							</Button>
						) : (
							<Collapse defaultActiveKey={['1']} style={{ marginTop: '10px' }}>
								<Collapse.Panel header='QR Code' key='1' showArrow>
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
										{credit !== creditOld && (
											<Button
												className='credit-accept'
												onClick={handleClickGenerateQrCode}
											>
												สร้าง QR Code เพื่อจ่ายเงินใหม่
											</Button>
										)}
									</>
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
									<Button
										className='credit-save'
										onClick={() => handleSubmitForm('โอนเงิน')}
									>
										ยืนยันการโอนผ่านธนาคาร
									</Button>
								</Collapse.Panel>
							</Collapse>
						)}
					</Box>
				</Box>
			</Form>
			<Box className='report-table-debit'>
				<Table
					columns={columns}
					dataSource={dataTable}
					summary={summaryRow}
					className='report-data-table'
					size='middle'
				/>
			</Box>
		</Container>
	)
}

export default Debit
