import React, { useState, useCallback, useEffect } from 'react'
import { Divider, Upload, message, Image, Modal } from 'antd'
import _ from 'lodash'
// import Radio from '../../src/components/Radio'
import { qrController } from '../../apiServices'
import {
	isValidResponse,
	LIST,
	convertStrToFormat,
	getNumQrCode,
} from '../../helpers'
import { io } from 'socket.io-client'
import { BASE_API } from '../../apiServices'
import {
	Box,
	// Button,
	Label,
	Select,
	Span,
	Radio,
} from '../../components'

const { Dragger } = Upload

export const Tranfer = ({
	installment,
	planInstallment,
	data,
	handleClick,
	setStatusPaySucc,
}) => {
	const [transferChanel, setTransferChanel] = useState('QRCode')
	const [bankList, setBankList] = useState([])
	const [bank, setBank] = useState(null)
	const [slipImg, setSlipImg] = useState({})
	const [fieldError, setFieldError] = useState({})
	const [qrCode, setQrCode] = useState({})

	const fetchData = useCallback(async () => {
		const { data_plan } = planInstallment
		const newQuoNum = getNumQrCode({
			quoNum: data.quoNum,
			installment,
			currCount: '01',
		})
		const params = {
			quo_num: newQuoNum,
			amount: data_plan[0]?.first_price,
			exp_day: '7',
			tel: '0101VIF',
		}

		const API = qrController()
		const res = await API.genQr(params)
		if (isValidResponse(res)) {
			console.log(res)
			const { img, text_day } = res.result
			setQrCode({ img, text_day })
		}

		Promise.all([LIST.BANKS()]).then((e) => {
			setBankList(e[0])
		})
	}, [data.quoNum, installment, planInstallment])

	useEffect(() => {
		fetchData()
		const socket = io(BASE_API, {
			transports: ['websocket'],
			query: {
				quo_num: data.quoNum,
			},
		})

		socket.on('ThaiQRnotification', async (e) => {
			const { quo_num: q_back } = e
			if (q_back === data.quoNum) {
				socket.disconnect()
				await setStatusPaySucc(true)
				Modal.success({
					content: 'ชำระเงินสำเร็จ',
					onOk: handleClick.submitToBill,
				})
			}
		})
		return () => {
			socket.disconnect()
		}
	}, [fetchData, data.quoNum, handleClick.submitToBill, setStatusPaySucc])

	const props = {
		name: 'file',
		maxCount: 1,
		onChange(info) {
			const { status } = info.file
			if (status === 'done') {
				setSlipImg(info)
				message.success(`${info.file.name} อัพโหลดไฟล์สำเร็จ`)
			} else if (status === 'removed') {
				setSlipImg({})
			} else if (status === 'error') {
				message.error(`${info.file.name} อัพโหลดไฟล์ไม่สำเร็จ`)
			}
		},
	}

	// const validateFields = () => {
	// 	let errors = {}
	// 	let formIsValid = true
	// 	if (!bank) {
	// 		formIsValid = false
	// 		errors['bank'] = 'กรุณาเลือกธนาคาร'
	// 	}
	// 	if (_.isEmpty(slipImg)) {
	// 		formIsValid = false
	// 		errors['slipImg'] = 'กรุณาแนบสลิปการโอนเงิน'
	// 	}
	// 	setFieldError({ errors })
	// 	return formIsValid
	// }

	// const handleClick = {
	// 	uploadSlip: async () => {
	// 		if (validateFields()) {
	// 			handleClick.saveFinalTask('upload')
	// 		}
	// 	},
	// 	saveTran: async () => {
	// 		handleClick.saveFinalTask('qrcode')
	// 	},
	// }

	return (
		<Box className='form-wrapper'>
			<Box className='form-header-wrapper'>
				<Label className='form-header'>ชำระเงิน (โอนเงิน/QRCode)</Label>
			</Box>
			<Box className='form-body-wrapper'>
				<Box>
					<Box style={{ width: '90%', margin: '0 auto' }}>
						<Box style={{ display: 'flex', justifyContent: 'start' }}>
							<Radio.GroupBtn
								name='transferChanel'
								value={transferChanel}
								lbClassName='input-label'
								className='group-radio'
								options={[
									{ label: 'QRCode', value: 'QRCode' },
									// {
									// 	label: 'โอนผ่านธนาคาร',
									// 	value: 'โอนผ่านธนาคาร',
									// },
								]}
								onChange={(e) => setTransferChanel(e.target.value)}
							/>
						</Box>
						{transferChanel === 'โอนผ่านธนาคาร' ? (
							<Box>
								<Box className='option-payment'>
									<Label>
										เลือกธนาคาร <Span color='red'>*</Span>
									</Label>
									<Select
										name='chanelPayment'
										placeholder='กรุณาเลือกธนาคาร'
										options={bankList}
										onChange={(v) => setBank(v)}
										value={bank}
										error={fieldError.errors?.bank}
									/>
								</Box>
								<Box className='option-payment'>
									<Label>
										สลิปการโอน <Span color='red'>*</Span>
									</Label>
									<Dragger {...props}>
										{!_.isEmpty(slipImg) ? (
											<p className='ant-upload-text'>
												{slipImg?.fileList[0]?.name.length > 20
													? `${slipImg?.fileList[0]?.name.slice(0, 20)}...`
													: slipImg?.fileList[0]?.name}
											</p>
										) : (
											<p className='ant-upload-text'>แนบสลิปการโอนเงิน</p>
										)}
									</Dragger>
									{_.isEmpty(slipImg) && fieldError.errors?.slipImg && (
										<Box>
											<Span color='red'>{fieldError.errors?.slipImg}</Span>
										</Box>
									)}
								</Box>
							</Box>
						) : qrCode.img ? (
							<Box className='image-card-wrapper'>
								<Box className='image-qrcode'>
									<Image
										src={qrCode.img}
										alt='img-qrcode'
										width={250}
										preview
									/>
								</Box>
								<Label>{qrCode.text_day}</Label>
							</Box>
						) : (
							'กำลังโหลด QRCode ...'
						)}
						<Divider />
					</Box>
					<Box className='bill-price-detail'>
						<Label className='bill-price-description'>แผนการผ่อน</Label>
						<Label className='bill-price'>
							{planInstallment?.data_plan[0]?.label}
						</Label>
					</Box>
					<Box className='bill-price-detail'>
						<Label className='bill-price-description'>
							ยอดที่ต้องจ่าย งวดชำระ 1/{installment}
						</Label>
						<Label className='bill-price'>
							{convertStrToFormat(
								planInstallment?.data_plan[0]?.first_price,
								'money_digit'
							)}{' '}
							บาท
						</Label>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
