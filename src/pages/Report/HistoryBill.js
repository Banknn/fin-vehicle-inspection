import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Table, Modal } from 'antd'
import {
	Box,
	Label,
	Button,
	Input,
	Table as TableCustom,
	DatePicker,
	Modal as ModalCustom,
	Icons,
	Select,
	Container,
	Radio,
	Span,
} from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	redirect,
	ROUTE_PATH,
} from '../../helpers'
import { loadingAction, customerAction } from '../../actions'
import {
	reportController,
	systemController,
	receiptController,
	productController,
} from '../../apiServices'
import { THEME } from '../../themes'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const HistoryBill = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.profileReducer)
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState()
	const [status, setStatus] = useState()
	const [chanelPayment, setChanelPayment] = useState('เงินสด')
	const [cost, setCost] = useState()
	const [numCredit, setNumCredit] = useState()
	const [dataList, setDataList] = useState([])
	const [dataListFile, setDataListFile] = useState([])
	const [listNum, setListNum] = useState({})
	const [choiceInput, setChoiceInput] = useState('confirm')
	const [reason, setReason] = useState('')
	const [adminCost, setAdminCost] = useState('')
	const [fieldError, setFieldError] = useState({})

	const modal = useRef(null)
	const modalFile = useRef(null)

	const fetchData = useCallback(
		async (start, end, status) => {
			dispatch(loadingAction(true))

			const API = reportController()
			const res = await API.getDetailBillHistory({ start, end })
			if (isValidResponse(res)) {
				let { result } = res

				result = result
					.filter((e) => e.status !== 'cancel')
					.filter((e) => {
						if (status === 'success') return e.status === 'success'
						if (status === 'wait') return e.status === 'wait'
						return e
					})

				result = result.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						...e,
					}
				})
				setDataList(result)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currDay = moment().format('DD')
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const start = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${currYear}-${currMonth}-${currDay} 23:59:59`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		setStartDate(start)
		setEndDate(end)
		fetchData(start, end)
	}, [fetchData])

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const start = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${endSelected} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
		await fetchData(start, end, status)
	}

	const columns = [
		{
			title: 'ทำรายการ',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			width: 250,
			render: (value, row) => {
				return (
					<Box>
						{row.status === 'success' ? (
							''
						) : user.cuscode === row.id_key || user.cuscode === row.id_cus ? (
							<Button
								className='select-btn'
								onClick={() => {
									setListNum({ quo_num: row.quo_num, bill_num: row.bill_num })
									setChanelPayment(row.chanel)
									setCost(row.cost)
									setAdminCost()
									modal.current.open()
								}}
							>
								ทำรายการ
							</Button>
						) : null}
					</Box>
				)
			},
		},
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'เลขบิล',
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
			width: 250,
			render: (value, row) => {
				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={async () => {
							const API = reportController()
							const res = await API.getDetailFileHistory(row.bill_num)
							if (isValidResponse(res)) {
								let { result } = res

								result = result.map((e, i) => {
									return {
										key: i,
										no: i + 1,
										...e,
									}
								})
								setDataListFile(result)
								modalFile.current.open()
							}
						}}
					>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'ทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 150,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value === 'success' ? 'สำเร็จ' : 'รอการยืนยัน'}</Label>
			},
		},
		{
			title: 'ช่องทางการชำระ',
			dataIndex: 'chanel',
			key: 'chanel',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Box>
						{value === 'บัตรเครดิต' ? (
							<Label>
								{value} ({row.num_credit})
							</Label>
						) : (
							<Label>{value}</Label>
						)}
					</Box>
				)
			},
		},
		{
			title: 'เลขรายการกรมธรรม์',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
			width: 250,
			render: (value, row) => {
				const textTooltip = (
					<>
						<span>
							สถานะรายการ{' '}
							{row.status_insure === 'success' ? 'ออกสำเร็จ' : 'ออกไม่สำเร็จ'}
						</span>
						<br />
						<span>
							สถานะพรบ{' '}
							{row.status_prb === 'cancel' ? 'ยกเลิกแล้ว' : 'รอการยืนยัน'}
						</span>
						<br />
						<span>
							สถานะประกัน{' '}
							{row.status_ins === 'cancel' ? 'ยกเลิกแล้ว' : 'รอการยืนยัน'}
						</span>
					</>
				)
				return value ? (
					<Label color='blue' cursor='pointer'>
						<Tooltip placement='topLeft' title={textTooltip}>
							<span>{value}</span>
						</Tooltip>
					</Label>
				) : (
					'-'
				)
			},
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 350,
		},
		{
			title: 'ยี่ห้อ',
			dataIndex: 'brand',
			key: 'brand',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'รุ่น',
			dataIndex: 'series',
			key: 'series',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'ปี',
			dataIndex: 'year',
			key: 'year',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'เบอร์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'จังหวัดป้ายทะเบียน',
			dataIndex: 'carprovince',
			key: 'carprovince',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'ค่าประกัน',
			dataIndex: 'show_price_ins',
			key: 'show_price_ins',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าพรบ',
			dataIndex: 'show_price_prb',
			key: 'show_price_prb',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าภาษี',
			dataIndex: 'price_tax',
			key: 'price_tax',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าปรับ',
			dataIndex: 'fine',
			key: 'fine',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าตรวจสภาพรถ',
			dataIndex: 'inspection_fee',
			key: 'inspection_fee',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าบริการ',
			dataIndex: 'sevice',
			key: 'sevice',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าโอนรถ',
			dataIndex: 'trans_car',
			key: 'trans_car',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าใช้จ่ายเพิ่มเติม',
			dataIndex: 'cost',
			key: 'cost',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ส่วนลด',
			dataIndex: 'discount',
			key: 'discount',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'รวม',
			dataIndex: 'price_total',
			key: 'price_total',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'แอดมินคีย์รายการ',
			dataIndex: 'id_key',
			key: 'id_key',
			align: 'center',
			width: 200,
		},
	]

	const dataFilter = dataList
		.filter((e) => {
			if (search) {
				return (
					e.bill_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.idcar?.toLowerCase().indexOf(search.toLowerCase()) !== -1
				)
			}
			return e
		})
		.map((e, i) => {
			return {
				...e,
				key: i,
				no: i + 1,
			}
		})

	const validate = {
		confirm: () => {
			let errors = {}
			let formIsValid = true
			if (chanelPayment === 'บัตรเครดิต' && !numCredit) {
				formIsValid = false
				errors['numCredit'] = 'กรุณากรอกเลขบัตรเครดิต'
			}
			if (cost > 0 && !adminCost) {
				formIsValid = false
				errors['adminCost'] = 'กรุณากรอกค่าดำเนินการ'
			}
			setFieldError({ errors })
			return formIsValid
		},
		close: () => {
			let errors = {}
			let formIsValid = true
			if (cost > 0 && !adminCost) {
				formIsValid = false
				errors['adminCost'] = 'กรุณากรอกค่าดำเนินการ'
			}
			if (!reason) {
				formIsValid = false
				errors['reason'] = 'กรุณากรอกหมายเหตุ'
			}
			setFieldError({ errors })
			return formIsValid
		},
	}

	const handleClick = {
		confirm: async () => {
			if (validate.confirm()) {
				const APIREPORT = receiptController()
				const resBill = await APIREPORT.saveActionBillVif({
					bill_num: listNum.bill_num,
					chanel: chanelPayment,
					num_credit: numCredit,
					adminCost,
					type: 'confirm',
				})
				if (isValidResponse(resBill)) {
					Modal.success({
						content: 'บันทึกข้อมูลสำเร็จ',
					})
					modal.current.close()
					handleFilter()
				}
			}
		},
		edit: async () => {
			const data = dataList.find((e) => e.bill_num === listNum.bill_num)
			const {
				car_type,
				vehicle_type,
				cc_car,
				weight_car,
				registerYear,
				show_price_prb,
				show_price_ins,
				fine,
				discount,
				title,
				name,
				lastname,
				idcard,
				tel,
				idcar,
				address,
				amphoe,
				district,
				province,
				zipcode,
				price_tax,
				inspection_fee,
				sevice,
				receipt_num,
				tax_bill_num,
			} = data
			const updatedCustomer = {
				input: {
					engineCC: cc_car,
					carWeight: weight_car,
					compulsoryPrice: +show_price_prb,
					insurePrice: +show_price_ins,
					name,
					lastname,
					idCard: idcard,
					tel,
					addressInsurance: address,
					vehicleRegistrationNumber: idcar,
				},
				select: {
					carType: car_type,
					registerYear: registerYear,
					vehicleType: vehicle_type,
					title,
					amphoeInsurance: amphoe,
					districtInsurance: district,
					provinceInsurance: province,
					zipcodeInsurance: zipcode,
				},
				prbPrice: +show_price_prb,
				quoNum: listNum.quo_num,
				bill_num: listNum.bill_num,
				receipt_num,
				tax_bill_num,
				priceTax: price_tax,
				finePrice: fine,
				discounts: discount,
				inspectionFee: inspection_fee,
				sevice: sevice,
				productList: null,
			}
			const API = productController()
			const res = await API.getListProduct(listNum.bill_num)
			if (isValidResponse(res)) {
				let { result } = res
				updatedCustomer.productList = result
			}
			dispatch(customerAction(updatedCustomer))
			redirect(ROUTE_PATH.BILL.LINK)
		},
		close: async () => {
			if (validate.close()) {
				const APIREPORT = receiptController()
				const API = systemController()
				let [res, resBill] = await Promise.all([
					listNum.quo_num &&
						API.cancelInsuranceVif({
							quo_num: listNum.quo_num,
							reason,
						}),
					APIREPORT.saveActionBillVif({
						bill_num: listNum.bill_num,
						type: 'cancel',
						adminCost,
						reason,
					}),
				])

				if (!listNum.quo_num) {
					res = listNum.quo_num
				}

				if (isValidResponse(resBill)) {
					if (resBill?.result?.path_cn_tax)
						window.open(resBill?.result?.path_cn_tax)

					Modal.success({
						content: 'ยกเลิกบิลสำเร็จ',
					})
					modal.current.close()
					handleFilter()
				} else {
					Modal.error({
						content: 'กรุณาติดต่อผู้พัฒนา',
					})
				}
			}
		},
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานเปิดบิล</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Box className='filter-table-box'>
								<Box className='filter-item'>
									<Label className='filter-label'>ตั้งแต่วันที่</Label>
									<DatePicker
										name='dateStart'
										format='DD/MM/YYYY'
										onChange={(e) => setStartDate(e)}
										value={moment(startDate)}
										notvalue
									/>
								</Box>
								<Box className='filter-item'>
									<Label className='filter-label'>ถึงวันที่</Label>
									<DatePicker
										name='dateEnd'
										format='DD/MM/YYYY'
										onChange={(e) => setEndDate(e)}
										value={moment(endDate)}
										notvalue
									/>
								</Box>
								<Box className='filter-item'>
									<Label>สถานะ</Label>
									<Select
										name='status'
										value={status}
										placeholder='สถานะ'
										style={{
											marginTop: '5px',
											width: '150px',
											marginLeft: '10px',
										}}
										options={[
											{
												key: '1',
												value: 'all',
												text: 'ทั้งหมด',
											},
											{
												key: '2',
												value: 'success',
												text: 'สำเร็จ',
											},
											{
												key: '3',
												value: 'wait',
												text: `รอการยืนยัน`,
											},
										]}
										onChange={(value) => setStatus(value)}
										notvalue
									/>
								</Box>
								<Button className='select-btn' onClick={handleFilter}>
									<SearchOutlined style={{ marginRight: '5px' }} />
									ค้นหา
								</Button>
							</Box>
							<Box
								className='filter-table-box'
								style={{ justifyContent: 'space-between' }}
							>
								<Box className='filter-item'>
									<Label style={{ marginRight: '25px' }}>ค้นหา</Label>
									<Input
										name='search'
										placeholder='ค้นหา'
										isNotForm
										onChange={(e) => setSearch(e.target.value)}
									/>
								</Box>
								<Box className='filter-item'>
									{ExportExcel(columns, dataFilter, startDate, endDate)}
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<TableCustom
								columns={columns}
								dataSource={dataFilter}
								className='report-data-table'
								size='middle'
								scroll={{ x: 2800 }}
							/>
						</Box>
					</Box>

					<ModalCustom
						ref={modal}
						headerText='ทำรายการ'
						modalHead='modal-header-red'
						iconsClose={
							<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
						}
					>
						<Box className='history-bill'>
							<Radio.GroupBtn
								className='group-radio'
								lbClassName='input-label'
								value={choiceInput}
								name='choiceInput'
								optionType='button'
								options={[
									{
										label: 'ยืนยันบิล',
										value: 'confirm',
									},
									{
										label: 'ยกเลิกบิล',
										value: 'cancel',
									},
								]}
								onChange={(e) => {
									const value = e.target.value
									setChoiceInput(value)
								}}
							/>
							<br />
							{choiceInput === 'confirm' ? (
								<>
									<Box>
										<Box className='filter-item'>
											<Label>ช่องทางการชำระ</Label>
											<Select
												name='chanelPayment'
												value={chanelPayment}
												placeholder='ช่องทางการชำระ'
												style={{ margin: '0 10px 20px 35px', width: '190px' }}
												disabled
												options={[
													{
														key: '1',
														value: 'เงินสด',
														text: 'เงินสด',
													},
													{
														key: '2',
														value: 'บัตรเครดิต',
														text: 'บัตรเครดิต',
													},
													{
														key: '3',
														value: 'โอนเงิน',
														text: `โอนเงิน`,
													},
													{
														key: '4',
														value: 'สแกนคิวอาร์โค้ด (EDC)',
														text: `สแกนคิวอาร์โค้ด (EDC)`,
													},
												]}
												// onChange={(value) => setChanelPayment(value)}
												notvalue
											/>
										</Box>
										{cost > 0 && (
											<Box>
												<Label>
													ค่าดำเนินการ<Span color='red'>*</Span>
												</Label>
												<Input
													style={{ width: '100%' }}
													name='admin_cost'
													placeholder='กรอกค่าดำเนินการ'
													isNotForm
													value={adminCost}
													onChange={(e) => {
														const { value } = e.target
														setAdminCost(value.replace(/[^0-9.]/gi, ''))
													}}
													error={fieldError.errors?.adminCost}
												/>
											</Box>
										)}
										{chanelPayment === 'บัตรเครดิต' && (
											<Box>
												<Label>
													เลขอ้างอิงบัตรเครดิต<Span color='red'>*</Span>
												</Label>
												<Input
													style={{ width: '100%', marginBottom: '20px' }}
													name='numCredit'
													placeholder='กรอกเลขอ้างอิงบัตรเครดิต'
													isNotForm
													onChange={(e) => setNumCredit(e.target.value)}
													error={fieldError.errors?.numCredit}
												/>
											</Box>
										)}
									</Box>
									<Box
										className='d-flex'
										style={{ justifyContent: 'end', marginRight: '20px' }}
									>
										<Button
											className='success-btn'
											onClick={handleClick.confirm}
										>
											ยืนยันบิล
										</Button>
									</Box>
								</>
							) : (
								<>
									{cost > 0 && (
										<Box>
											<Label>
												ค่าดำเนินการ<Span color='red'>*</Span>
											</Label>
											<Input
												style={{ width: '100%' }}
												name='admin_cost'
												placeholder='กรอกค่าดำเนินการ'
												isNotForm
												value={adminCost}
												onChange={(e) => {
													const { value } = e.target
													setAdminCost(value.replace(/[^0-9.]/gi, ''))
												}}
												error={fieldError.errors?.adminCost}
											/>
										</Box>
									)}
									<Box>
										<Label>
											หมายเหตุยกเลิก <Span color='red'>*</Span>
										</Label>
										<Input
											style={{ width: '100%' }}
											name='reason'
											placeholder='กรอกหมายเหตุยกเลิก'
											isNotForm
											value={reason}
											onChange={(e) => setReason(e.target.value)}
											error={fieldError.errors?.reason}
										/>
									</Box>
									<br />
									<Box className='d-flex' style={{ justifyContent: 'end' }}>
										{/* <Button className='select-btn' onClick={handleClick.edit}>
											แก้ไขบิล
										</Button>{' '}
										|{' '} */}
										<Button className='remove-btn' onClick={handleClick.close}>
											ยกเลิกบิล
										</Button>
									</Box>
								</>
							)}
						</Box>
					</ModalCustom>
					<ModalCustom
						ref={modalFile}
						headerText='ประวัติไฟล์'
						modalHead='modal-header-red'
						iconsClose={
							<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
						}
					>
						<TableHistory dataListFile={dataListFile} />
					</ModalCustom>
				</Box>
			</Container>
		</>
	)
}

export default HistoryBill

const TableHistory = ({ dataListFile }) => {
	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'วันที่ดึงไฟล์',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 150,
		},
		{
			title: 'ประเภทไฟล์',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
			width: 150,
			render: (value, row) => {
				return (
					<Label>
						{row.type_paper === 'taxA4'
							? 'ใบกำกับภาษี'
							: row.type_paper === 'taxReceiptA4'
							? 'ใบเสร็จรับเงิน'
							: 'ใบฝากงาน'}
						{row.type_paper === 'slip'
							? '(แบบสลิป)'
							: row.type_paper === 'a4'
							? '(แบบเต็ม)'
							: row.type_paper === 'double' && '(แบบครึ่ง)'}
					</Label>
				)
			},
		},
		{
			title: 'ไฟล์',
			dataIndex: 'open',
			key: 'open',
			align: 'center',
			width: 100,
			render: (value, row) => {
				return (
					<Button
						className='success-btn'
						onClick={() => window.open(row.path_file)}
					>
						เปิด
					</Button>
				)
			},
		},
	]
	return (
		<Box className='history-bill-file'>
			<Table columns={columns} dataSource={dataListFile} size='middle' />
		</Box>
	)
}

const ExportExcel = (colHead, dataList, startDate, endDate) => {
	const handleClickExport = () => {
		const sDate = moment(startDate).format('DD-MM-YYYY')
		const eDate = moment(endDate).format('DD-MM-YYYY')
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานเปิดบิล')

		const columns = [
			{ width: 10 },
			{ width: 20 },
			{ width: 15 },
			{ width: 15 },
			{ width: 20 },
			{ width: 20 },
			{ width: 30 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}

		worksheet.getCell('A1').value = 'รายงานเปิดบิล'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่างวันที่ ${sDate} ถึง ${eDate}`

		let dataCell = []

		const header = colHead
			.filter((e) => e.key !== 'action')
			.map((e) => {
				return e.title
			})

		const newDataList = dataList.map((e) => {
			const log_bill = JSON.parse(e.log_bill)
			const product =
				log_bill.productList &&
				JSON.parse(log_bill.productList).map((e) => `${e.name} ราคา ${e.price}`)
			const costList =
				log_bill.costList &&
				JSON.parse(log_bill.costList).map((e) => `${e.name} ราคา ${e.price}`)

			return [
				e.no,
				e.bill_num,
				e.idcar,
				e.status === 'success' ? 'สำเร็จ' : 'รอการยืนยัน',
				e.chanel,
				e.quo_num,
				e.nameUser,
				e.brand,
				e.series,
				e.year,
				e.tel,
				e.carprovince,
				e.show_price_ins,
				e.show_price_prb,
				e.price_tax,
				e.fine,
				e.inspection_fee,
				e.sevice,
				e.trans_car,
				e.cost,
				e.discount,
				e.price_total,
				e.id_key,
				e.num_credit,
				product,
				costList,
			]
		})

		dataCell.push(
			[
				...header,
				'เลขอ้างอิงบัตรเครดิต',
				'ค่าบริการต่างๆ',
				'ค่าใช้จ่ายเพิ่มเติม',
			],
			...newDataList
		)

		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานเปิดบิล`
			saveAs(blob, nameFile)
		})
	}

	return (
		<Button
			className='select-btn'
			width='150'
			onClick={handleClickExport}
			disabled={dataList.length === 0}
		>
			Export
		</Button>
	)
}
