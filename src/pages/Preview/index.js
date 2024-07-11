import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Modal } from 'antd'
import moment from 'moment'
import { Box, Label, Button, Tab } from '../../components'
import { DetailLayout } from '../Layout/DetailLayout'
import {
	convertCC,
	convertStrToFormat,
	isValidResponse,
	redirect,
	ROUTE_PATH,
	setFiles,
	calCompulsoryTaxDay,
	calProtectDate,
	checkCustomer,
	LIST,
	// storePdf,
} from '../../helpers'
import { loadingAction, creditAction } from '../../actions'
import {
	externalController,
	pdfController,
	systemController,
	userController,
	taskController,
	baseController,
	companyController,
	paymentController,
	policyController,
} from '../../apiServices'
import _ from 'lodash'

const Preview = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.profileReducer)
	const customer = useSelector((state) => state.customerReducer)
	const premistions = useSelector((state) => state.premissionsReducer)
	const dataFilesSuccess = useSelector((state) => state.filesSuccessReducer)
	const [customerData, setCustomerData] = useState({})
	const [tabKey, setTabKey] = useState('0')
	const [credit, setCredit] = useState({
		all: '0',
		use: '0',
		cur: '0',
	})
	const [insureParams, setInsureParams] = useState({})

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		if (!_.isEmpty(customer)) {
			dispatch(loadingAction(false))
			const {
				input,
				select,
				prbPrice,
				amount_inc,
				amount,
				brand,
				year,
				series,
				subSeries,
				quoNum,
				insurePrice,
				legal,
				contactDate,
				addressDelivery,
				amphoeDelivery,
				districtDelivery,
				provinceDelivery,
				zipcodeDelivery,
				isPassport,
				carType,
				compulsoryType,
				protectedDate,
				lastProtectedDate,
				taxExpireDate,
				workType,
				repairType,
				insureType,
				receiver,
				telDelivery,
				model,
				brandTitle,
				seriesTitle,
				subSeriesTitle,
			} = customer

			if (Number.parseInt(prbPrice) > 0) {
				setTabKey('0')
			} else if (Number.parseInt(amount_inc) > 0) {
				setTabKey('1')
			} else if (
				Number.parseInt(amount_inc) > 0 &&
				Number.parseInt(prbPrice) > 0
			) {
				setTabKey('0')
			}

			const {
				net: p_netPremium,
				vat: p_vat,
				duty: p_stamp,
			} = calCompulsoryTaxDay(
				input.compulsoryPrice?.netPrice,
				calProtectDate(
					moment(protectedDate),
					moment(lastProtectedDate),
					select?.companyCompulsory
				),
				select?.companyCompulsory,
				'all'
			)

			setCustomerData({
				...customer,
				brand: brand === 'none' ? input.brandOther : brand,
				year: year === 'none' ? input.yearOther : year,
				series: series === 'none' ? input.seriesOther : series,
				brandOther: input?.brandOther || null,
				yearOther: input?.yearOther || null,
				seriesOther: input?.seriesOther || null,
				carType: carType,
				companyCompulsory: select?.companyCompulsory || '-',
				companyInsurance: select?.companyInsurance || '-',
				compulsoryType: compulsoryType,
			})
			setInsureParams({
				quo_num: quoNum,
				registerYear: select?.registerYear,
				address: input?.addressInsurance,
				addressReceiptien: addressDelivery,
				amount_inc: insurePrice,
				amount,
				priceprb: +prbPrice,
				amphoe: select?.amphoeInsurance,
				amphoeReceiptien: amphoeDelivery,
				assured_insurance_capital1: input?.newInsureBudget?.replace(',', ''),
				birthDate:
					legal === 'บุคคลทั่วไป'
						? select?.birthYear && select?.birthMonth && select?.birthDate
							? `${select?.birthYear}-${select?.birthMonth}-${select?.birthDate}`
							: ''
						: '',
				brandplan:
					brand === 'none'
						? input?.brandOther
						: select?.companyInsurance === 'ทิพยประกันภัย' ||
						  select?.companyCompulsory === 'ทิพยประกันภัย' ||
						  select?.companyCompulsory === 'ไทยศรีประกันภัย'
						? brandTitle?.text || ''
						: brand,
				camera: select?.camera || '',
				carType: select?.carType,
				car_type: select?.carType,
				carcolor: select?.colorCar || '',
				carprovince: select?.vehicleRegistrationArea,
				cc_car: convertCC(input?.engineCC),
				companyCompulsory: select?.companyCompulsory || '-',
				companyInsurance: select?.companyInsurance || '-',
				contactDate: contactDate,
				deductible: input?.damage1,
				district: select?.districtInsurance,
				districtReceiptien: districtDelivery,
				id_motor1: input.engineNo ? input.engineNo : '',
				id_motor2: input?.chassisSerialNumber,
				idcard: input?.idCard,
				gender: select?.gender,
				insuredType: legal === 'บุคคลทั่วไป' ? '1' : '2',
				isPassport,
				lastProtectedDate: moment(lastProtectedDate).format('YYYY-MM-DD'),
				lastname:
					legal === 'นิติบุคคล' &&
					select?.companyCompulsory === 'เคดับบลิวไอประกันภัย'
						? `${select?.title}${input?.name}`
						: legal === 'บุคคลทั่วไป' ||
						  [
								'แอกซ่าประกันภัย',
								'ไทยศรีประกันภัย',
								'บริษัทกลาง',
								'ฟอลคอนประกันภัย',
						  ].includes(select?.companyCompulsory)
						? input?.lastname || ''
						: '',
				name:
					legal === 'นิติบุคคล' &&
					select?.companyCompulsory === 'เคดับบลิวไอประกันภัย'
						? ' '
						: input?.name,
				no_car:
					select?.carCode === '110.1'
						? '110'
						: select?.carCode === '320.1'
						? '320'
						: select?.carCode,
				number_car: convertStrToFormat(
					input?.vehicleRegistrationNumber,
					'idcar'
				),
				policyStatus: workType,
				previousPolicyNumber: input?.policyNo,
				policyNoPrb: '',
				prb_type: select?.compulsoryType || '',
				protectedDate: moment(protectedDate).format('YYYY-MM-DD'),
				province: select?.provinceInsurance,
				provinceReceiptien: provinceDelivery,
				receiptienName: receiver,
				receiptienTel: telDelivery,
				repair_type: repairType,
				respon1: input?.damage2,
				respon2: input?.damage3,
				respon3: input?.damage4,
				respon4: input?.damage5,
				respon5: input?.damage6,
				respon6: input?.damage7,
				respon7: input?.damage8,
				seatingCapacity: select?.seat,
				seriesplan:
					series === 'none'
						? input?.seriesOther
						: select?.companyInsurance === 'ทิพยประกันภัย' ||
						  select?.companyCompulsory === 'ทิพยประกันภัย' ||
						  select?.companyCompulsory === 'ไทยศรีประกันภัย'
						? seriesTitle?.text || ''
						: series,
				sub_seriesplan: subSeries ? subSeries : '',
				tel: input?.tel ? input?.tel.replace(/-/g, '') : '',
				title: select?.title,
				type: insureType,
				vehBodyTypeDesc: select?.bodyType,
				weight_car: input?.carWeight,
				yearplan: year === 'none' ? input?.yearOther : `${year}`,
				zipcode: select?.zipcodeInsurance,
				zipcodeReceiptien: zipcodeDelivery,
				tax_expire_date: moment(taxExpireDate).format('YYYY-MM-DD'),
				id_cus: user.cuscode,
				cus_name: user.name,
				road: input.roadInsurance || '',
				soi: input.soiInsurance || '',
				address2: `${input.roadInsurance || ''} ${input.soiInsurance || ''}`,
				model: model || '',
				make: brand,
				make_code: brand,
				make_name: brandTitle?.text || '',
				model_code: series,
				model_name: seriesTitle?.text || '',
				sub_model_code: subSeriesTitle?.code,
				sub_model_name: subSeriesTitle?.text || '',
				p_netPremium,
				p_vat,
				p_stamp,
				country_code: select?.country,
				nationality_code: select?.national || 'THA',
				policyNo_cmi: input?.policyNoPrb,
			})
		}
	}, [dispatch, customer, user.cuscode, user.name])

	const fetchCredit = useCallback(async () => {
		const API = userController()
		const res = await API.getCredit()
		if (isValidResponse(res)) {
			const creditRes = res.result[0]
			setCredit({
				all: creditRes.credit_vif_total,
				use: creditRes.credit_vif_use === null ? '0' : creditRes.credit_vif_use,
				cur: creditRes.credit_vif_cur,
			})
			dispatch(
				creditAction({
					creditBalance: creditRes.credit_vif_cur,
					creditTotal: creditRes.credit_vif_total,
					creditUse:
						creditRes.credit_vif_use === null ? '0' : creditRes.credit_vif_use,
				})
			)
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
		fetchCredit()
	}, [fetchData, fetchCredit])

	const handleChangeTabKey = (e) => {
		setTabKey(e)
	}

	const changTapKey = (newAmountInc, submit) => {
		const tapToIns = tabKey === '0' && newAmountInc > 0
		fetchCredit()
		if (tapToIns && submit) {
			Modal.info({
				title: 'คุณต้องการพิมพ์ประกัน?',
				onOk: () => {
					document.getElementsByClassName('accept-btn')[0].click()
				},
				okText: 'ใช่',
				cancelText: 'ไม่',
			})
		} else if (tapToIns) {
			setTabKey('1')
		}
	}

	const handleOffCompany = async (company, errorMsg) => {
		if (LIST.Error_Message_Api.includes(errorMsg)) {
			const { quoNum } = customerData
			const params = {
				company,
				prb_rank: '99',
				type: 'prb',
			}
			const params2 = {
				company,
				quo_num: quoNum,
				error_msg: errorMsg,
			}
			const API = companyController()
			await Promise.all([
				API.changOnCompanyAll(params),
				API.sendNotiLineErrorVif(params2),
			])
		}
	}

	const handleClickSubmit = {
		checkprbIns: async (quo_num) => {
			try {
				dispatch(loadingAction(true))
				const API = systemController()
				const res = await API.getSystempayfileVif(quo_num)
				if (isValidResponse(res)) {
					const { prb_policy, insur_policy } = res.result[0]
					if (tabKey === '0') {
						if (prb_policy) {
							dispatch(loadingAction(false))
							window.open(prb_policy, '__blank')
							return false
						} else {
							return true
						}
					} else if (tabKey === '1') {
						if (insur_policy) {
							dispatch(loadingAction(false))
							window.open(insur_policy, '__blank')
							return false
						} else {
							return true
						}
					}
				} else {
					return true
				}
			} catch (e) {
				return true
			}
		},
		checkPrbInsSame: async () => {
			const type = tabKey === '1' ? 'VMI' : 'CMI'
			const id_motor2 = customer.input?.chassisSerialNumber
			const params = {
				id_motor2,
				type,
			}
			const API = systemController()
			const res = await API.checkPrbInsSame(params)
			console.log('aaa', res)
			if (isValidResponse(res)) {
				const alertSame = res.result
				if (alertSame) {
					dispatch(loadingAction(false))
					Modal.error({
						title: 'ไม่สามารถพิมพ์ได้',
						content: 'เนื่องจากกรมธรรม์ซ้ำในระบบตรอ.',
					})
					return false
				} else {
					return true
				}
			} else {
				return true
			}
		},
		checkPrint: async () => {
			if (await handleClickSubmit.checkprbIns(customer.quoNum)) {
				console.log(customer.quoNum, 'api')
				if (
					user.vif_type === '1' &&
					(await handleClickSubmit.checkPrbInsSame())
				) {
					const priceUse = Number(
						Number(
							tabKey === '0'
								? customerData?.prbPrice - customerData.com?.show_com_prb
								: customerData.insurePrice - customerData.com?.show_com_ins
						).toFixed(2)
					)
					if (
						customerData?.statusPaySucc ||
						customerData?.payCondition === 'installTran' ||
						checkCustomer(user.cuscode)
					) {
						handleClickSubmit.savePrint()
					} else if (+credit.cur < priceUse && !checkCustomer(user.cuscode)) {
						redirect(ROUTE_PATH.HOMEPAGE.LINK)
						Modal.error({
							title: 'ไม่สามารถบันทึกและพิมพ์ได้',
							content: 'กรุณาเติมเงิน เนื่องจากวงเงินคงเหลือไม่เพียงพอ',
							onOk: () => redirect(`${ROUTE_PATH.DEBIT.LINK}/plusmoney`),
							okText: 'เติมเครดิต',
						})
					} else if (+credit.cur >= priceUse) {
						handleClickSubmit.savePrint()
					}
				} else if (
					user.vif_type !== '1' &&
					(await handleClickSubmit.checkPrbInsSame())
				) {
					const priceUse = Number(
						Number(
							tabKey === '0' ? customerData?.prbPrice : customerData.insurePrice
						).toFixed(2)
					)

					if (
						customerData?.statusPaySucc ||
						customerData?.payCondition === 'installTran'
					) {
						handleClickSubmit.savePrint()
					} else if (+credit.cur < priceUse) {
						redirect(ROUTE_PATH.HOMEPAGE.LINK)
						Modal.error({
							title: 'ไม่สามารถบันทึกและพิมพ์ได้',
							content: 'กรุณาชำระเงิน เนื่องจากวงเงินคงเหลือไม่เพียงพอ',
							onOk: () => redirect(`${ROUTE_PATH.REPORT.LINK}/invoice`),
							okText: 'ชำระเครดิต',
						})
					} else if (+credit.cur >= priceUse) {
						handleClickSubmit.savePrint()
					}
				}
			}
		},
		savePrint: async () => {
			const { quoNum, amount_inc, prbPrice } = customerData

			const newAmountInc =
				user.vif_type === '1'
					? Number(
							Number(amount_inc - customerData.com?.show_com_ins).toFixed(2)
					  ) || 0
					: amount_inc
			const newPrbPrice =
				user.vif_type === '1'
					? Number(Number(prbPrice - customerData.com?.show_com_prb).toFixed(2))
					: prbPrice

			const logAPI = systemController()
			await logAPI.logDataVif(insureParams)
			if (customerData.insurePrint === 'vif') {
				if (
					customerData.companyCompulsory === 'ไทยศรีประกันภัย' &&
					customerData.companyInsurance === 'ไทยศรีประกันภัย'
				) {
					const API = externalController()
					const res = await API.thaisriPrbInsure(insureParams)
					if (isValidResponse(res)) {
						console.log(res)
						const pdf = res.data.urlprint
						const pdf2 = res.data.urlprint2
						if (pdf) {
							uploadPdfToSpace(
								pdf,
								insureParams.quo_num,
								customerData.companyCompulsory,
								undefined,
								'pdf',
								newAmountInc
							)
							await calCredit(quoNum, newPrbPrice, '0')
						} else {
							Modal.error({
								title: `ไม่สามารถพิมพ์พรบไทยศรีประกันภัยได้ เลขรายการ ${quoNum}`,
								content: res.data.error,
							})
							dispatch(loadingAction(false))
						}

						if (pdf2) {
							uploadPdfToSpace(
								pdf2,
								insureParams.quo_num,
								undefined,
								customerData.companyInsurance,
								'pdf',
								newAmountInc
							)
							await calCredit(quoNum, newAmountInc, '1')
						} else {
							Modal.error({
								title: `ไม่สามารถพิมพ์ประกันไทยศรีประกันภัยได้ เลขรายการ ${quoNum}`,
								content: res.data.error,
							})
							dispatch(loadingAction(false))
						}
					} else {
						Modal.error({
							title: 'ไม่สามารถพิมพ์ได้',
							content: 'กรุณาติดต่อผู้พัฒนา',
						})
						dispatch(loadingAction(false))
					}
				} else {
					if (tabKey === '0') {
						handleClickSubmit.callApiPrb(quoNum, newPrbPrice, newAmountInc)
					} else if (tabKey === '1') {
						handleClickSubmit.callApiInsure(quoNum, newAmountInc)
					} else {
						Modal.success({
							title: 'บันทึกสำเร็จ',
						})
						dispatch(loadingAction(false))
					}
				}
			} else if (customerData.insurePrint === 'fin') {
				Modal.success({
					title: 'บันทึกสำเร็จ',
				})
				await calCredit(quoNum, customerData?.prbPrice, tabKey)
				dispatch(loadingAction(false))
			}
		},
		callApiPrb: async (quoNum, newPrbPrice, newAmountInc) => {
			switch (customerData.companyCompulsory) {
				case 'อินทรประกันภัย':
					console.log(insureParams)
					dispatch(loadingAction(false))
					Modal.error({
						title: 'ไม่สามารถพิมพ์ได้',
						content: 'กรุณาเลือกบริษัทใหม่อีกครั้ง',
					})
					break
				case 'อินทรประกันภัย(สาขาสีลม)':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.intraPrbV2(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								await handleOffCompany(
									customerData.companyCompulsory,
									res.result.message
								)
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'แอกซ่าประกันภัย':
					{
						const API = policyController()
						const res = await API.ddPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							const slip = res.result.data.urlprint2
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								window.open(slip)
								// uploadPdfToSpace(
								// 	slip,
								// 	`${insureParams.quo_num}-slip`,
								// 	customerData.companyCompulsory,
								// 	undefined,
								// 	'slip',
								// 	newAmountInc
								// )
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content:
										res.result.data.message === 'premium not match!'
											? 'กรุณาเลือกชนิดรถให้ตรงกับประเภท พ.ร.บ.'
											: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							dispatch(loadingAction(false))
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
						}
					}
					break
				case 'คุ้มภัยโตเกียวมารีนประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.kumpaiPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								await handleOffCompany(
									customerData.companyCompulsory,
									res.result.data.error
								)
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ชับบ์สามัคคีประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.chubbPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'วิริยะประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.viriyaPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else if (
								res.result.error === 'This agentcode has no stock left'
							) {
								await handleOffCompany(
									customerData.companyCompulsory,
									res.result.error
								)
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ ${quoNum}`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ทิพยประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.tipPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'เมืองไทยประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.mtiPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'เจมาร์ทประกันภัย (เจพี)':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.jaymartPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ไทยศรีประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.thaisriPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								await handleOffCompany(
									customerData.companyCompulsory,
									res.result.data.message
								)

								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ไทยเศรษฐกิจประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.thaiSetakijPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'เคดับบลิวไอประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.kwiPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'บริษัทกลาง':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.rvpPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ฟอลคอนประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.fciPrb(insureParams)
						if (isValidResponse(res)) {
							console.log('res', res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									customerData.companyCompulsory,
									undefined,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newPrbPrice, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				default:
					return
			}
		},
		callApiInsure: async (quoNum, newAmountInc) => {
			switch (customerData.companyInsurance) {
				case 'ชับบ์สามัคคีประกันภัย':
					{
						const API = policyController()
						const res = await API.chubbInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'คุ้มภัยโตเกียวมารีนประกันภัย':
					{
						const API = policyController()
						const res = await API.kumpaiInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				// case 'อินทรประกันภัย':
				// 	{
				// 		const API = policyController()
				// 		const res = await API.intraInsure(insureParams)
				// 		if (isValidResponse(res)) {
				// 			console.log(res)
				// 			const pdf = res.result.urlprint
				// 			if (pdf) {
				// 				uploadPdfToSpace(
				// 					pdf,
				// 					insureParams.quo_num,
				// 					undefined,
				// 					customerData.companyInsurance,
				// 					'pdf',
				// 					newAmountInc
				// 				)
				// 				await calCredit(quoNum, newAmountInc, tabKey)
				// 			} else {
				// 				Modal.error({
				// 					title: 'ไม่สามารถพิมพ์ได้',
				// 					content: res.message,
				// 				})
				// 				dispatch(loadingAction(false))
				// 			}
				// 		} else {
				// 			Modal.error({
				// 				title: 'ไม่สามารถพิมพ์ได้',
				// 				content: 'กรุณาติดต่อผู้พัฒนา',
				// 			})
				// 			dispatch(loadingAction(false))
				// 		}
				// 	}
				// 	break
				case 'ไทยศรีประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.thaisriInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: 'ไม่สามารถพิมพ์ได้',
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'ทิพยประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.dhipayaInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: 'ไม่สามารถพิมพ์ได้',
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'แอกซ่าประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.axaInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: 'ไม่สามารถพิมพ์ได้',
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'วิริยะประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.viriyaInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'เคดับบลิวไอประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.kwiInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: 'ไม่สามารถพิมพ์ได้',
									content: res.result.data.message,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				case 'เมืองไทยประกันภัย':
					{
						console.log(insureParams)
						const API = policyController()
						const res = await API.mtiInsure(insureParams)
						if (isValidResponse(res)) {
							console.log(res)
							const pdf = res.result.data.urlprint
							if (pdf) {
								uploadPdfToSpace(
									pdf,
									insureParams.quo_num,
									undefined,
									customerData.companyInsurance,
									'pdf',
									newAmountInc
								)
								await calCredit(quoNum, newAmountInc, tabKey)
							} else {
								Modal.error({
									title: `ไม่สามารถพิมพ์ได้ เลขรายการ ${quoNum}`,
									content: res.result.error,
								})
								dispatch(loadingAction(false))
							}
						} else {
							Modal.error({
								title: 'ไม่สามารถพิมพ์ได้',
								content: 'กรุณาติดต่อผู้พัฒนา',
							})
							dispatch(loadingAction(false))
						}
					}
					break
				default:
					return
			}
		},
		rePrint: async () => {},
	}

	const calCredit = async (quoNum, amount, tabkey) => {
		const params = {
			quo_num: quoNum,
			credit_use:
				checkCustomer(user.cuscode) ||
				customerData.statusPaySucc ||
				customerData?.payCondition === 'installTran'
					? 0
					: amount,
			status_use: 'active',
			type: tabkey === '0' ? 'prb' : 'ins',
		}
		const saveTaskParams = {
			quo_num: quoNum,
			paybill:
				customerData.statusPaySucc ||
				customerData?.payCondition === 'installTran' ||
				user.vif_type === '1'
					? 'จ่ายปกติ'
					: user.vif_type === '2'
					? 'จ่ายวางบิล'
					: null,
			whosend: 'ฟินแจ้ง',
			checksend: 'งานใหม่',
		}
		const couponParams = {
			quo_num: quoNum,
			id_cus: user.cuscode,
		}
		const userAPI = userController()
		const userRes = await userAPI.updateCredit(params)
		const taskAPI = taskController()
		const taskRes = await taskAPI.saveTask(saveTaskParams)
		if (customerData.payCondition !== 'full') {
			const {
				clickbank,
				numpay,
				discom,
				distax,
				amount_pay,
				installment,
				arr_price,
			} = customerData.install
			const paramsInstall = {
				quo_num: quoNum,
				clickbank,
				numpay,
				discom,
				distax,
				amount_pay,
				count: 1,
				date_pay: moment().format('YYYY-MM-DD HH:mm:ss'),
				type_pay: installment,
				arr_price,
			}
			const payAPI = paymentController()
			await payAPI.saveInstallmentVif(paramsInstall)
		}

		if (tabkey === '1' && +customerData.amount_inc > 2000) {
			const baseAPI = baseController()
			await baseAPI.savePoint(couponParams)
		}

		if (isValidResponse(userRes) && isValidResponse(taskRes)) {
			return
		}
	}

	const uploadPdfToSpace = async (
		path,
		quoNum,
		companyCompulsory,
		companyInsurance,
		type,
		newAmountInc
	) => {
		const dataFiles = _.cloneDeep(dataFilesSuccess)
		const API = pdfController()
		const res = await API.uploadFiletoSpace({
			policyLink: path,
			contactNumber: quoNum,
			companyCompulsory,
			companyInsurance,
			payCondition: customerData.payCondition,
		})
		if (isValidResponse(res)) {
			console.log(res)
			const pdf = res.result.data.policyLink1
			// const watermarkPdf = res?.result?.data.policyLink2

			dispatch(loadingAction(false))
			if (companyCompulsory === 'บริษัทกลาง') {
				Modal.success({
					title: 'พิมพ์สำเร็จ',
				})
				window.open(path)
				setFiles('prb', dataFiles)
			} else if (companyCompulsory === 'แอกซ่าประกันภัย' && companyCompulsory) {
				Modal.success({
					title: 'พิมพ์สำเร็จ',
					content:
						type === 'pdf'
							? 'พิมพ์กรมธรรม์สำเร็จ'
							: 'พิมพ์ใบเสร็จสำเร็จ (หากกรมธรรม์ยังไม่แสดงกรุณารอสักครู่)',
					onOk: () => type === 'pdf' && changTapKey(newAmountInc, 'submit'),
				})
				window.open(pdf)
				setFiles('prb', dataFiles)
				changTapKey(newAmountInc)
			} else if (
				!['บริษัทกลาง', 'แอกซ่าประกันภัย'].includes(companyCompulsory) &&
				companyCompulsory
			) {
				Modal.success({
					title: 'พิมพ์สำเร็จ',
					onOk: () =>
						companyCompulsory !== 'ไทยศรีประกันภัย' &&
						changTapKey(newAmountInc, 'submit'),
				})
				window.open(pdf)
				setFiles('prb', dataFiles)
				changTapKey(newAmountInc)
			}
			if (companyInsurance) {
				Modal.success({
					title: 'พิมพ์สำเร็จ',
				})

				// if (customerData.payCondition !== 'full') window.open(watermarkPdf)
				window.open(pdf)
				setFiles('ins', dataFiles, 'submit')
				changTapKey(newAmountInc)
			}
		} else {
			Modal.error({
				title: 'พิมพ์ไม่สำเร็จ',
			})
			dispatch(loadingAction(false))
		}
	}

	return (
		<>
			<DetailLayout
				isPreve={true}
				onClickPrevious={() => redirect(ROUTE_PATH.BILL.LINK)}
			>
				<Label className='title-form'>พิมพ์กรมธรรม์</Label>
				<Tab
					type='card'
					activeKey={tabKey}
					onChange={handleChangeTabKey}
					data={[
						{
							name: 'พ.ร.บ.',
							content: (
								<PreviewPrb data={{ ...customerData }} params={insureParams} />
							),
							disabled:
								Number.parseInt(customerData.prbPrice) > 0 ? false : true,
						},
						{
							name: 'ประกัน',
							content: (
								<PreviewInsure
									data={{ ...customerData }}
									params={insureParams}
								/>
							),
							disabled:
								Number.parseInt(customerData.amount_inc) > 0 ? false : true,
						},
					]}
				/>
			</DetailLayout>
			<Box className='credit-commission'>
				<DetailLayout label='คอมมิชชั่น' style={{ width: '40%' }}>
					{customerData.companyInsurance !== '-' &&
					customerData.com?.show_com_ins !== undefined &&
					premistions.status_permissions !== 'notview' ? (
						premistions.status_permissions === 'saleFin' ? (
							<Box className='bill-price-detail'>
								<Label className='title-info-preview'>
									ส่วนลดการค้า ประกัน
								</Label>
								<Label className='title-info-preview'>
									{convertStrToFormat(
										customerData.com?.show_discount_ins || '0',
										'money_digit'
									)}{' '}
									บาท
								</Label>
							</Box>
						) : customerData.com?.show_com_ins_1 &&
						  customerData.com?.show_com_ins_2 ? (
							<>
								<Box className='bill-price-detail'>
									<Label className='title-info-preview'>
										ส่วนลดการค้า ประกัน
									</Label>
									<Label className='title-info-preview'>
										{convertStrToFormat(
											customerData.com?.show_com_ins_1 || '0',
											'money_digit'
										)}{' '}
										บาท
									</Label>
								</Box>
								<Box className='bill-price-detail'>
									<Label className='title-info-preview'>
										ส่วนลดแคมเปญพิเศษ ประกัน
									</Label>
									<Label className='title-info-preview'>
										{convertStrToFormat(
											customerData.com?.show_com_ins_2 || '0',
											'money_digit'
										)}{' '}
										บาท
									</Label>
								</Box>
							</>
						) : (
							<Box className='bill-price-detail'>
								<Label className='title-info-preview'>
									ส่วนลดการค้า ประกัน
								</Label>
								<Label className='title-info-preview'>
									{convertStrToFormat(
										customerData.com?.show_com_ins_1 || '0',
										'money_digit'
									)}{' '}
									บาท
								</Label>
							</Box>
						)
					) : (
						''
					)}
					{customerData.companyCompulsory !== '-' &&
					customerData.com?.show_com_prb !== undefined &&
					premistions.status_permissions !== 'notview' ? (
						customerData.com?.show_com_prb_1 &&
						customerData.com?.show_com_prb_2 ? (
							<>
								<Box className='bill-price-detail'>
									<Label className='title-info-preview'>ส่วนลดการค้า พรบ</Label>
									<Label className='title-info-preview'>
										{convertStrToFormat(
											customerData.com?.show_com_prb_1 || '0'
										)}{' '}
										บาท
									</Label>
								</Box>
								<Box className='bill-price-detail'>
									<Label className='title-info-preview'>
										ส่วนลดแคมเปญพิเศษ พรบ
									</Label>
									<Label className='title-info-preview'>
										{convertStrToFormat(
											customerData.com?.show_com_prb_2 || '0'
										)}{' '}
										บาท
									</Label>
								</Box>
							</>
						) : (
							<Box className='bill-price-detail'>
								<Label className='title-info-preview'>ส่วนลดการค้า พรบ</Label>
								<Label className='title-info-preview'>
									{convertStrToFormat(customerData.com?.show_com_prb_1 || '0')}{' '}
									บาท
								</Label>
							</Box>
						)
					) : (
						''
					)}
					{user.tax_status === 'yes' && (
						<Box className='bill-price-detail'>
							<Label className='title-info-preview'>หัก ณ ที่จ่าย</Label>
							<Label className='title-info-preview'>
								{convertStrToFormat(
									customerData.com?.distax || 0,
									'money_digit'
								)}{' '}
								บาท
							</Label>
						</Box>
					)}
				</DetailLayout>
				<DetailLayout label='เครดิต' style={{ width: '40%' }}>
					{!checkCustomer(user.cuscode) && (
						<>
							{user.vif_type === '1' ? (
								<Box className='bill-price-detail'>
									<Label className='title-info-preview'>วงเงินคงเหลือ</Label>
									<Label className='title-info-preview'>
										{convertStrToFormat(credit.cur, 'money_digit')} บาท
									</Label>
								</Box>
							) : (
								<>
									<Box className='bill-price-detail'>
										<Label className='title-info-preview'>
											วงเงินเครดิตทั้งหมด
										</Label>
										<Label className='title-info-preview'>
											{convertStrToFormat(credit.all, 'money_digit')} บาท
										</Label>
									</Box>
									<Box className='bill-price-detail'>
										<Label className='title-info-preview'>
											วงเงินเครดิตที่ใช้ไปแล้ว
										</Label>
										<Label className='title-info-preview'>
											{convertStrToFormat(credit.use, 'money_digit')} บาท
										</Label>
									</Box>
									<Box className='bill-price-detail'>
										<Label className='title-info-preview'>
											วงเงินเครดิตคงเหลือ
										</Label>
										<Label className='title-info-preview'>
											{convertStrToFormat(
												Number(credit.cur).toFixed(2),
												'money_digit'
											)}{' '}
											บาท
										</Label>
									</Box>
								</>
							)}
						</>
					)}
					{customerData?.statusPaySucc ||
					customerData?.payCondition === 'installTran' ? null : (
						<>
							<Box className='bill-price-detail'>
								<Label className='title-info-preview'>
									เบี้ยเต็มที่ใช้รอบนี้
								</Label>
								<Label className='title-info-preview'>
									{convertStrToFormat(
										Number(
											Number(
												tabKey === '0'
													? customerData?.prbPrice
													: customerData.insurePrice
											)
										).toFixed(2),
										'money_digit'
									)}{' '}
									บาท
								</Label>
							</Box>
							<Box className='bill-price-detail'>
								<Label className='title-info-preview'>
									{user.vif_type === '1'
										? 'วงเงินจริงที่ใช้รอบนี้'
										: 'วงเงินเครดิตจริงที่ใช้รอบนี้'}
								</Label>
								<Label className='title-info-preview'>
									{convertStrToFormat(
										Number(
											tabKey === '0'
												? user.vif_type === '1'
													? customerData?.prbPrice -
													  customerData.com?.show_com_prb
													: customerData?.prbPrice
												: user.vif_type === '1'
												? customerData.insurePrice -
												  customerData.com?.show_com_ins
												: customerData.insurePrice
										).toFixed(2),
										'money_digit'
									)}{' '}
									บาท
								</Label>
							</Box>
						</>
					)}
					<Box className='accept-group-btn-wrapper'>
						<Button
							className='accept-btn'
							width='250'
							disabled={
								(tabKey === '0' &&
									!(customerData.com?.show_com_prb !== undefined)) ||
								(tabKey === '1' &&
									!(customerData.com?.show_com_ins !== undefined))
							}
							onClick={handleClickSubmit.checkPrint}
						>
							บันทึกและพิมพ์{' '}
							{tabKey === '0' ? 'พ.ร.บ.' : tabKey === '1' ? 'ประกัน' : ''}
						</Button>
						<Button
							className='select-btn'
							width='100'
							onClick={handleClickSubmit.rePrint}
							disabled
						>
							พิมพ์ซ้ำ
						</Button>
					</Box>
				</DetailLayout>
			</Box>
		</>
	)
}

const PreviewPrb = (props) => {
	const form = [
		{
			section: {
				title: 'ข้อมูลประกันภัย',
				row: [
					{
						items: [
							{
								label: 'บริษัทประกัน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.companyCompulsory,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'ประเภท พ.ร.บ.',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.compulsoryType,
								classLabel: 'title-info-preview',
								col: 8,
							},
						],
					},
					{
						items: [
							{
								label: 'วันเริ่มคุ้มครอง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: moment(props.data.protectedDate).format('DD/MM/YYYY'),
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'วันสิ้นสุดการคุ้มครอง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: moment(props.data.lastProtectedDate).format(
									'DD/MM/YYYY'
								),
								classLabel: 'title-info-preview',
								col: 3,
							},
							{
								label: `รวม ${moment(props.data.lastProtectedDate).diff(
									moment(props.data.protectedDate),
									'days'
								)} วัน`,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลรถยนต์',
				row: [
					{
						items: [
							{
								label: 'ยี่ห้อรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)' ||
									props.data.companyCompulsory === 'ไทยศรีประกันภัย' ||
									props.data.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)' ||
									props.data.companyCompulsory === 'ทิพยประกันภัย' ||
									props.data.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย'
										? props.data.brandTitle?.text
										: props.data.brand,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'ปีรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.year,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ปีที่จดทะเบียนรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.registerYear,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'รุ่นรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)' ||
									props.data.companyCompulsory === 'ไทยศรีประกันภัย' ||
									props.data.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)' ||
									props.data.companyCompulsory === 'ทิพยประกันภัย' ||
									props.data.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย'
										? props.data.seriesTitle?.text
										: props.data.series,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'รุ่นย่อยรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.subSeries ? props.data.subSeries : '-',
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เลขทะเบียน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.vehicleRegistrationNumber,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'จังหวัดป้ายทะเบียน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.vehicleRegistrationArea,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'ประเภทรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.carType,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ชนิดรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.bodyType,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'จำนวนที่นั่ง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.seat,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'เครื่องยนต์ (CC)',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.engineCC,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'น้ำหนักรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.carWeight,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'เลขตัวถัง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.chassisSerialNumber,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เลขเครื่องยนต์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.engineNo,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'สีรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.colorCar,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลลูกค้า',
				row: [
					{
						items: [
							{
								label: 'นิติบุคล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.legal === 'บุคคลทั่วไป' ? 'ไม่ใช่' : 'ใช่',
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: `${
									props.data.legal === 'บุคคลทั่วไป'
										? 'ชื่อ-นามสกุล'
										: 'ชื่อบริษัท'
								}`,
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: `${props.data.select?.title} ${
									props.data.input?.name || ''
								} ${props.data.input?.lastname || ''}`,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'วันเกิด',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: props.data.select?.birthDay
									? `${props.data.select?.birthDay}/${
											props.data.select?.birthMonth
									  }/${Number(props.data.select?.birthYear) + 543}`
									: '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: `${
									props.data.legal === 'บุคคลทั่วไป'
										? 'เลขบัตรประชาชน'
										: 'เลขที่ผู้เสียภาษี'
								}`,
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(props.data.input?.idCard, 'id_card'),
								classLabel: 'title-info-preview',
								col: 6,
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
								label: convertStrToFormat(
									props.data.input?.tel,
									'phone_number'
								),
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เพศ',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: props.data.select?.gender === 'M' ? 'ชาย' : 'หญิง',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
						],
					},
					{
						items: [
							{
								label: 'เชื้อชาติ',
								classLabel: 'title-preview',
								col: 4,
								hideCol: !props.data.isPassport,
							},
							{
								label: props.data.countryTitle?.text,
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: !props.data.isPassport,
							},
							{
								label: 'สัญชาติ',
								classLabel: 'title-preview',
								col: 4,
								hideCol: !props.data.isPassport,
							},
							{
								label: props.data.nationalTitle?.text,
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: !props.data.isPassport,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ที่อยู่หน้ากรมธรรม์',
				row: [
					{
						items: [
							{
								label: 'ที่อยู่',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.addressInsurance,
								classLabel: 'title-info-preview',
								col: 10,
							},
						],
					},
					{
						items: [
							{
								label: 'ถนน',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.companyCompulsory !== 'วิริยะประกันภัย',
							},
							{
								label: props.data.input?.roadInsurance || '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.companyCompulsory !== 'วิริยะประกันภัย',
							},
							{
								label: 'ซอย',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.companyCompulsory !== 'วิริยะประกันภัย',
							},
							{
								label: props.data.input?.soiInsurance || '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.companyCompulsory !== 'วิริยะประกันภัย',
							},
						],
					},
					{
						items: [
							{
								label: 'เขต/อำเภอ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.amphoeInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'แขวง/ตำบล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.districtInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'จังหวัด',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.provinceInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'รหัสไปรษณีย์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.zipcodeInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
	]

	return (
		<>
			{form.map((e, i) => {
				const { section } = e
				return (
					<Box key={i}>
						<Label className='title-second-form-preview'>{section.title}</Label>
						{section.row.map((el, il) => {
							return (
								<Row gutter={16} key={il}>
									{el.items.map((el1, il1) => {
										return (
											!el1.hideCol && (
												<Col xs={el1.col} key={il1}>
													<Label className={el1.classLabel}>{el1.label}</Label>
												</Col>
											)
										)
									})}
								</Row>
							)
						})}
					</Box>
				)
			})}
		</>
	)
}

const PreviewInsure = (props) => {
	const form = [
		{
			section: {
				title: 'ข้อมูลประกันภัย',
				row: [
					{
						items: [
							{
								label: 'บริษัทประกัน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.companyInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'วันเริ่มคุ้มครอง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: moment(props.data.protectedDate)
									.add(543, 'years')
									.format('DD/MM/YYYY'),
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'วันสิ้นสุดการคุ้มครอง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: moment(props.data.lastProtectedDate)
									.add(543, 'years')
									.format('DD/MM/YYYY'),
								classLabel: 'title-info-preview',
								col: 3,
							},
							{
								label: `รวม ${moment(props.data.lastProtectedDate).diff(
									moment(props.data.protectedDate),
									'days'
								)} วัน`,
								classLabel: 'title-info-preview',
								col: 3,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลรถยนต์',
				row: [
					{
						items: [
							{
								label: 'ยี่ห้อรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)' ||
									props.data.companyCompulsory === 'ไทยศรีประกันภัย' ||
									props.data.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)' ||
									props.data.companyCompulsory === 'ทิพยประกันภัย' ||
									props.data.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย' ||
									props.data.companyInsurance === 'ไทยศรีประกันภัย'
										? props.data.brandTitle?.text
										: props.data.brand,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'ปีรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.year,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ปีที่จดทะเบียนรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.registerYear,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'รุ่นรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.companyCompulsory === 'เจมาร์ทประกันภัย (เจพี)' ||
									props.data.companyCompulsory === 'ไทยศรีประกันภัย' ||
									props.data.companyCompulsory === 'อินทรประกันภัย(สาขาสีลม)' ||
									props.data.companyCompulsory === 'ทิพยประกันภัย' ||
									props.data.companyCompulsory === 'ไทยเศรษฐกิจประกันภัย' ||
									props.data.companyInsurance === 'ไทยศรีประกันภัย'
										? props.data.seriesTitle?.text
										: props.data.series,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'รุ่นย่อยรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.subSeries ? props.data.subSeries : '-',
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เลขทะเบียน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data?.input?.vehicleRegistrationNumber,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'จังหวัดป้ายทะเบียน',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.vehicleRegistrationArea,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'ประเภทรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.carType,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ชนิดรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.bodyType,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'จำนวนที่นั่ง',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.seat,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'เครื่องยนต์ (CC)',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.engineCC,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'น้ำหนักรถ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.carWeight,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'รหัสรถยนต์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.carCodeTitle,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ข้อมูลลูกค้า',
				row: [
					{
						items: [
							{
								label: 'นิติบุคล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.legal === 'บุคคลทั่วไป' ? 'ไม่ใช่' : 'ใช่',
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: `${
									props.data.legal === 'บุคคลทั่วไป'
										? 'ชื่อ-นามสกุล'
										: 'ชื่อบริษัท'
								}`,
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: `${props.data.select?.title} ${
									props.data.input?.name || ''
								} ${props.data.input?.lastname || ''}`,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'วันเกิด',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: props.data.select?.birthDay
									? `${props.data.select?.birthDay}/${
											props.data.select?.birthMonth
									  }/${Number(props.data.select?.birthYear) + 543}`
									: '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: `${
									props.data.legal === 'บุคคลทั่วไป'
										? 'เลขบัตรประชาชน'
										: 'เลขที่ผู้เสียภาษี'
								}`,
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(props.data.input?.idCard, 'id_card'),
								classLabel: 'title-info-preview',
								col: 6,
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
								label: convertStrToFormat(
									props.data.input?.tel,
									'phone_number'
								),
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เพศ',
								classLabel: 'title-preview',
								col: 4,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
							{
								label: props.data.select?.gender === 'M' ? 'ชาย' : 'หญิง',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol: props.data.legal !== 'บุคคลทั่วไป',
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ที่อยู่หน้ากรมธรรม์',
				row: [
					{
						items: [
							{
								label: 'ที่อยู่',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.input?.addressInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ถนน',
								classLabel: 'title-preview',
								col: 4,
								hideCol:
									props.data.companyCompulsory === 'วิริยะประกันภัย' ||
									props.data.companyCompulsory === 'แอกซ่าประกันภัย'
										? false
										: true,
							},
							{
								label: props.data.input?.roadInsurance || '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol:
									props.data.companyCompulsory === 'วิริยะประกันภัย' ||
									props.data.companyCompulsory === 'แอกซ่าประกันภัย'
										? false
										: true,
							},
							{
								label: 'ซอย',
								classLabel: 'title-preview',
								col: 4,
								hideCol:
									props.data.companyCompulsory === 'วิริยะประกันภัย' ||
									props.data.companyCompulsory === 'แอกซ่าประกันภัย'
										? false
										: true,
							},
							{
								label: props.data.input?.soiInsurance || '-',
								classLabel: 'title-info-preview',
								col: 6,
								hideCol:
									props.data.companyCompulsory === 'วิริยะประกันภัย' ||
									props.data.companyCompulsory === 'แอกซ่าประกันภัย'
										? false
										: true,
							},
						],
					},
					{
						items: [
							{
								label: 'เขต/อำเภอ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.amphoeInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'แขวง/ตำบล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.districtInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'จังหวัด',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.provinceInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'รหัสไปรษณีย์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.select?.zipcodeInsurance,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
		{
			section: {
				title: 'ที่อยู่จัดส่ง',
				row: [
					{
						items: [
							{
								label: 'ชื่อผู้รับ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.addressDeliveryRadio === 'addressSameInsurance'
										? props.data.select?.title &&
										  props.data.input?.name &&
										  props.data.input?.lastname
											? `${props.data.select?.title} ${props.data.input?.name} ${props.data.input?.lastname}`
											: `${props.data.select?.title} ${props.data.input?.name}`
										: props.data.receiver,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'เบอร์โทรศัพท์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: convertStrToFormat(
									props.data.telDelivery,
									'phone_number'
								),
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'ที่อยู่',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label:
									props.data.addressDeliveryRadio === 'addressSameInsurance'
										? props.data.select?.companyCompulsory ===
												'วิริยะประกันภัย' ||
										  props.data.select?.companyCompulsory === 'แอกซ่าประกันภัย'
											? `${props.data.input?.addressInsurance} ${
													props.data.input?.roadInsurance || ''
											  } ${props.data.input?.soiInsurance || ''}`
											: props.data.input?.addressInsurance
										: props.data.addressDelivery,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'เขต/อำเภอ',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.amphoeDelivery,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'แขวง/ตำบล',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.districtDelivery,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
					{
						items: [
							{
								label: 'จังหวัด',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.provinceDelivery,
								classLabel: 'title-info-preview',
								col: 6,
							},
							{
								label: 'รหัสไปรษณีย์',
								classLabel: 'title-preview',
								col: 4,
							},
							{
								label: props.data.zipcodeDelivery,
								classLabel: 'title-info-preview',
								col: 6,
							},
						],
					},
				],
			},
		},
	]
	return (
		<>
			{form.map((e, i) => {
				const { section } = e
				return (
					<Box key={i}>
						<Label className='title-second-form-preview'>{section.title}</Label>
						{section.row.map((el, il) => {
							return (
								<Row gutter={16} key={il}>
									{el.items.map((el1, il1) => {
										return (
											!el1.hideCol && (
												<Col xs={el1.col} key={il1}>
													<Label className={el1.classLabel}>{el1.label}</Label>
												</Col>
											)
										)
									})}
								</Row>
							)
						})}
					</Box>
				)
			})}
		</>
	)
}
export default Preview
