import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { UploadOutlined } from '@ant-design/icons'
import { invoiceController, systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Input,
	Label,
	Table,
	Icons,
	Modal as ModalCustom,
	Select,
} from '../../components'
import { convertStrToFormat, isValidResponse, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import { TableComponent } from '../../components/Table/styled'
import { Row, Col, Modal, Upload, Button as ButtonAntd, message } from 'antd'
import { THEME } from '../../themes'

const PayInstallment = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [selectedRow, setSelectedRow] = useState([])
	const [bankList, setBankList] = useState([])
	const [slipImage, setSlipImage] = useState([])
	const [isExported, setIsExported] = useState(true)
	const [cuscode, setCuscode] = useState('')
	const [amounts, setAmounts] = useState('')
	const [invoiceNo, setInvoiceNo] = useState('')
	const [note, setNote] = useState('')
	const [bank, setBank] = useState('')
	const [type, setType] = useState('all')
	const [discount, setDiscount] = useState(0)
	const [fieldError, setFieldError] = useState({})

	const modal = useRef(null)

	const fetchData = async () => {
		dispatch(loadingAction(true))
		const API = systemController()
		const res = await API.getInvoiceByCuscode(cuscode)
		if (isValidResponse(res)) {
			if (res.message === 'ไม่พบผู้ใช้งาน') {
				Modal.success({
					title: res.message,
				})
			}

			const dataList = res.result || []
			const data = []
			let payNum = +amounts + +discount
			dataList.forEach((e, i) => {
				const amount = +e.amount_inc + +e.priceprb
				const commission = +e.show_com_ins + +e.show_com_prb
				const balance = +amount - +commission

				const resData = {
					key: i,
					amount: convertStrToFormat(amount, 'money_digit'),
					company: e.company,
					company_prb: e.company_prb,
					datestart: e.datestart,
					idcar: convertStrToFormat(e.idcar, 'idcar'),
					insureType: e.insureType,
					name: `${e.name} ${e.lastname || ''}`,
					balance: convertStrToFormat(balance, 'money_digit') || '0.00',
					quo_num: e.quo_num,
					commission: convertStrToFormat(commission, 'money_digit') || '0.00',
					amount_inc: e.amount_inc,
					priceprb: e.priceprb,
					show_com_ins: e.show_com_ins,
					show_com_prb: e.show_com_prb,
					prb: e.prb,
				}

				if (type === 'all') {
					data.push(resData)
				} else if (balance <= payNum) {
					payNum -= balance
					data.push(resData)
				}
			})
			setReportData(data)
			dispatch(loadingAction(false))
			setSelectedRowKeys(data.map((e) => e.key))
			setSelectedRow(data)
		}
		Promise.all([LIST.BANKS()]).then((e) => {
			setBankList(e[0])
		})
	}

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!cuscode) {
			formIsValid = false
			errors['cuscode'] = 'กรุณากรอกรหัสตัวแทน'
		}
		if (type === 'installment' && !amounts) {
			formIsValid = false
			errors['amount'] = 'กรุณากรอกจำนวนเงินผ่อน'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleFilter = () => {
		if (validateFields()) {
			setIsExported(true)
			setInvoiceNo('')
			setNote('')
			setBank('')
			setSlipImage([])
			fetchData()
		}
	}

	const handleClickExport = async () => {
		dispatch(loadingAction(true))
		const params = {
			cuscode,
			discount,
			selectedRow: selectedRow.map((e) => e.quo_num),
		}
		const API = invoiceController()
		const res = await API.genInvoiceInstallmentVif(params)
		if (isValidResponse(res)) {
			const { invNo, url } = res.result
			const pdf = url
			window.open(pdf, '__blank')
			setInvoiceNo(invNo)
			setIsExported(false)
			dispatch(loadingAction(false))
		}
	}

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
		},
		{
			title: 'เลขที่รายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
		},
		{
			title: 'วันที่แจ้งงาน',
			dataIndex: 'datestart',
			key: 'datestart',
			align: 'center',
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'ทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.company}</Label>
						<Label>{row.company_prb}</Label>
					</Box>
				)
			},
		},
		{
			title: 'ประเภท',
			dataIndex: 'insureType',
			key: 'insureType',
			align: 'center',
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.insureType}</Label>
						<Label>{row.company_prb !== null ? 'พ.ร.บ.' : ''}</Label>
					</Box>
				)
			},
		},
		{
			title: 'ยอดเบี้ยรวม',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
		},
		{
			title: 'ส่วนลด',
			dataIndex: 'commission',
			key: 'commission',
			align: 'center',
		},
		{
			title: 'ยอดชำระ',
			dataIndex: 'balance',
			key: 'balance',
			align: 'center',
		},
	]

	const onSelectChange = async (selectedRowKeys, selectedRows) => {
		setSelectedRowKeys(selectedRowKeys)
		setSelectedRow(selectedRows)
		setIsExported(true)
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	}

	const handleChangeUpload = ({ file, fileList }) => {
		if (file.status !== 'uploading') {
			setSlipImage(fileList)
		}
	}

	const handleClickImportInvoiceNo = async () => {
		if (slipImage.length > 0 && bank) {
			dispatch(loadingAction(true))
			let formData = new FormData()
			formData.append('cuscode', cuscode)
			formData.append('status_credit', 'wait')
			formData.append('type_credit', 'C')
			formData.append('invoice_no', invoiceNo)
			formData.append('bank', bank)
			formData.append('note', note)
			formData.append('img_credit_vif', slipImage[0].originFileObj)
			dispatch(loadingAction(false))
			const API = systemController()
			const res = await API.saveInvoiceSlipAdminVif(formData)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))
				Modal.success({
					title: 'บันทึกสำเร็จ',
				})
			}
		} else {
			message.error(`กรุณาเลือกธนาคารหรืออัพโหลดสลิปให้ครบถ้วน`)
		}
	}

	const summaryRow = (pageData) => {
		const amount = pageData.reduce(
			(acc, curr) => acc + +curr.amount_inc + +curr.priceprb,
			0
		)
		const commission = pageData.reduce(
			(acc, curr) => acc + +curr.show_com_ins + +curr.show_com_prb,
			0
		)
		const balance = amount - commission
		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amount.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(commission.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(balance.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
				{type === 'installment' && (
					<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell>คงเหลือ</TableComponent.Summary.Cell>
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell />
						<TableComponent.Summary.Cell>
							{convertStrToFormat(
								+amounts + +discount - balance,
								'money_digit'
							)}
						</TableComponent.Summary.Cell>
					</TableComponent.Summary.Row>
				)}
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ใบแจ้งหนี้สำหรับผ่อน</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box className='filter-box'>
								<Row gutter={[8, 8]}>
									<Col xs='6'>
										<Box className='filter-input'>
											<Label>รหัสตรอ.</Label>
											<Input
												name='cuscode'
												placeholder='รหัส ตรอ.'
												notvalue
												onChange={(e) => {
													const { value } = e.currentTarget
													setCuscode(value)
												}}
												error={fieldError.errors?.cuscode}
											/>
										</Box>
									</Col>
									<Col xs='6'>
										<Box className='filter-input' width='200'>
											<Label>เลือกรายการ</Label>
											<Select
												value={type}
												notvalue
												options={[
													{ text: 'ทั้งหมด', value: 'all' },
													{
														text: 'แบบผ่อน (กรอกจำนวนเงิน)',
														value: 'installment',
													},
												]}
												onChange={(e) => {
													setAmounts('')
													setType(e)
												}}
												className='type-select'
											/>
										</Box>
									</Col>
									{type === 'installment' && (
										<Col xs='6'>
											<Box className='filter-input'>
												<Label>วงเงินผ่อน</Label>
												<Input
													name='amount'
													placeholder='วงเงินผ่อน'
													notvalue
													onChange={(e) => {
														const { value } = e.currentTarget
														setAmounts(value)
													}}
													error={fieldError.errors?.amount}
												/>
											</Box>
										</Col>
									)}
									<Col xs='6'>
										<Box className='filter-input'>
											<Label>ส่วนลด</Label>
											<Input
												name='discount'
												placeholder='ส่วนลด'
												notvalue
												value={discount}
												onChange={(e) => {
													const { value } = e.currentTarget
													setDiscount(value)
												}}
												error={fieldError.errors?.discount}
											/>
										</Box>
									</Col>
									<Col xs='6'>
										<Box className='filter-input' style={{ marginTop: '27px' }}>
											<Button className='select-btn' onClick={handleFilter}>
												ดึงรายการ
											</Button>
										</Box>
									</Col>
								</Row>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={reportData.map((e, i) => {
									return { ...e, no: i + 1 }
								})}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							<Button
								className='select-btn'
								width='150'
								onClick={handleClickExport}
								disabled={selectedRowKeys.length === 0}
							>
								Gen ใบแจ้งหนี้
							</Button>
							<Button
								className='accept-btn'
								width='150'
								onClick={() => {
                  setSlipImage([])
									modal.current.open()
								}}
								disabled={isExported}
							>
								แนบใบแจ้งหนี้
							</Button>
						</Box>
						<ModalCustom
							ref={modal}
							okText='ใช่'
							cancelText='ไม่'
							onCallback={handleClickImportInvoiceNo}
							headerText='สลิป'
							modalHead='modal-header-red'
							iconsClose={
								<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
							}
						>
							<Box className='slip-print'>
								<Box>
									<Label style={{ marginBottom: '5px', marginTop: '10px' }}>
										{cuscode}
									</Label>
								</Box>
								<Box>
									<Label style={{ marginBottom: '5px', marginTop: '10px' }}>
										เลขที่ใบแจ้งหนี้
									</Label>
									<Input
										placeholder='เลขที่ใบแจ้งหนี้'
										onChange={(e) => setInvoiceNo(e.target.value)}
										value={invoiceNo}
									/>
								</Box>
								<Box>
									<Select
										placeholder='เลือกบัญชีธนาคาร'
										options={bankList}
										onChange={(e) => setBank(e)}
										className='choose-bank'
									/>
								</Box>
								<Box>
									<Input
										placeholder='หมายเหตุ'
										onChange={(e) => setNote(e.target.value)}
										value={note}
									/>
								</Box>
								<Box style={{ marginTop: '10px' }}>
									<Upload
										beforeUpload={() => false}
										onChange={handleChangeUpload}
										maxCount={1}
									>
										<ButtonAntd icon={<UploadOutlined />}>Upload</ButtonAntd>
									</Upload>
								</Box>
							</Box>
						</ModalCustom>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default PayInstallment
