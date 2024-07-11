import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Collapse, Modal, Form } from 'antd'
import { saveAs } from 'file-saver'
import {
	Box,
	Button,
	Container,
	Image,
	InputNumber,
	Input,
	Label,
	Table,
} from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { qrController, systemController } from '../../apiServices'
import { loadingAction } from '../../actions'

const GenQrcodeByAdmin = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [fieldError, setFieldError] = useState({})
	const [credit, setCredit] = useState(2000)
	const [creditOld, setCreditOld] = useState(2000)
	const [creditPay, setCreditPay] = useState(2000)
	const [cuscode, setCuscode] = useState('')
	const [qrCodeImage, setQrCodeImage] = useState('')
	const [previewImage, setPreviewImage] = useState('')
	const [modalVisible, setModalVisible] = useState(false)

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))

		const API = systemController()
		const res = await API.getWaitPremissionVif()
		if (isValidResponse(res)) {
			dispatch(loadingAction(false))
			let { result } = res

      result = result.map((e, i) => {
        return {
          ...e,
          status: 'รอเปิดสิทธิ์ ตรอ.'
        }
      })
      setDataList(result)
		}

		dispatch(loadingAction(false))
	}, [dispatch])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!cuscode) {
			formIsValid = false
			errors['cuscode'] = 'กรุณากรอก cuscode'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const generateQr = useCallback(
		async (credit) => {
			if (typeof credit === 'number') {
				dispatch(loadingAction(true))
				const params = {
					amount: credit,
					tel: '0101VIF',
					exp_day: '10',
					cuscode: cuscode,
				}

				const API = qrController()
				const res = await API.genCreditTopUpByAdmin(params)
				if (isValidResponse(res)) {
					console.log(res)
					const { result, message } = res
					if (message === 'ไม่พบผู้ใช้งาน') {
						Modal.success({
							title: message,
						})
					} else {
						const qrCode = result.img
						setQrCodeImage(qrCode)
						fetchData()
					}
					setCreditPay(credit)
					setCreditOld(credit)
					dispatch(loadingAction(false))
				}
			}
		},
		[dispatch, fetchData, cuscode]
	)

	const handleClickGenerateQrCode = async () => {
		if (validateFields()) {
			await generateQr(credit)
		}
	}

	const handlePreview = (e) => {
		const { src } = e.target
		setModalVisible(true)
		setPreviewImage(src)
	}

	const handleSaveImage = () => {
		saveAs(previewImage, 'fin-qrcode')
	}

	const columns = [
		{
			title: 'รหัสผู้ใช้งาน',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 100,
		},
		{
			title: 'ชื่อ ตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'วงเงิน',
			dataIndex: 'credit_vif',
			key: 'credit_vif',
			width: 100,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 200,
		},
	]

	return (
		<Container className='container'>
			<Form>
				<Box className='credit-show-wrapper'>
					<Label className='title-form'>Generate QrCode</Label>
					<Box className='credit-addition'>
						<Box>
							<Label>รหัสตัวแทน</Label>
							<Input
								name='cuscode'
								placeholder='รหัสตัวแทน'
								value={cuscode}
								onChange={(e) => {
									const { value } = e.currentTarget
									setCuscode(value)
								}}
								notvalue
								error={fieldError.errors?.cuscode}
							/>
						</Box>
						<Box>
							<Label>ระบุจำนวนเงิน</Label>
							<InputNumber
								name='credit'
								placeholder='จำนวนเงิน'
								value={credit}
								onChange={(value) => setCredit(value)}
								formatter={(value) => convertStrToFormat(value, 'number_Int')}
								min={2000}
								style={{ marginBottom: '0' }}
							/>
						</Box>
						{qrCodeImage === '' ? (
							<Button
								className='credit-accept'
								onClick={handleClickGenerateQrCode}
							>
								สร้าง QrCode
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
											{cuscode && <Label>รหัสตัวแทน {cuscode}</Label>}
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
							</Collapse>
						)}
					</Box>
				</Box>
			</Form>
			<Box className='report-table'>
				<Table
					columns={columns}
					dataSource={dataList}
					className='report-data-table'
					size='middle'
				/>
			</Box>
		</Container>
	)
}

export default GenQrcodeByAdmin
