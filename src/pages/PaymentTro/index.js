import React, { useState, useEffect, useCallback } from 'react'
import { Box, Label } from '../../components'
import { DetailLayoutPayment } from '../Layout'
import {
	redirect,
	ROUTE_PATH,
	convertStrToFormat,
	isValidResponse,
} from '../../helpers'
import { Row, Col, Divider, Image, Modal } from 'antd'
import { THEME, IMAGES } from '../../themes'
import { useSelector } from 'react-redux'
import { BASE_API, qrController } from '../../apiServices'
import { io } from 'socket.io-client'

const PaymentTro = () => {
	const customer = useSelector((state) => state.customerReducer)
	const [summary, setSummary] = useState(0)
	const [qrCodeImage, setQrCodeImage] = useState(null)

	const generateQr = useCallback(async () => {
		const { price } = customer
		const priceTotal =
			+customer?.price_insure +
			+customer?.price_compul +
			+price.taxPrice +
			+price.finePrice +
			+price.sevicePrice +
			+price.transCar +
			+price.checkPrice -
			+price.discount
		setSummary(priceTotal)
		if (typeof priceTotal === 'number') {
			const params = {
				quo_num: customer.bill_num,
				amount: priceTotal,
				tel: '0101VIF',
				exp_day: '10',
			}

			const API = qrController()
			const res = await API.genCreditTopUp(params)
			if (isValidResponse(res)) {
				const qrCode = res.result.img
				setQrCodeImage(qrCode)
			}
		}
	}, [customer])

	useEffect(() => {
		generateQr()
		const socket = io(BASE_API, {
			transports: ['websocket'],
			query: {
				quo_num: customer.bill_num,
			},
		})
		socket.on('ThaiQRnotification', async (e) => {
			Modal.success({
				title: 'ชำระเงินสำเร็จ',
			})
		})
		return () => {
			socket.disconnect()
		}
	}, [generateQr, customer])

	const formLeft = [
		{
			section: 'ข้อมูลส่วนบุคคล',
			items: [
				{
					item: (
						<Label>
							ชื่อ: {customer.select?.title} {customer.input.name}{' '}
							{customer.input.lastname}
						</Label>
					),
					span: 12,
				},
				{
					item: `เพศ: ${customer.select.gender === 'M' ? 'ชาย' : 'หญิง'}`,
					span: 12,
				},
				{ item: `เลขบัตรประชาชน: ${customer.input.idCard}`, span: 12 },
				{
					item: `เบอร์: ${convertStrToFormat(
						customer.input.tel,
						'phone_number'
					)}`,
					span: 12,
				},
			],
		},
		{
			section: 'ข้อมูลประกันภัย',
			items: [
				{ item: 'บริษัทประกัน คุ้มภัยโตเกียวมารีนประกันภัย', span: 14 },
				{ item: 'ประเภท ชั้น 2+ ซ่อมอู่', span: 10 },
				{ item: 'บริษัทพ.ร.บ. คุ้มภัยโตเกียวมารีนประกันภัย', span: 14 },
				{ item: 'ประเภท พ.ร.บ. 1.10', span: 10 },
			],
		},
		{
			section: 'ข้อมูลรถยนต์',
			hide: !customer.brand,
			items: [
				{ item: 'ยี่ห้อรถ: Toyota', span: 12 },
				{ item: 'รุ่นรถ: SOLUNA', span: 12 },
				{ item: 'รุ่นย่อยรถ: ', span: 12 },
				{ item: 'ปีรถ: 2018', span: 12 },
				{ item: 'เลขทะเบียน: 1กก-1521', span: 24 },
				{ item: 'จังหวัดป้ายทะเบียน: กรุงเทพมหานคร', span: 24 },
			],
		},
		{
			section: 'ข้อมูลตรวจสถาพรถ',
			items: [
				{
					item: `ประเภทตรวจสภาพรถ: ${
						customer.select.vehicleType === 'carThan2000'
							? 'รถยนต์ที่มีน้ำหนักไม่เกิน 2,000 กิโลกรัม'
							: customer.select.vehicleType === 'carOver2000'
							? 'รถยนต์ที่มีน้ำหนักเกิน 2,000 กิโลกรัม'
							: customer.select.vehicleType === 'motorcycle' && 'รถจักรยานยนต์'
					}`,
				},
			],
		},
	]
	const formRight = [
		{
			section: 'รายการชำระ',
			bgSection: true,
			items: [
				{
					hide: !customer.price_compul,
					item: (
						<Box className='detail-payment-tro'>
							<Label>พรบ</Label>
							<Label>{customer.price_compul}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price_insure,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ประกันรถ</Label>
							<Label>{customer.price_insure}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price?.taxPrice,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ภาษีรถ</Label>
							<Label>{customer.price?.taxPrice}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price?.checkPrice,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ค่าตรวจสภาพ</Label>
							<Label>{customer.price?.checkPrice}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price?.finePrice,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ค่าปรับ</Label>
							<Label>{customer.price?.finePrice}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price?.sevicePrice,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ค่าบริการ</Label>
							<Label>{customer.price?.sevicePrice}</Label>
						</Box>
					),
				},
				{
					hide: !customer.price?.transCar,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ค่าโอนรถ</Label>
							<Label>{customer.price?.transCar}</Label>
						</Box>
					),
				},
				{
					item: <Box className='line-payment-tro' />,
				},
				{
					hide: !customer.price?.discount,
					item: (
						<Box className='detail-payment-tro'>
							<Label>ส่วนลด</Label>
							<Label>{customer.price?.discount}</Label>
						</Box>
					),
				},
				{
					item: (
						<Box className='detail-payment-tro'>
							<Label>ยอดรวม</Label>
							<Label>{summary}</Label>
						</Box>
					),
				},
			],
		},
		{
			items: [
				{
					item: qrCodeImage ? (
						<Box className='d-flex' style={{ justifyContent: 'center' }}>
							<Image src={qrCodeImage} alt='qr-code' width={170} />
						</Box>
					) : (
						<Box className='d-flex' style={{ justifyContent: 'center' }}>
							<Box className='d-flex' style={bgThaiQr}>
								<Image
									src='https://i.ibb.co/7rZn8JP/qr-code.gif'
									alt='qr-code'
									width={170}
									style={{ marginTop: '40px' }}
									preview={false}
								/>
							</Box>
						</Box>
					),
				},
			],
		},
	]

	return (
		<DetailLayoutPayment
			isPreve={true}
			onClickPrevious={() => redirect(ROUTE_PATH.BILL.LINK)}
		>
			<Box style={boxCenter}>
				<Row>
					<Col style={styleBoxLeft} span={14}>
						<Label className='title-form'>ชำระเงิน</Label>
						{formLeft.map((e, i) => {
							const { section, items } = e
							return (
								!e.hide && (
									<Box key={i}>
										<Divider
											orientation='left'
											style={{ border: `1px ${THEME.COLORS.RED}` }}
										>
											<Label className='title-payment-tro'>{section}</Label>
										</Divider>
										<Box style={{ marginLeft: '20px' }}>
											<Row gutter={[8, 8]}>
												{items.map((el, li) => {
													return (
														<Col key={li} span={el.span}>
															{el.item}
														</Col>
													)
												})}
											</Row>
										</Box>
									</Box>
								)
							)
						})}
					</Col>
					<Col style={styleBoxRight} span={9}>
						{formRight.map((e, i) => {
							const { section, items, bgSection } = e
							return (
								!e.hide && (
									<Box key={i} className='bg-white-payment'>
										{section && (
											<Divider
												orientation='left'
												style={{
													border: `1px ${THEME.COLORS.RED}`,
													margin: '0',
													padding: '10px',
												}}
											>
												<Label className='title-payment-tro'>{section}</Label>
											</Divider>
										)}
										<Box
											style={{
												padding: '0 10px 10px 10px',
												backgroundImage:
													bgSection && `url(${IMAGES['bg-payment.png']})`,
												backgroundSize: 'cover',
											}}
										>
											{items.map((el, li) => {
												return !el.hide && <Box key={li}>{el.item}</Box>
											})}
										</Box>
									</Box>
								)
							)
						})}
					</Col>
				</Row>
			</Box>
		</DetailLayoutPayment>
	)
}
export default PaymentTro

// style
const boxCenter = {
	marginLeft: 'auto',
	marginRight: 'auto',
}
const styleBoxLeft = {
	boxShadow:
		'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
	padding: '10px',
	marginRight: '10px',
}
const styleBoxRight = {
	boxShadow:
		'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
	padding: '50px 20px 10px 20px',
	background: '#FAD7D8',
}
const bgThaiQr = {
	background: `url(${IMAGES['bg-thaiqr.png']})`,
	backgroundSize: 'cover',
	width: '180px',
	height: '230px',
	position: 'relative',
	justifyContent: 'center',
	boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
}
