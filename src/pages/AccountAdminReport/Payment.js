import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined, FileDoneOutlined } from '@ant-design/icons'
import { reportController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Input,
} from '../../components'
import { Tooltip } from 'antd'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { THEME } from '../../themes'

const ReportPayment = () => {
	const dispatch = useDispatch()
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [vifList, setVifList] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(
		async (startDate, endDate) => {
			dispatch(loadingAction(true))
			const dateNow = new Date()
			const currDay = moment(dateNow).format('DD')
			const currMonth = moment(dateNow).format('MM')
			const currYear = moment(dateNow).format('YYYY')
			const startDateDf = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			const endDateDf = moment(
				`${currYear}-${currMonth}-${currDay} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')

			const params = {
				startDate: startDate || startDateDf,
				endDate: endDate || endDateDf,
			}
			const API = reportController()
			const res = await API.getPaymentReportVIF(params)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))

				const { result } = res
				const data = result.map((el, i) => {
					return {
						key: i,
						code: el.cuscode,
						name: el.name,
						noInvoice: [el.paybill_clear_no, el.invoice_path],
						premium: +el.amount,
						com: +el.commission,
						amountBill: +el.balance,
						amountReceived: +el.credit,
						discount: +el.discount || 0,
						date: el.pay_date ? moment(el.pay_date).format('DD-MM-YYYY') : '',
						status:
							el.status_pay === '1'
								? 'ชำระแล้ว'
								: el.status_pay === '2'
								? 'เติมเงินสำเร็จ'
								: 'รอตรวจสอบ',
						reciept: el.path_receipt,
						payment: [
							el.bank,
							el.path_credit,
							el.amount_qr,
							el.reference1,
							el.reference2,
						],
					}
				})
				setDataList(data)
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currentMonth = moment(new Date()).format('MM')
		const currentYear = moment(new Date()).format('YYYY')
		setSelect((e) => ({
			...e,
			month: currentMonth,
			year: currentYear,
			periodDate: '3',
		}))
		Promise.all([LIST.VIF_ACTIVE()]).then((e) => setVifList(e[0]))
	}, [fetchData])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const dayOfMonth = moment(`${select.year}-${select.month}`).daysInMonth()
		let endDate
		let startDate
		if (select.periodDate === '1') {
			startDate = moment(`${select.year}-${select.month}-01 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			endDate = moment(`${select.year}-${select.month}-15 23:59:59`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
		}
		if (select.periodDate === '2') {
			startDate = moment(`${select.year}-${select.month}-16 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			endDate = moment(
				`${select.year}-${select.month}-${dayOfMonth} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')
		}
		if (select.periodDate === '3') {
			startDate = moment(`${select.year}-${select.month}-01 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			endDate = moment(
				`${select.year}-${select.month}-${dayOfMonth} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')
		}

		await fetchData(startDate, endDate)
	}

	const columns = [
		{
			title: 'รหัสตรอ.',
			dataIndex: 'code',
			key: 'code',
			align: 'center',
			width: 120,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขที่ใบแจ้ง',
			dataIndex: 'noInvoice',
			key: 'noInvoice',
			align: 'center',
			render: (value) => {
				return value[1] ? (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(value[1])}
					>
						{value[0]}
					</Label>
				) : (
					<Label>{value[0]}</Label>
				)
			},
		},
		{
			title: 'เบี้ยรวม',
			dataIndex: 'premium',
			key: 'premium',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'คอมมิชชั่น',
			dataIndex: 'com',
			key: 'com',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'คืนเครดิต',
			dataIndex: 'discount',
			key: 'discount',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'ยอดวางบิล',
			dataIndex: 'amountBill',
			key: 'amountBill',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ยอดรับชำระ',
			dataIndex: 'amountReceived',
			key: 'amountReceived',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'วันที่ชำระ',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 120,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
		},
		{
			title: 'ใบเสร็จ',
			dataIndex: 'reciept',
			key: 'reciept',
			align: 'center',
			render: (value) => {
				return (
					value && (
						<Label
							color='blue'
							cursor='pointer'
							onClick={() => window.open(value)}
						>
							<FileDoneOutlined style={{ fontSize: '22px', color: THEME.COLORS.RED }} />
						</Label>
					)
				)
			},
		},
		{
			title: 'ช่องทางการชำระ',
			dataIndex: 'payment',
			key: 'payment',
			align: 'center',
			render: (value, row) => {
				const textTooltip = (
					<>
						<span>จำนวน {value[2]} บาท</span>
						<br />
						<span>ref1 {value[3]}</span>
						<br />
						<span>ref2 {value[4]}</span>
					</>
				)
				return value[0] === 'qrcode' ? (
					value[1] ? (
						<Label
							color='blue'
							cursor='pointer'
							onClick={() => window.open(value[1])}
						>
							{value[0]}
						</Label>
					) : (
						<Label color='blue' cursor='pointer'>
							<Tooltip placement='topLeft' title={textTooltip}>
								<span>{value[0]}</span>
							</Tooltip>
						</Label>
					)
				) : (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(value[1])}
					>
						{value[0]}
					</Label>
				)
			},
		},
	]

	const summaryRow = () => {
		const premiumTotal = dataFilter.reduce((acc, curr) => acc + curr.premium, 0)
		const comTotal = dataFilter.reduce((acc, curr) => acc + curr.com, 0)
		const discountTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.discount,
			0
		)
		const amountBillTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.amountBill,
			0
		)
		const amountReceivedTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.amountReceived,
			0
		)
		const outstandingTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.outstanding,
			0
		)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(premiumTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(discountTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amountBillTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amountReceivedTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(outstandingTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataFilter = dataList.filter((e) => {
		if (select?.cuscode) return e.code === select?.cuscode
		if (search)
			return (
				e.code.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				(e.noInvoice[0] &&
					e.noInvoice[0].toLowerCase().indexOf(search.toLowerCase()) !== -1)
			)
		return e
	})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานการรับชำระ</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box>
								<Box className='filter-box'>
									<Box className='filter-input' width='200'>
										<Label>เดือน</Label>
										<Select
											name='month'
											value={select?.month}
											placeholder='เลือกเดือน'
											options={LIST.MONTH}
											onChange={(v, obj) =>
												setSelect((e) => ({ ...e, month: v }))
											}
											notvalue
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Label>ปี</Label>
										<Select
											name='year'
											value={`${select?.year} / ${Number(select?.year) + 543}`}
											placeholder='เลือกปี'
											options={LIST.YEAR()}
											onChange={handleChangSelect}
											notvalue
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Label>ช่วงการแจ้งงาน</Label>
										<Select
											name='periodDate'
											value={select?.periodDate}
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
													text: `วันที่ 16 - ${moment(
														`${select?.year}-${select?.month}`,
														'YYYY-MM'
													).daysInMonth()}`,
												},
												{
													key: '3',
													value: '3',
													text: 'ทั้งหมด',
												},
											]}
											onChange={handleChangSelect}
											notvalue
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Label>ตรอ.</Label>
										<Select
											name='cuscode'
											placeholder='เลือกตรอ.'
											showSearch
											value={select?.cuscode}
											options={vifList}
											onChange={handleChangSelect}
                      allowClear
										/>
									</Box>
								</Box>
								<Box className='filter-box'>
									<Box className='filter-input' width='200'>
										<Label>ค้นหา</Label>
										<Input
											name='search'
											placeholder='ค้นหา'
											onChange={(e) => setSearch(e.target.value)}
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Button className='select-btn' onClick={handleFilter}>
											<SearchOutlined style={{ marginRight: '5px' }} />
											ค้นหา
										</Button>
									</Box>
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								columns={columns}
								dataSource={dataFilter}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(
								columns,
								dataFilter,
								select?.periodDate,
								select?.year,
								select?.month
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default ReportPayment

const ExportExcel = (colHead, dataList, periodDate, year, month) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานการรับชำระ')

		const columns = [
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
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = 'รายงานการรับชำระ'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value =
			periodDate === '1'
				? 'ช่วงการแจ้งงาน วันที่ 1 - 15'
				: periodDate === '2'
				? `ช่วงการแจ้งงาน วันที่ 1 - 15 ${moment(
						`${year}-${month}`,
						'YYYY-MM'
				  ).daysInMonth()}`
				: 'ช่วงการแจ้งงาน ทั้งหมด'

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		// let newCuscode = ''
		let newDataList = []
		dataList.forEach((e) => {
			newDataList.push([
				// newCuscode !== e.code ? e.code : '',
				// newCuscode !== e.code ? e.name : '',
				e.code,
				e.name,
				e.noInvoice[0],
				convertStrToFormat(
					e.premium ? e.premium.toFixed(2) : '0',
					'money_digit'
				),
				convertStrToFormat(e.com ? e.com.toFixed(2) : '0', 'money_digit'),
				convertStrToFormat(
					e.discount ? e.discount.toFixed(2) : '0',
					'money_digit'
				),
				convertStrToFormat(
					e.amountBill ? e.amountBill.toFixed(2) : '0',
					'money_digit'
				),
				convertStrToFormat(
					e.amountReceived ? e.amountReceived.toFixed(2) : '0',
					'money_digit'
				),
				e.date,
				e.status,
				e.payment[0],
			])
			// newCuscode = e.code
		})

		// setSummary
		const premiumTotal = dataList.reduce((acc, curr) => acc + curr.premium, 0)
		const comTotal = dataList.reduce((acc, curr) => acc + curr.com, 0)
		const discountTotal = dataList.reduce((acc, curr) => acc + curr.discount, 0)
		const amountBillTotal = dataList.reduce(
			(acc, curr) => acc + curr.amountBill,
			0
		)
		const amountReceivedTotal = dataList.reduce(
			(acc, curr) => acc + curr.amountReceived,
			0
		)

		dataCell.push(header, ...newDataList, [
			'รวม',
			'',
			'',
			convertStrToFormat(
				premiumTotal ? premiumTotal.toFixed(2) : '0',
				'money_digit'
			),
			convertStrToFormat(comTotal ? comTotal.toFixed(2) : '0', 'money_digit'),
			convertStrToFormat(
				discountTotal ? discountTotal.toFixed(2) : '0',
				'money_digit'
			),
			convertStrToFormat(
				amountBillTotal ? amountBillTotal.toFixed(2) : '0',
				'money_digit'
			),
			convertStrToFormat(
				amountReceivedTotal ? amountReceivedTotal.toFixed(2) : '0',
				'money_digit'
			),
			'',
			'',
			'',
		])

		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(4 + i).getCell(1 + il).alignment = textCenter
				} else if (2 < il && il < 9 && i !== 0) {
					worksheet.getRow(4 + i).getCell(1 + il).alignment = textRight
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${4 + i}`, `C${4 + i}`)
			}
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานการรับชำระ ${monthTitle.text}${year}`
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
