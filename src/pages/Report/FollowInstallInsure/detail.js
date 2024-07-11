import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Box, Button, Label, Image, Select } from '../../../components'
import { convertStrToFormat } from '../../../helpers'
import { Col, Row, Card } from 'antd'
import { loadingAction } from '../../../actions'
import { IMAGES } from '../../../themes'
import { Tranfer } from './Tranfer'

const gridStyle = {
	width: '25%',
	textAlign: 'center',
}

const FollowInstallDetail = () => {
	const dispatch = useDispatch()
	const installment = useSelector((state) => state.installmentReducer)
	const [dataList, setDataList] = useState([])
	const [dataInstall, setDataInstall] = useState([])
	const [payCondition, setPayCondition] = useState('installTran')
	const [channelPayment, setChannelPayment] = useState(false)

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const {
			status_one,
			status_two,
			status_three,
			status_four,
			status_five,
			status_six,
			status_seven,
			status_eight,
			status_nine,
			status_ten,
			status_eleven,
			status_twelve,
			date_one,
			date_two,
			date_three,
			date_four,
			date_five,
			date_six,
			date_seven,
			date_eight,
			date_nine,
			date_ten,
			date_eleven,
			date_twelve,
			money_one,
			money_two,
			money_three,
			money_four,
			money_five,
			money_six,
			money_seven,
			money_eight,
			money_nine,
			money_ten,
			money_eleven,
			money_twelve,
			bill_credit,
			bill_credit2,
			bill_credit3,
			bill_credit4,
			bill_credit5,
			bill_credit6,
			bill_credit7,
			bill_credit8,
			bill_credit9,
			bill_credit10,
			bill_credit11,
			bill_credit12,
		} = installment
		const data = [
			{
				countNum: 'งวดที่ 1',
				statusInstall: status_one,
				date: date_one,
				money: money_one,
				bill_credit: bill_credit,
			},
			{
				countNum: 'งวดที่ 2',
				statusInstall: status_two,
				date: date_two,
				money: money_two,
				bill_credit: bill_credit2,
			},
			{
				countNum: 'งวดที่ 3',
				statusInstall: status_three,
				date: date_three,
				money: money_three,
				bill_credit: bill_credit3,
			},
			{
				countNum: 'งวดที่ 4',
				statusInstall: status_four,
				date: date_four,
				money: money_four,
				bill_credit: bill_credit4,
			},
			{
				countNum: 'งวดที่ 5',
				statusInstall: status_five,
				date: date_five,
				money: money_five,
				bill_credit: bill_credit5,
			},
			{
				countNum: 'งวดที่ 6',
				statusInstall: status_six,
				date: date_six,
				money: money_six,
				bill_credit: bill_credit6,
			},
			{
				countNum: 'งวดที่ 7',
				statusInstall: status_seven,
				date: date_seven,
				money: money_seven,
				bill_credit: bill_credit7,
			},
			{
				countNum: 'งวดที่ 8',
				statusInstall: status_eight,
				date: date_eight,
				money: money_eight,
				bill_credit: bill_credit8,
			},
			{
				countNum: 'งวดที่ 9',
				statusInstall: status_nine,
				date: date_nine,
				money: money_nine,
				bill_credit: bill_credit9,
			},
			{
				countNum: 'งวดที่ 10',
				statusInstall: status_ten,
				date: date_ten,
				money: money_ten,
				bill_credit: bill_credit10,
			},
			{
				countNum: 'งวดที่ 11',
				statusInstall: status_eleven,
				date: date_eleven,
				money: money_eleven,
				bill_credit: bill_credit11,
			},
			{
				countNum: 'งวดที่ 12',
				statusInstall: status_twelve,
				date: date_twelve,
				money: money_twelve,
				bill_credit: bill_credit12,
			},
		]
		setDataList(installment)
		setDataInstall(data)
		dispatch(loadingAction(false))
	}, [dispatch, installment])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handlePayment = () => {
		switch (payCondition) {
			case 'installTran':
				return tranfer(dataList)
			default:
				break
		}
	}

	const form = [
		{
			section: {
				title: '',
				row: [
					{
						items: [
							{
								label: '',
								classLabel: 'title-preview',
								col: 24,
								box: (
									<Card>
										{dataInstall.map((e, i) => {
											const {
												countNum,
												statusInstall,
												date,
												money,
												bill_credit,
											} = e
											return (
												statusInstall !== 'none' && (
													<Card.Grid
														hoverable={false}
														style={gridStyle}
														key={i}
													>
														<Label>
															<b>{countNum}</b>
														</Label>
														<Box>
															{statusInstall === 'success' ? (
																<Box>
																	<Image
																		src={IMAGES['success.png']}
																		alt='installPay'
																		className='installPay'
																	/>
																	<Label className='status' status='active'>
																		<b>ชำระเงินสำเร็จ</b>
																	</Label>
																</Box>
															) : (
																<Box>
																	<Image
																		src={IMAGES['wait_pay.png']}
																		alt='installPay'
																		className='installPay'
																	/>
																	<Label
																		className='status'
																		status='wait-cancel'
																	>
																		<b>รอการชำระเงิน</b>
																	</Label>
																</Box>
															)}
														</Box>
														<Box>
															<Label>
																ยอดชำระ {convertStrToFormat(money, 'money')}
															</Label>
															<Label>
																วันที่ครบกำหนดชำระ{' '}
																{moment(date).format('DD-MM-YYYY')}
															</Label>
														</Box>
														<Button
															className='select-btn'
															onClick={() => window.open(bill_credit)}
															disabled={!bill_credit}
														>
															ดูสลิป
														</Button>
													</Card.Grid>
												)
											)
										})}
									</Card>
								),
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลการจ่ายเงิน',
				row: [
					{
						items: [
							{
								label: 'เลขรายการ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: dataList.quo_num,
								classLabel: 'title-info-preview',
								col: 8,
							},
							{
								label: 'ชื่อ - นามสกุล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: dataList.name,
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
					{
						items: [
							{
								label: 'เบอร์โทรศัพท์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: dataList.tel,
								classLabel: 'title-info-preview',
								col: 8,
							},
							{
								label: 'เลขทะเบียน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: `${dataList.idcar} ${dataList.carprovince}`,
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
					{
						items: [
							{
								label: 'ราคา พรบ.',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(dataList.pricePrb, 'money_digit'),
								classLabel: 'title-info-preview',
								col: 8,
							},
							{
								label: 'ราคาประกัน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(dataList.priceIns, 'money_digit'),
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
					{
						items: [
							{
								label: 'ส่วนลด',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(dataList.discountIns, 'money_digit'),
								classLabel: 'title-info-preview',
								col: 8,
							},
							{
								label: 'ยอดรวม',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(dataList.net, 'money_digit'),
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
					{
						items: [
							{
								label: 'จำนวนงวด',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: `${dataList.countPay} / ${dataList.numpay}`,
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: '',
				hide: ['cancel', 'success-install'].includes(dataList.status),
				row: [
					{
						items: [
							{
								label: 'เงื่อนไขการชำระ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: '',
								classLabel: 'title-info-preview',
								col: 8,
								box: (
									<Select
										name='payCondition'
										value={payCondition}
										onChange={(v) => {
											setChannelPayment(false)
											setPayCondition(v)
										}}
										options={[
											{
												key: 1,
												value: 'installTran',
												text: 'ผ่อนชำระ (โอนเงิน / Qr-Code)',
											},
											// {
											// 	key: 2,
											// 	value: 'installCredit',
											// 	text: 'ผ่อนชำระ (ตัดบัตรเครดิต)',
											// },
										]}
										style={{ marginRight: '10px', width: '420px' }}
									/>
								),
							},
						],
					},
					{
						items: [
							{
								label: '',
								classLabel: 'title-preview',
								col: 24,
								box: (
									<Box className='accept-group-btn-wrapper'>
										<Button
											className='remove-btn'
											width='200'
											onClick={() => setChannelPayment(true)}
										>
											ชำระเงิน
										</Button>
									</Box>
								),
							},
						],
					},
				],
			},
		},
	]

	return (
		<Box>
			<Box className='form-wrapper'>
				<Label className='title-form'>รายละเอียดค่าผ่อน</Label>
				<Box className='form-body-wrapper'>
					<Box>
						{form.map((e, i) => {
							const { section } = e
							return (
								!section.hide && (
									<Box key={i}>
										<Label className='title-second-form-preview'>
											{section.title}
										</Label>
										{section.row.map((el, il) => {
											return (
												<Row gutter={16} key={il}>
													{el.items.map((el1, il1) => {
														return (
															!el1.hideCol && (
																<Col xs={el1.col} key={il1}>
																	<Label className={el1.classLabel}>
																		{el1.label}
																	</Label>
																	{el1.box}
																</Col>
															)
														)
													})}
												</Row>
											)
										})}
									</Box>
								)
							)
						})}
					</Box>
				</Box>
			</Box>
			<Box>{channelPayment && handlePayment()}</Box>
		</Box>
	)
}
export default FollowInstallDetail

const tranfer = (dataList) => {
	return (
		<Tranfer
			installment={dataList.numpay}
			moneyPay={dataList.moneyPay}
			quoNum={dataList.quo_num}
			countPay={dataList.countPay}
		/>
	)
}
