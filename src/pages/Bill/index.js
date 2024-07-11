import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Radio, TimePicker, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { customerAction, loadingAction } from '../../actions'
import {
	Box,
	Button,
	Input,
	Label,
	Modal,
	Select,
	InputNumber,
	DatePickerWithLabel,
	Icons,
	Span,
	Table,
} from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	numberWithCommas,
	// carTaxCalate,
	convertCC,
	vehicleInspectionCal,
	checkCustomer,
	calInstallmentSpecial,
	removeChar,
} from '../../helpers'
import { DetailLayout } from '../Layout'
import {
	paymentController,
	receiptController,
	systemController,
} from '../../apiServices'
import _ from 'lodash'
import { THEME } from '../../themes'
import { Tranfer } from './Tranfer'

const Bill = () => {
	const dispatch = useDispatch()
	const customer = useSelector((state) => state.customerReducer)
	const user = useSelector((state) => state.profileReducer)
	const premistions = useSelector((state) => state.premissionsReducer)
	const [data, setData] = useState({})
	const [detailQuonum, setDetailQuonum] = useState({})
	const modal = useRef(null)
	const modalSelect = useRef(null)
	const [compulsoryPrice, setCompulsoryPrice] = useState({
		netPrice: 0,
		dutyPrice: 0,
		sum: 0,
	})
	const [insurePrice, setInsurePrice] = useState(0)
	const [channelPayment, setChannelPayment] = useState(false)
	const [taxPrice, setTaxPrice] = useState(null)
	const [finePrice, setFinePrice] = useState(null)
	const [checkPrice, setCheckPrice] = useState(null)
	const [sevicePrice, setSevicePrice] = useState(null)
	const [discount, setDiscount] = useState(null)
	const [discountPrb, setDiscountPrb] = useState(null)
	const [discountService, setDiscountService] = useState(null)
	const [discountOther, setDiscountOther] = useState(null)
	const [transCar, setTransCar] = useState(null)
	const [payment, setPayment] = useState(null)
	const [cancelPrb, setCancelPrb] = useState(null)
	const [cancelIns, setCancelIns] = useState(null)
	const [statusPaySucc, setStatusPaySucc] = useState(false)
	const [conditionInstall, setConditionInstall] = useState(null)
	const [payCondition, setPayCondition] = useState('full')
	const [installment, setInstallment] = useState('3')
	const [payPrbCondition, setPayPrbCondition] = useState('full')
	const [payMethod, setPayMethod] = useState('cash')
	const [addressBill, setAddressBill] = useState('vif')
	const [insurePrint, setInsurePrint] = useState('vif')
	const [dateAppointment, setDateAppointment] = useState(undefined)
	const [timeAppointment, setTimeAppointment] = useState(undefined)
	const [fetchDataFirst, setFetchDataFirst] = useState(false)
	const [selectedRow, setSelectedRow] = useState([])
	const [sListSelect, setSListSelect] = useState([])
	const [serviceList, setServiceList] = useState([])
	const [costList, setCostList] = useState([{ name: '', price: '' }])
	const condiInstallOption = [
		{ text: 'งวดแรก 20% (จ่ายคอมงวด 2)', value: '208002' },
		{ text: 'งวดแรก 25% (จ่ายคอมงวด 2)', value: '257502' },
		{ text: 'หารเท่าทุกงวด (จ่ายคอมงวด 2)', value: '000002' },
		{ text: 'หารเท่าทุกงวด (จ่ายคอมงวด 3)', value: '000003' },
	]

	const fetchData = useCallback(async () => {
		if (!_.isEmpty(customer) && !fetchDataFirst) {
			const {
				input,
				select,
				finePrice,
				discounts,
				discount,
				priceTax,
				inspectionFee,
				sevice,
				taxPrice,
				checkPrice,
			} = customer
			const carTax = ''
			// const carTax = await carTaxCalate({
			// 	ccCar: convertCC(input?.engineCC || '0'),
			// 	carWeight: input?.carWeight,
			// 	carType: select?.carType,
			// 	registerYear: select?.registerYear,
			// })
			if (input.compulsoryPrice) {
				setCompulsoryPrice(input.compulsoryPrice)
			}
			checkCustomer(user.cuscode) &&
				setTaxPrice(carTax || priceTax || taxPrice || null)
			checkCustomer(user.cuscode) &&
				setCheckPrice(
					inspectionFee ||
						checkPrice ||
						vehicleInspectionCal({
							vehicleType: select?.vehicleType,
							ccCar: convertCC(input?.engineCC || '0'),
							carType: select?.carType,
						}) ||
						null
				)
			setInsurePrice(+input.insurePrice || null)
			setSevicePrice(sevice || null)
			setData({
				...customer,
			})
			checkCustomer(user.cuscode) && setFinePrice(finePrice || null)
			setDiscount(discounts || discount || null)
			dispatch(loadingAction(false))
			setFetchDataFirst(true)
		}
	}, [dispatch, customer, user.cuscode, fetchDataFirst])

	const fetchProduct = useCallback(async () => {
		if (!fetchDataFirst) {
			const service = await LIST.SERVICE_LIST()
			let sListSelectOld = []

			if (customer.productList) {
				sListSelectOld = service.filter((e) =>
					customer.productList.some((el) => el.code === e.value)
				)
			}

			setServiceList(service)
			setSListSelect(sListSelectOld)
			setSelectedRow(sListSelectOld.map((e) => e.key))
		}
	}, [customer, fetchDataFirst])

	const fetchDetailQuo = useCallback(async () => {
		if (!fetchDataFirst) {
			const commission = {
				quo_num: customer.quoNum,
				sendapi: user?.type_work
					? user?.type_work
					: user.user_adviser === 'FNG22-055001' ||
					  user.user_adviser === 'FNG23-083733'
					? 'quick'
					: insurePrint,
				show_discount_ins: 0,
				chanel: 'เข้าฟิน',
				chanel_main:
					payMethod === 'cash'
						? 'เงินสด'
						: payMethod === 'tranferVif'
						? 'โอนเข้า ตรอ.'
						: '',
				type_pay: ['full', 'fullTran'].includes(payCondition)
					? '0'
					: payCondition,
				status: 'wait',
			}
			const API = systemController()
			const res = await API.getDetailPlanByQuoVif(commission)
			if (isValidResponse(res)) {
				const {
					status,
					condition_install,
					numpay,
					chanel_main,
					show_discount_ins,
				} = res.result

				if (chanel_main === 'ผ่อนโอน') {
					setPayCondition('installTran')
					setConditionInstall(condition_install)
					setInstallment(numpay)
					setDiscount(show_discount_ins)
				}
				if (['tran-succ', 'active'].includes(status)) setStatusPaySucc(true)
				setDetailQuonum(res.result)
			}
		}
	}, [
		fetchDataFirst,
		customer.quoNum,
		insurePrint,
		payCondition,
		payMethod,
		user.user_adviser,
	])

	useEffect(() => {
		fetchDetailQuo()
		fetchProduct()
		fetchData()
	}, [fetchData, fetchProduct, fetchDetailQuo])

	const funcConditionOption = () => {
		if (['6', '7', '8', '10'].includes(installment)) {
			return condiInstallOption.filter(
				(e) => !['208002', '000002'].includes(e.value)
			)
		} else {
			return condiInstallOption.filter((e) => e.value === '000002')
		}
	}

	const disibleSlip = () => {
		let sumaryPrice = 0

		if (payCondition === 'full') {
			sumaryPrice =
				(!cancelIns && insurePrice) +
				(!cancelPrb && (+data?.prbPrice || 0)) +
				+taxPrice +
				+finePrice +
				+sevicePrice +
				+transCar +
				+funcCulPayment('priceCost') +
				+checkPrice -
				+discount -
				+discountPrb -
				+discountOther -
				+discountService
			return payment < +sumaryPrice.toFixed(2) || sumaryPrice === 0
		} else if (payCondition !== 'full' && conditionInstall) {
			sumaryPrice =
				funcCulPayment('planInstallment')?.data_plan[0]?.first_price +
				+taxPrice +
				+finePrice +
				+sevicePrice +
				+checkPrice +
				+transCar +
				+funcCulPayment('priceCost')
			return payment < sumaryPrice || sumaryPrice === 0
		}
	}

	const onSelectChange = (newSelectedRow, result) => {
		const sumSList = result.reduce((acc, curr) => acc + +curr.price, 0)
		setSelectedRow(newSelectedRow)
		setSListSelect(result)
		setSevicePrice(sumSList)
	}

	const rowSelection = {
		selectedRowKeys: selectedRow,
		onChange: onSelectChange,
	}

	const handlePayment = () => {
		switch (payCondition) {
			case 'installTran':
				return tranfer(
					installment,
					funcCulPayment('planInstallment'),
					data,
					handleClick,
					setStatusPaySucc
				)
			default:
				break
		}
	}

	const funcCulPayment = (inputCase) => {
		switch (inputCase) {
			case 'comIns':
				return detailQuonum?.show_com_ins
			case 'comPrb':
				return detailQuonum?.show_com_prb
			case 'installPrecent':
				const installPrecent =
					detailQuonum?.show_com_ins *
					(detailQuonum?.per_install
						? detailQuonum?.per_install[installment] / 100
						: 1)
				return !conditionInstall ? 0 : +installPrecent.toFixed(2)
			case 'calVat':
				return !conditionInstall
					? 0
					: (funcCulPayment('comIns') - funcCulPayment('installPrecent')) * 0.03
			case 'calComTotal':
				return (
					funcCulPayment('comIns') -
					funcCulPayment('installPrecent') -
					funcCulPayment('calVat')
				)
			case 'calTotalDiffDiscount':
				return funcCulPayment('calComTotal') - discount - discountPrb
			case 'calInsPrb':
				let price = 0
				if (conditionInstall) {
					price = funcCulPayment('planInstallment')?.data_plan[0]?.first_price
				} else {
					price =
						Number(!cancelPrb ? data.prbPrice : 0) +
						Number(!cancelPrb ? insurePrice : 0) -
						discount -
						discountPrb
				}
				return price
			case 'planInstallment':
				const planInstall = calInstallmentSpecial({
					amount: insurePrice,
					count_installment: installment,
					condition_install: conditionInstall,
					prb: data.prbPrice > 0 ? 'yes' : 'no',
					priceprb: +data.prbPrice,
					discount: +discount + +discountPrb,
				})
				return planInstall
			case 'priceCost':
				const priceCost = costList.reduce((acc, curr) => acc + +curr.price, 0)
				return priceCost
			default:
				break
		}
	}

	const handleClick = {
		generateSlip: async (type, addressBill) => {
			const {
				quoNum,
				input,
				select,
				legal,
				brand,
				series,
				subSeries,
				year,
				brandTitle,
				seriesTitle,
				insureType,
			} = data
			const params = {
				quo_num: quoNum,
				bill_num: customer?.bill_num,
				receipt_num: customer?.receipt_num,
				tax_bill_num: customer?.tax_bill_num,
				numberQr: customer?.numberQr,
				insuredType: legal === 'บุคคลทั่วไป' ? '1' : '2',
				title: select?.title,
				name: input?.name,
				lastname: input?.lastname,
				gender: select?.gender,
				idCard: input?.idCard,
				brandplan: brand === 'none' ? brand : brandTitle?.text,
				seriesplan: series === 'none' ? series : seriesTitle?.text,
				sub_seriesplan: subSeries === 'none' ? subSeries : subSeries,
				yearplan: year,
				registerDay: select?.registerDay,
				registerMonth: select?.registerMonth,
				registerYear: select?.registerYear,
				number_car: input?.vehicleRegistrationNumber,
				carprovince: select?.vehicleRegistrationArea,
				car_type: select?.carType,
				vehicleType: select?.vehicleType,
				cc_car: input?.engineCC,
				weight_car: input?.carWeight,
				employee: `${select?.title} ${input?.name} ${input?.lastname}`,
				price_inspec: Number(checkPrice || 0),
				price_insure: !cancelIns ? Number(insurePrice || 0) : null,
				price_compul: !cancelPrb ? Number(data.prbPrice || 0) : null,
				price_tax: taxPrice || 0,
				price_fine: finePrice || 0,
				price_service: sevicePrice || 0,
				trans_car: transCar || 0,
				discount:
					+discount + +discountPrb + +discountOther + +discountService || 0,
				payment,
				method: payMethod,
				tel: input?.tel || '-',
				address: input?.addressInsurance
					? `${input?.addressInsurance} ${select?.amphoeInsurance} ${select?.districtInsurance} ${select?.provinceInsurance} ${select?.zipcodeInsurance}`
					: '-',
				addressInsurance: input?.addressInsurance,
				amphoeInsurance: select?.amphoeInsurance,
				districtInsurance: select?.districtInsurance,
				provinceInsurance: select?.provinceInsurance,
				zipcodeInsurance: select?.zipcodeInsurance,
				type,
				addressBill,
				appointment: {
					date: dateAppointment
						? moment(dateAppointment).format('DD/MM/YYYY')
						: null,
					time: timeAppointment
						? moment(timeAppointment).format('HH.mm')
						: null,
				},
				id_key: premistions.cuscode,
				cancelPrb,
				cancelIns,
				productList:
					sListSelect.length > 0 ? JSON.stringify(sListSelect) : null,
				typeIns: insureType,
				payCondition,
				planInstallment: funcCulPayment('planInstallment'),
				companyCompulsory: select?.companyCompulsory,
				discount_prb: discountPrb || 0,
				discount_inspection_fee: discountOther || 0,
				discount_sevice: discountService || 0,
				costList:
					+funcCulPayment('priceCost') > 0 ? JSON.stringify(costList) : null,
				cost: +funcCulPayment('priceCost') || 0,
			}

			if (costList.length > 1 || costList[0].name || costList[0].price) {
				const dataError = costList.filter((e) => !e.name || !e.price)
				if (dataError.length > 0) {
					message.error('กรุณากรอกข้อมูลให้ครบถ้วน')
					return
				}
			}

			const API = receiptController()
			dispatch(loadingAction(true))
			const res = checkCustomer(user.cuscode)
				? await API.generateSlipShopVif(params)
				: await API.generateSlip(params)
			if (isValidResponse(res)) {
				const {
					url: slipUrl,
					bill_num,
					receipt_num,
					tax_bill_num,
					numberQr,
				} = res.result
				const customers = {
					...data,
					bill_num,
					receipt_num,
					tax_bill_num,
					numberQr,
				}
				dispatch(customerAction(customers))
				window.open(slipUrl, '_blank')
				dispatch(loadingAction(false))
			}
		},
		submitToBill: async () => {
			dispatch(loadingAction(true))
			const price = {
				compulsoryPrice,
				insurePrice: Number(insurePrice).toFixed(2),
				taxPrice,
				finePrice,
				sevicePrice,
				checkPrice,
				transCar,
				discount,
				payCondition,
				payMethod,
			}
			const commission = {
				quo_num: data.quoNum,
				sendapi: user?.type_work
					? user?.type_work
					: user.user_adviser === 'FNG22-055001' ||
					  user.user_adviser === 'FNG23-083733'
					? 'quick'
					: insurePrint,
				show_discount_ins:
					(user?.status_permissions === 'saleFin' || payCondition === 'full') &&
					data.select?.companyInsurance
						? +discount
						: null,
				chanel: 'เข้าฟิน',
				chanel_main:
					payMethod === 'cash'
						? 'เงินสด'
						: payMethod === 'tranferVif'
						? 'โอนเข้า ตรอ.'
						: '',
				type_pay: payCondition === 'full' ? '0' : payCondition,
				status: 'wait',
				payCondition,
			}
			console.log(commission)
			const params = {
				quo_num: data.quoNum,
				show_price_ins: insurePrice || 0,
				installment: payCondition,
				show_price_check: checkPrice,
				show_price_service: sevicePrice,
				show_price_taxcar: taxPrice,
				show_price_fine: finePrice,
			}

			const API = paymentController()
			const savePayRes = await API.savePay(params)
			if (isValidResponse(savePayRes)) {
				let customers = {
					price,
					...data,
					insurePrice: Number(insurePrice).toFixed(2),
					taxPrice,
					finePrice,
					sevicePrice,
					checkPrice,
					transCar,
					discount,
					discountPrb,
					discountOther,
					discountService,
					payCondition,
					payMethod,
					payPrbCondition,
					insurePrint,
					statusPaySucc,
				}

				const upsertPayRes = await API.upsertPaymentVif(commission)
				if (payCondition !== 'full') {
					const paramsTran = {
						quo_num: data.quoNum,
						clickbank: 'qrcode',
						numpay: installment,
						discom: +funcCulPayment('installPrecent').toFixed(2),
						distax: +funcCulPayment('calVat').toFixed(2),
						condition_install: conditionInstall,
						installment: installment,
						amount_pay: insurePrice - discount - discountPrb,
						arr_price: JSON.stringify(
							removeChar(funcCulPayment('planInstallment').data_plan[0].label)
						),
					}
					customers.install = paramsTran
					await API.upsertFinalTranVif(paramsTran)
				}

				if (isValidResponse(upsertPayRes)) {
					const com = upsertPayRes.result
					customers.com = com
					dispatch(customerAction(customers))
					redirect(ROUTE_PATH.PREVIEW.LINK)
				}
			}
		},
		submitToPaymentTro: async () => {
			dispatch(loadingAction(true))
			const price = {
				compulsoryPrice,
				insurePrice: Number(insurePrice).toFixed(2),
				taxPrice,
				finePrice,
				sevicePrice,
				checkPrice,
				transCar,
				discount: +discount + +discountPrb + +discountOther + +discountService,
				payCondition,
				payMethod,
			}
			const customers = {
				price,
				...customer,
				price_insure: !cancelIns ? Number(insurePrice || 0) : null,
				price_compul: !cancelPrb ? Number(data.prbPrice || 0) : null,
				payPrbCondition,
				insurePrint,
			}
			dispatch(customerAction(customers))
			redirect(ROUTE_PATH.PAYMENTTRO.LINK)
		},
		slip: async (type, addressBill) => {
			await handleClick.generateSlip(type, addressBill)
		},
	}

	const form = [
		{
			section: {
				title: 'รายการ',
				items: [
					{
						label: checkCustomer(user.cuscode) ? (
							<Label className='bill-price-description'>
								พ.ร.บ. รถ
								{data.prbPrice > 0 ? (
									<>
										<Span style={{ marginRight: '4px' }} />
										{!cancelPrb ? (
											<Button
												className='cancel-bill-btn'
												onClick={() => {
													setCancelPrb('cancel')
												}}
											>
												ตัดพ.ร.บ. จากบิล
											</Button>
										) : (
											<Button
												className='select-bill-btn'
												onClick={() => {
													setCancelPrb(null)
												}}
											>
												ดึงงาน พ.ร.บ.คืน
											</Button>
										)}
									</>
								) : null}
							</Label>
						) : (
							'พ.ร.บ. รถ'
						),
						itemBottomLast:
							data.prbPrice > 0 ? (
								<Label className='bill-price'>{`${convertStrToFormat(
									!cancelPrb ? data.prbPrice : '0',
									'money_digit'
								)} บาท`}</Label>
							) : (
								<Button
									className='accept-btn'
									width='120'
									onClick={() => redirect(ROUTE_PATH.COMPULSORY_MOTOR.LINK)}
								>
									แจ้งงาน พ.ร.บ.
								</Button>
							),
					},
					{
						label: checkCustomer(user.cuscode) ? (
							<Label className='bill-price-description'>
								ประกันรถ
								{insurePrice ? (
									<>
										<Span style={{ marginRight: '10px' }} />
										{!cancelIns ? (
											<Button
												className='cancel-bill-btn'
												onClick={() => {
													setCancelIns('cancel')
												}}
											>
												ตัดประกันจากบิล
											</Button>
										) : (
											<Button
												className='select-bill-btn'
												onClick={() => {
													setCancelIns(null)
												}}
											>
												ดึงงานประกันคืน
											</Button>
										)}
									</>
								) : null}
							</Label>
						) : (
							'ประกันรถ'
						),
						itemBottomLabel: insurePrice ? (
							<Label style={{ marginLeft: '20px', fontSize: '16px' }}>
								{data.select?.companyInsurance}
							</Label>
						) : null,
						itemBottomLast: !insurePrice ? (
							<Button
								className='accept-btn'
								width='120'
								onClick={() => redirect(ROUTE_PATH.VEHICLE_SELECTION.LINK)}
							>
								เช็คเบี้ยออโต้
							</Button>
						) : (
							<Label className='bill-price'>{`${convertStrToFormat(
								!cancelIns ? data.input?.insurePrice : '0',
								'money_digit'
							)} บาท`}</Label>
						),
					},
					{
						label: 'ภาษีรถ',
						itemBottomLast: (
							<Label className='bill-price'>
								<Input
									name='taxPrice'
									className='bill-price-input'
									onChange={(e) => setTaxPrice(e.target.value)}
									value={taxPrice}
									disabled={statusPaySucc}
									notvalue
								/>
							</Label>
						),
					},
					{
						label: 'ค่าปรับ',
						itemBottomLast: (
							<Label className='bill-price'>
								<Input
									name='finePrice'
									className='bill-price-input'
									onChange={(e) => setFinePrice(e.target.value)}
									value={finePrice}
									disabled={statusPaySucc}
									notvalue
								/>
							</Label>
						),
					},
					{
						label: 'ค่าตรวจสภาพรถ',
						itemBottomLast: (
							<Label className='bill-price'>
								<Input
									name='checkPrice'
									className='bill-price-input'
									onChange={(e) => setCheckPrice(e.target.value)}
									value={checkPrice}
									disabled={statusPaySucc}
									notvalue
								/>
							</Label>
						),
					},
					// {
					// 	label: 'ค่าโอนรถ',
					// 	hideItem: !checkCustomer(user.cuscode),
					// 	itemBottomLast: (
					// 		<Label className='bill-price'>
					// 			<Input
					// 				name='transCar'
					// 				className='bill-price-input'
					// 				onChange={(e) => setTransCar(e.target.value)}
					// 				value={transCar}
					// 				disabled={statusPaySucc}
					// 				notvalue
					// 			/>
					// 		</Label>
					// 	),
					// },
					{
						label: checkCustomer(user.cuscode) ? (
							<Label className='bill-price-description'>
								ค่าบริการ
								<Span style={{ marginRight: '10px' }} />
								<Button
									className='select-bill-btn'
									onClick={() => modalSelect.current.open()}
								>
									เลือกรายการ
								</Button>
							</Label>
						) : (
							'ค่าบริการ'
						),
						itemBottomLast: (
							<Label className='bill-price'>
								<Input
									name='sevicePrice'
									className='bill-price-input'
									onChange={(e) => setSevicePrice(e.target.value)}
									value={sevicePrice}
									disabled={
										sListSelect.length > 0 ||
										checkCustomer(user.cuscode) ||
										statusPaySucc
									}
									notvalue
								/>
							</Label>
						),
					},
					...costForm(costList, setCostList, statusPaySucc, user),
				],
			},
		},
		{
			section: {
				title: 'เงื่อนไขการชำระ',
				hide:
					(insurePrice || data.prbPrice) && (!cancelPrb || !cancelIns)
						? false
						: true,
				items: [
					{
						label: 'พ.ร.บ. รถ',
						classBoxLabel: 'bill-price-method-wrapper',
						hideItem: data.prbPrice > 0 && !cancelPrb ? false : true,
						itemTopLabel: (
							<Select
								name='payPrbCondition'
								value='full'
								onChange={(v) => setPayPrbCondition(v)}
								options={[{ value: 'full', text: 'จ่ายเต็ม' }]}
								style={{ marginRight: '10px', width: '420px' }}
								disabled={statusPaySucc}
								notvalue
							/>
						),
						itemBottomLast: (
							<Label className='bill-price'>{`${convertStrToFormat(
								data.prbPrice,
								'money_digit'
							)} บาท`}</Label>
						),
					},
					{
						label: 'ประกันรถ',
						itemInBoxLabel:
							payCondition !== 'full' ? (
								<Label>
									เบี้ยทั้งหมด {convertStrToFormat(insurePrice, 'money_digit')}
								</Label>
							) : null,
						hideItem: insurePrice > 0 && !cancelIns ? false : true,
						classBoxLabel: 'bill-price-method-wrapper',
						itemTopLabel: (
							<Select
								name='payCondition'
								value={payCondition}
								onChange={(v) => {
									setConditionInstall(null)
									setPayCondition(v)
								}}
								options={
									checkCustomer(user.cuscode)
										? [{ key: 0, value: 'full', text: 'จ่ายเต็ม' }]
										: [
												{ key: 0, value: 'full', text: 'จ่ายเต็ม' },
												// {
												// 	key: 1,
												// 	value: 'fullTran',
												// 	text: 'จ่ายเต็ม (โอนเงิน / Qr-Code)',
												// },
												// {
												// 	key: 2,
												// 	value: 'installTran',
												// 	text: 'ผ่อนชำระ (โอนเงิน / Qr-Code)',
												// },
												// {
												// 	key: 2,
												// 	value: 'installCredit',
												// 	text: 'ผ่อนชำระ (ตัดบัตรเครดิต)',
												// },
										  ]
								}
								style={{ marginRight: '10px', width: '420px' }}
								disabled={statusPaySucc}
								notvalue
							/>
						),
						itemBottomLast: (
							<Label className='bill-price'>{`${convertStrToFormat(
								insurePrice,
								'money_digit'
							)} บาท`}</Label>
						),
					},
					{
						label: 'รูปแบบการจ่าย / งวด',
						hideItem: ['full', 'fullTran'].includes(payCondition),
						classBoxLabel: 'bill-price-method-wrapper',
						itemTopLabel: (
							<Select
								name='installment'
								placeholder='กรุณาระบุ'
								value={installment}
								onChange={(v) => {
									setConditionInstall(null)
									setChannelPayment(false)
									setInstallment(v)
								}}
								options={[
									{ text: 'ผ่อน 3 งวด', value: '3' },
									{ text: 'ผ่อน 4 งวด', value: '4' },
									{ text: 'ผ่อน 6 งวด', value: '6' },
									{ text: 'ผ่อน 7 งวด', value: '7' },
									{ text: 'ผ่อน 8 งวด', value: '8' },
									{ text: 'ผ่อน 10 งวด', value: '10' },
								]}
								style={{ marginRight: '10px', width: '420px' }}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
					{
						label: 'เงื่อนไขการผ่อนค่างวด',
						itemInBoxLabel: conditionInstall && (
							<Label>
								แผนประกัน{' '}
								{funcCulPayment('planInstallment')?.data_plan[0]?.label}
							</Label>
						),
						hideItem: ['full', 'fullTran'].includes(payCondition),
						classBoxLabel: 'bill-price-method-wrapper',
						itemTopLabel: (
							<Select
								name='conditionInstall'
								placeholder='กรุณาระบุ'
								value={conditionInstall}
								onChange={(v) => {
									setPayMethod('qrCode')
									setChannelPayment(false)
									setDiscount(null)
									setDiscountPrb(null)
									setDiscountOther(null)
									setDiscountService(null)
									setConditionInstall(v)
								}}
								options={funcConditionOption()}
								style={{ marginRight: '10px', width: '420px' }}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: '',
				hide:
					checkCustomer(user.cuscode) ||
					premistions.status_permissions === 'notview',
				items: [
					{
						label: 'ผลตอบแทนพรบ',
						hideItem: !(data.prbPrice > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('comPrb') || '0',
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: 'ผลตอบแทนประกันภัย',
						hideItem: !(insurePrice > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('comIns'),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: `หักค่าผ่อน ${
							detailQuonum?.per_install
								? detailQuonum?.per_install[installment]
								: ''
						}%`,
						hideItem: !(conditionInstall && insurePrice > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${funcCulPayment('installPrecent')} บาท`}
							</Label>
						),
					},
					{
						label: `หักภาษี ณ ที่จ่าย 3%`,
						hideItem: !(conditionInstall && insurePrice > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('calVat'),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: `ผลตอบแทนทั้งหมด`,
						hideItem: !(conditionInstall && insurePrice > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('calComTotal'),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: `ผลตอบแทนหักส่วนลด`,
						hideItem: !(conditionInstall && insurePrice > 0 && discount > 0),
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('calTotalDiffDiscount'),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
				],
			},
		},
		{
			section: {
				title: '',
				items: [
					{
						label: `${
							data.prbPrice > 0 && insurePrice > 0
								? 'ค่าชำระ พ.ร.บ. และประกัน'
								: data.prbPrice > 0
								? 'ค่าชำระ พ.ร.บ'
								: data.input?.insurePrice > 0
								? 'ค่าชำระประกัน'
								: ''
						}`,
						hideItem: !data.prbPrice && !insurePrice,
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									funcCulPayment('calInsPrb'),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: 'รวมค่าใช้จ่ายเพิ่มเติม',
						showBoxBlank: true,
						classBoxLabel: 'sum-price-detail',
						itemBottomLabel: (
							<Label className='bill-price'>
								{`${convertStrToFormat(
									Number(
										Number(taxPrice || 0) +
											Number(finePrice || 0) +
											Number(sevicePrice || 0) +
											Number(transCar || 0) +
											Number(funcCulPayment('priceCost') || 0) +
											Number(checkPrice || 0) -
											Number(discountOther || 0) -
											Number(discountService || 0)
									).toFixed(2),
									'money_digit'
								)} บาท`}
							</Label>
						),
					},
					{
						label: 'ส่วนลดพรบ',
						hideItem: premistions.status_permissions === 'saleFin',
						classBoxLabel: 'discount-price-detail',
						itemBottomLabel: (
							<Input
								name='discountPrb'
								className='bill-price-input'
								value={discountPrb}
								onChange={(e) => {
									const { value } = e.target
									if (value <= +parseInt(data.prbPrice)) {
										setDiscountPrb(value)
									} else {
										message.warning('ส่วนลดเกินราคาพรบ')
									}
								}}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
					{
						label: 'ส่วนลดประกัน',
						// hideItem: true,
						classBoxLabel: 'discount-price-detail',
						itemBottomLabel: (
							<Input
								name='discount'
								className='bill-price-input'
								value={discount}
								onChange={(e) => {
									const { value } = e.target
									const comTotal = funcCulPayment('calComTotal')
									if (value <= comTotal) {
										setChannelPayment(false)
										setDiscount(value)
									} else {
										message.warning('ส่วนลดเกินผลตอบแทน')
									}
								}}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
					{
						label: 'ส่วนลดค่าตรวจสภาพ',
						hideItem: !checkCustomer(user.cuscode),
						classBoxLabel: 'discount-price-detail',
						itemBottomLabel: (
							<Input
								name='discountOther'
								className='bill-price-input'
								value={discountOther}
								onChange={(e) => {
									const { value } = e.target
									setDiscountOther(value)
								}}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
					{
						label: 'ส่วนลดค่าบริการ',
						hideItem: !checkCustomer(user.cuscode),
						classBoxLabel: 'discount-price-detail',
						itemBottomLabel: (
							<Input
								name='discountService'
								className='bill-price-input'
								value={discountService}
								onChange={(e) => {
									const { value } = e.target
									setDiscountService(value)
								}}
								disabled={statusPaySucc}
								notvalue
							/>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'ลูกค้าต้องการชำระช่องทางใด',
				items: [
					{
						itemTopLabel: (
							<Select
								name='payMethod'
								defaultValue={payMethod}
								value={payMethod}
								onChange={(v) => setPayMethod(v)}
								disabled={conditionInstall}
								options={
									checkCustomer(user.cuscode)
										? [
												{ key: 1, value: 'cash', text: 'เงินสด' },
												{ key: 2, value: 'tranferVif', text: 'โอนเงิน' },
												{ key: 3, value: 'qrCode', text: 'สแกนคิวอาร์โค้ด' },
												{
													key: 4,
													value: 'qrCodeEdc',
													text: 'สแกนคิวอาร์โค้ด (EDC)',
												},
												{
													key: 5,
													value: 'edc',
													text: 'บัตรเครดิต',
												},
										  ]
										: [
												{ key: 1, value: 'cash', text: 'เงินสด' },
												{ key: 2, value: 'qrCode', text: 'สแกนคิวอาร์โค้ด' },
												// {
												// 	key: 2,
												// 	value: 'tranferVif',
												// 	title: 'โอนเข้าบัญชีธนาคาร ตรอ.',
												// },
										  ]
								}
								style={{ marginRight: '10px', width: '200px' }}
								notvalue
							/>
						),
						itemBottomLast: (
							<Box className='discount-price-detail'>
								<Label className='bill-net'>ยอดสุทธิ</Label>
								<Label className='bill-net'>
									{conditionInstall
										? `${convertStrToFormat(
												funcCulPayment('planInstallment')?.data_plan[0]
													?.first_price +
													Number(taxPrice || 0) +
													Number(finePrice || 0) +
													Number(sevicePrice || 0) +
													Number(transCar || 0) +
													Number(funcCulPayment('priceCost') || 0) +
													Number(checkPrice || 0),
												'money_digit'
										  )} บาท`
										: `${convertStrToFormat(
												Number(
													Number(!cancelPrb ? data.prbPrice || 0 : 0) +
														Number(!cancelIns ? insurePrice : 0) +
														Number(taxPrice || 0) +
														Number(finePrice || 0) +
														Number(sevicePrice || 0) +
														Number(transCar || 0) +
														Number(funcCulPayment('priceCost') || 0) +
														Number(checkPrice || 0) -
														Number(discount || 0) -
														Number(discountPrb || 0) -
														Number(discountOther || 0) -
														Number(discountService || 0)
												).toFixed(2),
												'money_digit'
										  )} บาท`}
								</Label>
							</Box>
						),
					},
				],
			},
		},
		{
			section: {
				title: 'เงื่อนไขการออกกรมธรรม์',
				items: [
					{
						classBoxLabel: 'bill-price-method-wrapper',
						hideLabel: true,
						itemTopLabel: (
							<Label className='bill-method-description'>ออกกรมธรรม์</Label>
						),
						itemBottomLabel: (
							<Select
								name='insurePrint'
								value={insurePrint}
								onChange={(value) => {
									setInsurePrint(value)
								}}
								options={[
									{
										key: '0',
										value: 'vif',
										text: 'ตรอ. ออก',
									},
									// {
									// 	key: '1',
									// 	value: 'fin',
									// 	text: 'ฟินออก',
									// },
								]}
								style={{ marginRight: '10px', width: '200px' }}
								notvalue
							/>
						),
					},
				],
			},
		},
	]

	return (
		<Box>
			<DetailLayout isPreve={true} isStep={true} label='สรุปข้อมูล'>
				{form.map((e, i) => {
					const { section } = e
					return (
						<React.Fragment key={i}>
							{!section.hide && (
								<Box>
									<Label className='title-second-form'>{section.title}</Label>
									{section.items.map((el, il) => {
										return (
											<React.Fragment key={il}>
												{!el.hideItem && (
													<Box>
														<Box className='bill-price-detail'>
															{el.showBoxBlank && <Box></Box>}
															<Box className={el.classBoxLabel}>
																{el.itemTopLabel}
																{!el.hideLabel &&
																	(el.itemInBoxLabel ? (
																		<Box>
																			<Label className='bill-price-description'>
																				{el.label}
																			</Label>
																			{el.itemInBoxLabel}
																		</Box>
																	) : (
																		<Label className='bill-price-description'>
																			{el.label}
																		</Label>
																	))}
																{el.itemBottomLabel}
															</Box>
															{el.itemBottomLast}
														</Box>
													</Box>
												)}
											</React.Fragment>
										)
									})}
								</Box>
							)}
						</React.Fragment>
					)
				})}
				<Box className='accept-group-btn-wrapper'>
					{(['full', 'fullTran'].includes(payCondition) ||
						(!channelPayment && conditionInstall)) && (
						<Button
							className='accept-btn'
							width='150'
							onClick={() => modal.current.open()}
						>
							พิมพ์ใบเสร็จ
						</Button>
					)}
					<Modal
						ref={modal}
						okText='ตกลง'
						headerText='พิมพ์ใบเสร็จ'
						modalHead='modal-header-red'
						iconsClose={
							<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
						}
					>
						<Box className='slip-print'>
							<Box>
								<Label>รับเงิน</Label>
								<InputNumber
									name='payment'
									value={payment}
									onChange={(value) => setPayment(value)}
									formatter={(value) => numberWithCommas(value)}
									min={0}
									notvalue
								/>
							</Box>
							<Box>
								<Label>นัดรับ</Label>
								<Box className='appointment-time'>
									<DatePickerWithLabel
										name='dataAppointment'
										format='DD/MM/YYYY'
										placeholder='วันที่'
										width='200'
										onChange={(date) => setDateAppointment(date)}
									/>
									<TimePicker
										name='timeAppointment'
										placeholder='เวลา'
										style={{ marginLeft: '20px', marginTop: '5px' }}
										format='HH:mm'
										onChange={(time) => setTimeAppointment(time)}
									/>
								</Box>
							</Box>
							<Box style={{ marginBottom: '20px' }}>
								<Radio.Group
									value={addressBill}
									onChange={(e) => setAddressBill(e.target.value)}
								>
									<Radio value='vif'>ที่อยู่ ตรอ.</Radio>
									<Radio value='fin'>ที่อยู่ฟิน</Radio>
								</Radio.Group>
							</Box>
							{!checkCustomer(user.cuscode) && (
								<Button
									className='accept-btn'
									onClick={() => handleClick.slip('slip')}
									disabled={disibleSlip()}
								>
									สลิป
								</Button>
							)}
							<Button
								className='accept-btn'
								onClick={() => handleClick.slip('a4', addressBill)}
								disabled={disibleSlip()}
							>
								{checkCustomer(user.cuscode) ? 'ใบฝากงาน' : 'เต็ม'}
							</Button>
							{!checkCustomer(user.cuscode) && (
								<Button
									className='accept-btn'
									onClick={() => handleClick.slip('double', addressBill)}
									disabled={disibleSlip()}
								>
									ครึ่ง
								</Button>
							)}
							{checkCustomer(user.cuscode) && (
								<>
									<Button
										className='accept-btn'
										onClick={() =>
											handleClick.slip('taxReceiptA4', addressBill)
										}
										disabled={disibleSlip()}
									>
										ใบเสร็จรับเงิน
									</Button>
									<Button
										className='accept-btn'
										onClick={() => handleClick.slip('taxA4', addressBill)}
										disabled={disibleSlip()}
									>
										ใบกำกับภาษี
									</Button>
								</>
							)}
						</Box>
					</Modal>
					{(['full', 'fullTran'].includes(payCondition) || statusPaySucc) && (
						<Button
							className='select-btn'
							width='200'
							disabled={
								Number(
									Number(customer?.prbPrice || 0) +
										Number(insurePrice || 0) -
										Number(discount || 0) -
										Number(discountPrb || 0)
								) === 0
							}
							onClick={handleClick.submitToBill}
						>
							พิมพ์พรบ/กรมธรรม์
						</Button>
					)}
					{checkCustomer(user.cuscode) && customer?.bill_num && (
						<Button
							className='select-btn'
							width='200'
							onClick={handleClick.submitToPaymentTro}
						>
							ชำระเงิน
						</Button>
					)}
					{!statusPaySucc &&
						payCondition !== 'full' &&
						!channelPayment &&
						conditionInstall && (
							<Button
								className='select-btn'
								width='200'
								onClick={() => setChannelPayment(true)}
							>
								ชำระเงินผ่อน
							</Button>
						)}
				</Box>
				<Modal ref={modalSelect} okText='ตกลง'>
					<Box className='service-select-box'>
						<Table
							rowSelection={rowSelection}
							columns={[
								{
									title: 'ชื่อรายการ',
									dataIndex: 'name',
									key: 'name',
								},
								{
									title: 'ราคา (บาท)',
									dataIndex: 'price',
									key: 'price',
								},
							]}
							dataSource={serviceList}
							bordered
							scroll={{ y: 320 }}
							pagination={false}
						/>
					</Box>
				</Modal>
			</DetailLayout>
			{!statusPaySucc && channelPayment && handlePayment()}
		</Box>
	)
}
export default Bill

const tranfer = (
	installment,
	planInstallment,
	data,
	handleClick,
	setStatusPaySucc
) => {
	return (
		<Tranfer
			installment={installment}
			planInstallment={planInstallment}
			data={data}
			handleClick={handleClick}
			setStatusPaySucc={setStatusPaySucc}
		/>
	)
}

const costForm = (costList, setCostList, statusPaySucc, user) => {
	const removeItem = (key) => {
		const data = costList.filter((e, i) => i !== key)
		setCostList(data)
	}

	const addItem = () => {
		const data = { name: '', price: '' }
		setCostList([...costList, data])
	}

	const handleChangInputItem = (name, value, key) => {
		const data = _.set(costList, `${[key]}.${name}`, value)
		setCostList([...data])
	}

	const data = costList?.map((e, i) => {
		return {
			label: (
				<Box>
					<Input
						addonBefore='รายการ'
						name='name'
						onChange={(el) => {
							const { name, value } = el.target
							handleChangInputItem(name, value, i)
						}}
						value={e.name}
						disabled={statusPaySucc}
						notvalue
					/>
					{costList.length > 1 && !e.name && (
						<Label color='red' style={{ textAlign: 'start', fontSize: '14px' }}>
							กรุณากรอกรายการ
						</Label>
					)}
				</Box>
			),
			hideItem: !checkCustomer(user.cuscode),
			itemBottomLast: (
				<Box>
					<Label className='bill-price'>
						{costList.length > 1 && (
							<Button className='remove-bill-btn' onClick={() => removeItem(i)}>
								ลบ
							</Button>
						)}
						<Input
							name='price'
							className='bill-price-input'
							onChange={(el) => {
								const { name, value } = el.target
								handleChangInputItem(name, value, i)
							}}
							value={e.price}
							disabled={statusPaySucc}
							notvalue
						/>
					</Label>
					{costList.length > 1 && !e.price && (
						<Label color='red' style={{ textAlign: 'end' }}>
							กรุณากรอกค่าใช้จ่าย
						</Label>
					)}
				</Box>
			),
		}
	})
	return [
		...data,
		{
			hideItem: !checkCustomer(user.cuscode),
			itemBottomLast: (
				<Button className='select-btn' onClick={addItem}>
					+ เพิ่ม
				</Button>
			),
		},
	]
}
