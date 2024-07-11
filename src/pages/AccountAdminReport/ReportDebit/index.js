import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { reportController } from '../../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Input,
} from '../../../components'
import {
	isValidResponse,
	convertStrToFormat,
	LIST,
	ROUTE_PATH,
	redirect,
} from '../../../helpers'
import { TableComponent } from '../../../components/Table/styled'
import { loadingAction, creditListAction } from '../../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const ReportDebit = () => {
	const dispatch = useDispatch()
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')
	const [sumarySale, setSumarySale] = useState([])

	const fetchData = useCallback(
		async (startDate, endDate) => {
			dispatch(loadingAction(true))
			const curMY = moment().format('YYYY-MM')
			const dayOfMonth = moment(`${curMY}`).daysInMonth()
			const dfStart = moment(`${curMY}-01 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			const dfEnd = moment(`${curMY}-${dayOfMonth} 23:59:59`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			const params = {
				startDate: startDate || dfStart,
				endDate: endDate || dfEnd,
			}

			const API = reportController()
			const res = await API.getReportDebitAdmin(params)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))

				const { qDebit, qSaleSummary } = res.result
				const data = qDebit.map((el, i) => {
					let bringForward = el.amountOld - el.payment
					let summary = el.amount + bringForward
					return {
						key: i,
						...el,
						bringForward: bringForward,
						summary: summary,
					}
				})
				setSumarySale(qSaleSummary)
				setDataList(data)
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currentMonth = moment().format('MM')
		const currentYear = moment().format('YYYY')
		setSelect((e) => ({
			...e,
			month: currentMonth,
			year: currentYear,
		}))
		fetchData()
	}, [fetchData])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const dayOfMonth = moment(`${select.year}-${select.month}`).daysInMonth()
		const startDate = moment(
			`${select.year}-${select.month}-01 00:00:00`
		).format('YYYY-MM-DD HH:mm:ss')
		const endDate = moment(
			`${select.year}-${select.month}-${dayOfMonth} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		fetchData(startDate, endDate)
	}

	const columns = [
		{
			title: 'รหัสตรอ.',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
			render: (value, row) => {
				const handleClick = async () => {
					dispatch(loadingAction(true))

					const dayOfMonth = moment(
						`${select.year}-${select.month}`
					).daysInMonth()
					const startDate = moment(
						`${select.year}-${select.month}-01 00:00:00`
					).format('YYYY-MM-DD HH:mm:ss')
					const endDate = moment(
						`${select.year}-${select.month}-${dayOfMonth} 23:59:59`
					).format('YYYY-MM-DD HH:mm:ss')
					const params = { cuscode: value, startDate, endDate }

					const API = reportController()
					const res = await API.getDetailReportDebitAdmin(params)

					if (isValidResponse(res)) {
						dispatch(loadingAction(false))

						const { result } = res
						dispatch(
							creditListAction({
								...result,
								select: { ...select, cuscode: row.cuscode, name: row.name },
								sumary: {
									amount: row.amount,
									bringForward: row.bringForward,
									summary: row.summary,
								},
							})
						)
						redirect(`${ROUTE_PATH.REPORTDEBIT.LINK}/detail`)
					}
				}

				return (
					<Box>
						<Label color='blue' cursor='pointer' onClick={handleClick}>
							{value}
						</Label>
					</Box>
				)
			},
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'ยอดเติมเงิน',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			width: 200,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'ยอดเติมเงินครั้งก่อน',
			dataIndex: 'amountOld',
			key: 'amountOld',
			align: 'center',
			width: 200,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'ยอดใช้งานแล้ว',
			dataIndex: 'payment',
			key: 'payment',
			align: 'center',
			width: 200,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'ยอดยกมาเดือนก่อน',
			dataIndex: 'bringForward',
			key: 'bringForward',
			align: 'center',
			width: 200,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'รวม',
			dataIndex: 'summary',
			key: 'summary',
			align: 'center',
			width: 200,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
	]

	const columns2 = [
		{
			title: 'ช่องทาง.',
			dataIndex: 'channel',
			key: 'channel',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบี้ยรวม',
			dataIndex: 'priceInsPrb',
			key: 'priceInsPrb',
			align: 'center',
			width: 150,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'ส่วนลด',
			dataIndex: 'sumCom',
			key: 'sumCom',
			align: 'center',
			width: 150,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
		{
			title: 'ยอดชำระ',
			dataIndex: 'balanceInsPrb',
			key: 'balanceInsPrb',
			align: 'center',
			width: 150,
			render: (value) => {
				return convertStrToFormat(value || '0', 'money_digit')
			},
		},
	]

	const dataFilter = dataList.filter((e) => {
		if (search)
			return (
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	const summaryRow = () => {
		const amountTotal = dataFilter.reduce((acc, curr) => acc + curr.amount, 0)
		const amountOldTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.amountOld,
			0
		)
		const paymentTotal = dataFilter.reduce((acc, curr) => acc + curr.payment, 0)
		const bringForwardTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.bringForward,
			0
		)
		const summaryTotal = dataFilter.reduce((acc, curr) => acc + curr.summary, 0)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amountTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amountOldTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(paymentTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(bringForwardTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summaryTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานการเติมเงิน</Label>
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
						<Box className='report-table-right'>
							<Table
								columns={columns2}
								dataSource={sumarySale}
								className='report-data-table'
								size='middle'
								pagination={false}
							/>
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
							{ExportExcel(columns, dataFilter, select?.year, select?.month)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default ReportDebit

const ExportExcel = (colHead, dataList, year, month) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานการเติมเงิน')

		const columns = [
			{ width: 20 },
			{ width: 30 },
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

		worksheet.getCell('A1').value = 'รายงานการเติมเงิน'
		worksheet.getCell('A1').font = { size: 20 }

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		let newDataList = []
		dataList.forEach((e) => {
			newDataList.push([
				e.cuscode,
				e.name,
				convertStrToFormat(e.amount || '0', 'money_digit'),
				convertStrToFormat(e.amountOld || '0', 'money_digit'),
				convertStrToFormat(e.payment || '0', 'money_digit'),
				convertStrToFormat(e.bringForward || '0', 'money_digit'),
				convertStrToFormat(e.summary || 'summary', 'money_digit'),
			])
		})

		// setSummary
		const amountTotal = dataList.reduce((acc, curr) => acc + curr.amount, 0)
		const amountOldTotal = dataList.reduce(
			(acc, curr) => acc + curr.amountOld,
			0
		)
		const paymentTotal = dataList.reduce((acc, curr) => acc + curr.payment, 0)
		const bringForwardTotal = dataList.reduce(
			(acc, curr) => acc + curr.bringForward,
			0
		)
		const summaryTotal = dataList.reduce((acc, curr) => acc + curr.summary, 0)

		dataCell.push(header, ...newDataList, [
			'รวม',
			'',
			convertStrToFormat(amountTotal || '0', 'money_digit'),
			convertStrToFormat(amountOldTotal || '0', 'money_digit'),
			convertStrToFormat(paymentTotal || '0', 'money_digit'),
			convertStrToFormat(bringForwardTotal || '0', 'money_digit'),
			convertStrToFormat(summaryTotal || '0', 'money_digit'),
		])

		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${3 + i}`, `B${3 + i}`)
			}
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานการเติมเงิน ${monthTitle.text}${year}`
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
