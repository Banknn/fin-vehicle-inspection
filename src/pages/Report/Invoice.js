import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { invoiceController, systemController } from '../../apiServices'
import { Box, Button, Container, Select, Label, Table } from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	storeCreditPay,
	storeInvoice,
} from '../../helpers'
import { loadingAction } from '../../actions'
import { TableComponent } from '../../components/Table/styled'
import { Col, Row } from 'antd'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const Invoice = () => {
	const dispatch = useDispatch()
	const premistions = useSelector((state) => state.premissionsReducer)
	const [reportData, setReportData] = useState([])
	const [dateRange, setDateRange] = useState({ end: '' })
	const [month, setMonth] = useState('')
	const [year, setYear] = useState('')
	const [daysInMonth, setDaysInMonth] = useState('')
	const [periodDate, setPeriodDate] = useState('3')
	const [type, setType] = useState('all')
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [selectedRow, setSelectedRow] = useState([])
	const [deselectedRow, setDeselectedRow] = useState([])
	const [isExported, setIsExported] = useState(true)
	const [summary, setSummary] = useState({
		amount: 0,
		commission: 0,
		balance: 0,
	})
	const [company, setCompany] = useState()
	const [fieldError, setFieldError] = useState({})
	const [companyInsuranceList, setCompanyInsuranceList] = useState([])
	const [companyList, setCompanyList] = useState([])

	const fetchData = useCallback(
		async (endDate, typeF, companyF) => {
			dispatch(loadingAction(true))
			const dateNow = new Date()
			const dayOfMonth = moment(dateNow).daysInMonth()
			const currMonth = moment(endDate || dateNow).format('MM')
			const currYear = moment(endDate || dateNow).format('YYYY')
			const endDateOfMonth = moment(
				`${currYear}-${currMonth}-${dayOfMonth} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')

			const API = systemController()
			const res = await API.getInvoiceVif()
			if (isValidResponse(res)) {
				const dataList = res.result
				const dataFilter = dataList.filter((e) => {
					if (typeF === 'insure' && companyF === 'all_ins') {
						return +e.amount_inc > 0
					} else if (typeF === 'insure' && companyF !== 'all_ins') {
						return +e.amount_inc > 0 && e.company === companyF
					} else if (typeF === 'prb' && companyF === 'all_prb') {
						return +e.priceprb > 0
					} else if (typeF === 'prb' && companyF !== 'all_prb') {
						return +e.priceprb > 0 && e.company_prb === companyF
					} else {
						return +e.amount_inc + +e.priceprb > 0
					}
				})
				const dataFilterDate = dataFilter.filter((e) => {
					if (endDate) return e.datestart <= endDate
					return e.datestart <= endDateOfMonth
				})
				const data = dataFilterDate.map((e, i) => {
					const amount = +e.amount_inc + +e.priceprb
					const commission =
						premistions.status_permissions === 'saleFin'
							? e.show_discount_ins
							: +e.show_com_ins + +e.show_com_prb
					const balance = +amount - +commission
					return {
						key: i,
						no: i + 1,
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
						show_com_ins:
							premistions.status_permissions === 'saleFin'
								? e.show_discount_ins
								: e.show_com_ins,
						show_com_prb: e.show_com_prb,
						prb: e.prb,
						id_key: e.id_key,
					}
				})
				const amount = data.reduce(
					(acc, curr) =>
						acc + (Number(curr.amount_inc) + Number(curr.priceprb)),
					0
				)
				const commission = data.reduce(
					(acc, curr) =>
						premistions.status_permissions === 'saleFin'
							? acc + Number(curr.show_com_ins)
							: acc + (Number(curr.show_com_ins) + Number(curr.show_com_prb)),
					0
				)
				const balance = amount - commission
				setSummary({ amount, commission, balance })
				setReportData(data)
				setDateRange({ endDate: endDate || endDateOfMonth })
				setDaysInMonth(dayOfMonth)
				setMonth(currMonth)
				setYear(currYear)
				setPeriodDate((value) => value)
				setType((value) => value)
				dispatch(loadingAction(false))
				setSelectedRowKeys(data.map((e) => e.key))
				setSelectedRow(data)
				await storeInvoice(data)
			}
		},
		[dispatch, premistions.status_permissions]
	)

	useEffect(() => {
		const dateNow = new Date()
		const currentDay = moment(dateNow).format('DD')
		const currentMonth = moment(dateNow).format('MM')
		const currentYear = moment(dateNow).format('YYYY')

		const curentDaylastMonth = moment(dateNow)
			.subtract(0, 'months')
			.endOf('month')
			.format('DD')
		const dateNowDF = moment(dateNow).format('YYYY-MM-DD HH:mm:ss')
		const date1st = moment(`${currentYear}-${currentMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const date15st = moment(
			`${currentYear}-${currentMonth}-15 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		const date16st = moment(
			`${currentYear}-${currentMonth}-16 00:00:00`
		).format('YYYY-MM-DD HH:mm:ss')
		const datelast = moment(
			`${currentYear}-${currentMonth}-${curentDaylastMonth} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')

		let endDate
		if (moment(dateNowDF).isBetween(date1st, date15st)) {
			endDate = date15st
			setPeriodDate('1')
		} else if (moment(dateNowDF).isBetween(date16st, datelast)) {
			endDate = moment(
				`${currentYear}-${currentMonth}-${currentDay} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')
			setPeriodDate('2')
		}
		Promise.all([LIST.COMPANY_INSURE_BRAND(), LIST.COMPANY_PRB_BRAND()]).then(
			(e) => {
				setCompanyInsuranceList(e[0])
				setCompanyList(e[1])
			}
		)

		fetchData(endDate, type, company)
	}, [fetchData])

	const handleFilter = async () => {
		if (validateFields()) {
			dispatch(loadingAction(true))
			const dayOfMonth = moment(`${year}-${month}`).daysInMonth()
			setDeselectedRow([])
			setIsExported(true)
			let endDate
			if (periodDate === '1') {
				endDate = moment(`${year}-${month}-15 23:59:59`).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (periodDate === '2') {
				endDate = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (periodDate === '3') {
				endDate = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			setDateRange({ endDate })
			await fetchData(endDate, type, company)
			dispatch(loadingAction(false))
		}
	}

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if ((type === 'prb' && !company) || (type === 'insure' && !company)) {
			formIsValid = false
			errors['company'] = 'กรุณาเลือกบริษัทประกัน'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleClickExport = async () => {
		dispatch(loadingAction(true))
		const params = {
			end_date: dateRange.endDate,
			type,
			periodDate,
			selectedRow: selectedRow.map((e) => e.quo_num),
		}
		const API = invoiceController()
		const res = await API.genInvoiceVif(params)
		if (isValidResponse(res)) {
			const pdf = res.result.url
			window.open(pdf, '__blank')
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
		setDeselectedRow(reportData.filter((e) => !selectedRows.includes(e)))
		setIsExported(true)
		await storeInvoice(selectedRows)
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	}

	const handleClickClearCredit = async () => {
		const amount = selectedRow.reduce(
			(acc, curr) => acc + +curr.amount_inc + +curr.priceprb,
			0
		)
		const commission = selectedRow.reduce(
			(acc, curr) =>
				premistions.status_permissions === 'saleFin'
					? acc + +curr.show_com_ins
					: acc + +curr.show_com_ins + +curr.show_com_prb,
			0
		)
		const balance = amount - commission
		const params = {
			quoNumList: selectedRow.map((e) => e.quo_num),
			deselectedList: deselectedRow.map((e) => e.quo_num),
		}
		const API = invoiceController()
		const res = await API.updatePreparePaymentVif(params)
		if (isValidResponse(res)) {
			await storeCreditPay({
				credit: Number(amount).toFixed(2),
				commission: Number(commission).toFixed(2),
				balance: Number(balance).toFixed(2),
				dateRange,
			})
		}
		redirect(`${ROUTE_PATH.CREDIT.LINK}/clear/${periodDate}`)
	}

	const summaryRow = (pageData) => {
		const amount = pageData.reduce(
			(acc, curr) => acc + +curr.amount_inc + +curr.priceprb,
			0
		)
		const commission = pageData.reduce(
			(acc, curr) =>
				premistions.status_permissions === 'saleFin'
					? acc + +curr.show_com_ins
					: acc + +curr.show_com_ins + +curr.show_com_prb,
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
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.amount.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.commission.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.balance.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ใบแจ้งหนี้ / ใบวางบิล</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box className='filter-box'>
								<Box className='filter-input' width='200'>
									<Label>เดือน</Label>
									<Select
										name='month'
										value={month}
										placeholder='เลือกเดือน'
										options={LIST.MONTH}
										onChange={(value) => setMonth(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
									<Label>ปี</Label>
									<Select
										name='year'
										value={`${year} / ${Number(year) + 543}`}
										placeholder='เลือกปี'
										options={LIST.YEAR()}
										onChange={(value) => setYear(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
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
										onChange={(value) => setPeriodDate(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
									<Button className='select-btn' onClick={handleFilter}>
										<SearchOutlined style={{ marginRight: '5px' }} />
										ค้นหา
									</Button>
								</Box>
							</Box>
							<Box>
								<Row>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>ประเภท</Label>
											<Select
												name='type'
												placeholder='ประเภท'
												value={type}
												options={[
													{ key: '1', value: 'insure', text: 'ประกันรถ' },
													{ key: '2', value: 'prb', text: 'พ.ร.บ.' },
													{ key: '3', value: 'all', text: 'ทั้งหมด' },
												]}
												onChange={(value) => {
													setCompany()
													setType(value)
												}}
												notvalue
											/>
										</Box>
									</Col>
									<Col>
										{type === 'prb' && (
											<Box className='filter-input' width='200'>
												<Label>บริษัทประกัน</Label>
												<Select
													name='company'
													value={company}
													placeholder='บริษัทประกัน'
													options={[
														{
															key: 15,
															value: 'all_prb',
															text: 'ทั้งหมด',
														},
														...companyList,
													]}
													notvalue
													onChange={(value) => setCompany(value)}
													error={fieldError.errors?.company}
												/>
											</Box>
										)}
										{type === 'insure' && (
											<Box className='filter-input' width='200'>
												<Label>บริษัทประกัน</Label>
												<Select
													name='company'
													value={company}
													placeholder='บริษัทประกัน'
													options={[
														{
															key: 3,
															value: 'all_ins',
															text: 'ทั้งหมด',
														},
														...companyInsuranceList,
													]}
													notvalue
													onChange={(value) => setCompany(value)}
													error={fieldError.errors?.company}
												/>
											</Box>
										)}
									</Col>
								</Row>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={reportData}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(reportData, summary)}
							<Button
								className='select-btn'
								width='150'
								onClick={handleClickExport}
								disabled={selectedRowKeys.length === 0}
							>
								PDF
							</Button>
							<Button
								className='accept-btn'
								width='150'
								onClick={handleClickClearCredit}
								disabled={isExported}
							>
								ชำระเครดิต
							</Button>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default Invoice

const ExportExcel = (dataList, summary) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('ใบวางบิล')

		let columns = []
		for (let i = 0; i <= 11; i++) {
			if (i === 0) {
				columns.push({ width: 10 })
			} else if (i === 3) {
				columns.push({ width: 30 })
			} else {
				columns.push({ width: 20 })
			}
		}

		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}

		worksheet.getCell('A1').value = 'ใบแจ้งหนี้ / ใบวางบิล'
		worksheet.getCell('A1').font = { size: 20 }

		const header = [
			'ลำดับ',
			'เลขที่รายการ',
			'วันที่แจ้งงาน',
			'ชื่อลูกค้า',
			'ทะเบียน',
			'บริษัทประกัน',
			'บริษัทพรบ',
			'ประเภทประกัน',
			'ประเภทพรบ',
			'ยอดเบี้ยรวม',
			'ส่วนลด',
			'ยอดชำระ',
			'รหัสคีย์งาน',
		]

		let newDataList1 = dataList.map((e) => [
			e.no,
			e.quo_num,
			e.datestart,
			e.name,
			e.idcar,
			e.company,
			e.company_prb,
			e.insureType,
			e.company_prb !== null ? 'พ.ร.บ.' : '',
			convertStrToFormat(e.amount || '0', 'money_digit'),
			convertStrToFormat(e.commission || '0', 'money_digit'),
			convertStrToFormat(e.balance || '0', 'money_digit'),
			e.id_key,
		])

		let dataCell = []

		dataCell.push(header, ...newDataList1, [
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'รวม',
			convertStrToFormat(summary.amount.toFixed(2) || '0', 'money_digit'),
			convertStrToFormat(summary.commission.toFixed(2) || '0', 'money_digit'),
			convertStrToFormat(summary.balance.toFixed(2) || '0', 'money_digit'),
			'',
		])
		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))
		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `ใบวางบิล`
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
			Excel
		</Button>
	)
}
