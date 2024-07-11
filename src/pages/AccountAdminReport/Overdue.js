import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
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
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const ReportOverdue = () => {
	const dispatch = useDispatch()
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(
		async (mySearch) => {
			dispatch(loadingAction(true))
			const API = reportController()
			const res = await API.getOverdueReportVIF(mySearch)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))

				const { result } = res
				const data = result.map((el, i) => {
					return {
						key: i,
						...el,
					}
				})
				setDataList(data)
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const mySearch = `${currYear}-${currMonth}%`
		setSelect((e) => ({
			...e,
			month: currMonth,
			year: currYear,
		}))
		fetchData(mySearch)
	}, [fetchData])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const mySearch = `${select.year}-${select.month}%`
		await fetchData(mySearch)
	}

	const columns = [
		{
			title: 'รหัสตรอ.',
			dataIndex: 'cuscode',
			key: 'cuscode',
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
			dataIndex: 'paybill_clear_no',
			key: 'paybill_clear_no',
			align: 'center',
			width: 120,
			render: (value, row) => {
				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(row.invoice_path)}
					>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'เบี้ยรวม',
			dataIndex: 'amount',
			key: 'amount',
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
			dataIndex: 'commission',
			key: 'commission',
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
			dataIndex: 'balance',
			key: 'balance',
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
			dataIndex: 'credit',
			key: 'credit',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'วันที่กำหนดชำระ',
			dataIndex: 'deal_date',
			key: 'deal_date',
			align: 'center',
			width: 120,
			render: (value) => {
				return <Label>{moment(value).format('DD-MM-YYYY HH:mm')}</Label>
			},
		},
		{
			title: 'วันที่ชำระ',
			dataIndex: 'pay_date',
			key: 'pay_date',
			align: 'center',
			width: 120,
			render: (value) => {
				return <Label>{moment(value).format('DD-MM-YYYY HH:mm')}</Label>
			},
		},
		{
			title: 'เกินกำหนด (วัน)',
			dataIndex: 'delay',
			key: 'delay',
			align: 'center',
			width: 50,
		},
		{
			title: 'ช่องทางการชำระ',
			dataIndex: 'bank',
			key: 'bank',
			align: 'center',
		},
	]

	const summaryRow = () => {
		const amountTotal = dataFilter.reduce((acc, curr) => acc + +curr.amount, 0)
		const commissionTotal = dataFilter.reduce(
			(acc, curr) => acc + +curr.commission,
			0
		)
		const discountTotal = dataFilter.reduce(
			(acc, curr) => acc + +curr.discount,
			0
		)
		const balanceTotal = dataFilter.reduce(
			(acc, curr) => acc + +curr.balance,
			0
		)
		const creditTotal = dataFilter.reduce((acc, curr) => acc + +curr.credit, 0)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(amountTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(commissionTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(discountTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(balanceTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(creditTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataFilter = dataList.filter((e) => {
		if (select?.cuscode) return e.name === select?.cuscode
		if (search)
			return (
				e.code.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.paybill_clear_no.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานชำระล่าช้า</Label>
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

export default ReportOverdue

const ExportExcel = (colHead, dataList, year, month) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานชำระล่าช้า')
		const monthTitle = LIST.MONTH.find((e) => e.value === month)

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

		worksheet.getCell('A1').value = 'รายงานการรับชำระ'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `${monthTitle.text}${year}`

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		let newDataList = []
		dataList.forEach((e) => {
			newDataList.push([
				e.cuscode,
				e.name,
				e.paybill_clear_no,
				convertStrToFormat(e.amount || '0', 'money_digit'),
				convertStrToFormat(e.commission || '0', 'money_digit'),
				convertStrToFormat(e.discount || '0', 'money_digit'),
				convertStrToFormat(e.balance || '0', 'money_digit'),
				convertStrToFormat(e.credit || '0', 'money_digit'),
				moment(e.deal_date).format('DD-MM-YYYY HH:mm'),
				moment(e.pay_date).format('DD-MM-YYYY HH:mm'),
				e.delay,
				e.bank,
			])
		})

		// setSummary
		const amountTotal = dataList.reduce((acc, curr) => acc + +curr.amount, 0)
		const comTotal = dataList.reduce((acc, curr) => acc + +curr.commission, 0)
		const discountTotal = dataList.reduce(
			(acc, curr) => acc + +curr.discount,
			0
		)
		const balanceTotal = dataList.reduce((acc, curr) => acc + +curr.balance, 0)
		const creditTotal = dataList.reduce((acc, curr) => acc + +curr.credit, 0)

		dataCell.push(header, ...newDataList, [
			'รวม',
			'',
			'',
			convertStrToFormat(amountTotal || '0', 'money_digit'),
			convertStrToFormat(comTotal || '0', 'money_digit'),
			convertStrToFormat(discountTotal || '0', 'money_digit'),
			convertStrToFormat(balanceTotal || '0', 'money_digit'),
			convertStrToFormat(creditTotal || '0', 'money_digit'),
			'',
			'',
			'',
			'',
		])

		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${4 + i}`, `C${4 + i}`)
			}
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานชำระล่าช้า ${monthTitle.text}${year}`
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
