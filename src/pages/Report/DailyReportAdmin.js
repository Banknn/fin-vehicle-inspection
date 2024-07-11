import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { reportController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	DatePicker,
	Label,
	Table,
	Input,
} from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { TableComponent } from '../../components/Table/styled'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const DailyReportAdmin = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState()
	const [prbPriceToday, setPrbPriceToday] = useState(0)
	const [prbPriceMonth, setPrbPriceMonth] = useState(0)
	const [insurePriceToday, setInsurePriceToday] = useState(0)
	const [insurePriceMonth, setInsurePriceMonth] = useState(0)
	const [summary, setSummary] = useState({
		prbPrice: 0,
		insurePrice: 0,
		comPrbPrice: 0,
		comInsPrice: 0,
		otherPrice: 0,
		netPrice: 0,
	})

	const fetchData = useCallback(
		async (start, end) => {
			dispatch(loadingAction(true))
			// defult date
			const currDay = moment().format('DD')
			const currMonth = moment().format('MM')
			const currYear = moment().format('YYYY')

			// set date
			const startToday = moment(
				`${currYear}-${currMonth}-${currDay} 00:00:00`
			).format('YYYY-MM-DD HH:mm:ss')
			const endToday = moment(
				`${currYear}-${currMonth}-${currDay} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')
			const dayOfMonth = moment(new Date()).daysInMonth()
			const monthStart = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			const monthEnd = moment(
				`${currYear}-${currMonth}-${dayOfMonth} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')

			const params = {
				startDate: start || startToday,
				endDate: end || endToday,
			}
			const params2 = {
				startDate: monthStart,
				endDate: monthEnd,
			}
			const API = reportController()
			const res = await API.getDailyReport(params)
			const res2 = await API.getDailyReport(params2)
			if (isValidResponse(res) || isValidResponse(res2)) {
				const result = res.result
				const result2 = res2.result
				const dataFilter = result.filter((e) => e.status === 'active')
				const data = dataFilter.map((e, i) => {
					const otherPrices =
						+e.show_price_taxcar +
						+e.show_price_fine +
						+e.show_price_check +
						+e.show_price_service -
						+e.show_discount_ins

					const net = +e.show_price_prb + +e.show_price_ins + otherPrices

					return {
						key: i,
						no: i + 1,
						quo_num: e.quo_num,
						idcar: e.idcar,
						name: `${e.title || ''} ${e.name} ${e.lastname || ''}`,
						prb: +e.show_price_prb,
						insure: +e.show_price_ins,
						other: otherPrices,
						date: moment(e.datestart).format('DD/MM/YYYY'),
						net,
						by: e.name_key,
					}
				})
				const prbPrice = data.reduce((acc, curr) => acc + curr.prb, 0)
				const insurePrice = data.reduce((acc, curr) => acc + curr.insure, 0)
				const otherPrice = data.reduce((acc, curr) => acc + curr.other, 0)
				const netPrice = data.reduce((acc, curr) => acc + curr.net, 0)

				// box to Date
				const todayFilter = result2.filter(
					(e) =>
						moment(e.datestart).isBetween(startToday, endToday) &&
						e.status === 'active'
				)
				const monthFilter = result2.filter((e) => {
					return (
						moment(e.datestart).isBetween(monthStart, monthEnd) &&
						e.status === 'active'
					)
				})
				const prbTodayPrice = todayFilter.reduce(
					(acc, curr) => acc + +curr.show_price_prb,
					0
				)
				const insureTodayPrice = todayFilter.reduce(
					(acc, curr) => acc + +curr.show_price_ins,
					0
				)
				const prbMonthPrice = monthFilter.reduce(
					(acc, curr) => acc + +curr.show_price_prb,
					0
				)
				const insureMonthPrice = monthFilter.reduce(
					(acc, curr) => acc + +curr.show_price_ins,
					0
				)
				setReportData(data)
				setSummary({
					prbPrice,
					insurePrice,
					otherPrice,
					netPrice,
				})
				setPrbPriceToday(prbTodayPrice)
				setInsurePriceToday(insureTodayPrice)
				setPrbPriceMonth(prbMonthPrice)
				setInsurePriceMonth(insureMonthPrice)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const start = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${endSelected} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
		await fetchData(start, end)
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
			title: 'ทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'ชื่อ',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'วันที่แจ้งงาน',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
		},
		{
			title: 'พ.ร.บ. รถ',
			dataIndex: 'prb',
			key: 'prb',
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
			title: 'ประกันรถ',
			dataIndex: 'insure',
			key: 'insure',
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
			title: 'ค่าใช้จ่ายอื่นๆ',
			dataIndex: 'other',
			key: 'other',
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
			title: 'สุทธิ',
			dataIndex: 'net',
			key: 'net',
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
			title: 'ออกโดย',
			dataIndex: 'by',
			key: 'by',
			align: 'center',
		},
	]

	const summaryRow = (pageData) => {
		const prbPrice = pageData.reduce((acc, curr) => acc + curr.prb, 0)
		const insurePrice = pageData.reduce((acc, curr) => acc + curr.insure, 0)
		const other = pageData.reduce((acc, curr) => acc + curr.other, 0)
		const netPrice = pageData.reduce((acc, curr) => acc + curr.net, 0)
		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(prbPrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(insurePrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(other.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(netPrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.prbPrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.insurePrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.otherPrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(summary.netPrice.toFixed(2), 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataList = reportData
		.filter((e) => {
			if (search)
				return (
					e.quo_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1
				)
			return e
		})
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>รายงานประจำวัน</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box'>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								พ.ร.บ. รถวันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(prbPriceToday.toString(), 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								ประกันรถวันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(insurePriceToday.toString(), 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								พ.ร.บ. รถเดือนนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(prbPriceMonth.toString(), 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								ประกันรถเดือนนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(insurePriceMonth.toString(), 'money_digit')}
							</Label>
						</Box>
					</Box>
					<Box className='report-table'>
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
								<Input
									name='search'
									placeholder='ค้นหา'
									isNotForm
									onChange={(e) => setSearch(e.target.value)}
								/>
							</Box>
							<Button className='select-btn' onClick={handleFilter}>
								<SearchOutlined style={{ marginRight: '5px' }} />
								ค้นหา
							</Button>
						</Box>
						<Table
							columns={columns}
							dataSource={dataList}
							className='report-data-table'
							size='middle'
							summary={summaryRow}
						/>
					</Box>
					<Box className='accept-group-btn-wrapper'>
						{ExportExcel(columns, dataList, summary, startDate, endDate)}
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default DailyReportAdmin

const ExportExcel = (columnsHead, dataList, summary, startDate, endDate) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานประจำวัน')

		let columns = []
		for (let i = 0; i <= 10; i++) {
			if (i === 0) {
				columns.push({ width: 10 })
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

		worksheet.getCell('A1').value = 'รายงานประจำวัน'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่างวันที่ ${moment(startDate).format(
			'DD/MM/YYYY'
		)} - ${moment(endDate).format('DD/MM/YYYY')}`

		const header1 = columnsHead.map((e) => {
			return e.title
		})

		let newDataList1 = dataList.map((e) => [
			e.no,
			e.quo_num,
			e.idcar,
			e.name,
			e.date,
			convertStrToFormat(e.prb || '0', 'money_digit'),
			convertStrToFormat(e.insure || '0', 'money_digit'),
			convertStrToFormat(e.other || '0', 'money_digit'),
			convertStrToFormat(e.net || '0', 'money_digit'),
			e.by,
		])

		let dataCell = []

		dataCell.push(header1, ...newDataList1, [
			'',
			'',
			'',
			'',
			'รวม',
			convertStrToFormat(summary.prbPrice.toFixed(2) || '0', 'money_digit'),
			convertStrToFormat(summary.insurePrice.toFixed(2) || '0', 'money_digit'),
			convertStrToFormat(summary.otherPrice.toFixed(2) || '0', 'money_digit'),
			convertStrToFormat(summary.netPrice.toFixed(2) || '0', 'money_digit'),
			'',
		])
		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))
		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders

				// if (i === 0) {
				// 	worksheet.getRow(9 + i).getCell(1 + il).alignment = textCenter
				// }
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานประจำวัน ${moment(startDate).format(
				'DDMMYYYY'
			)} - ${moment(endDate).format('DDMMYYYY')}`
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
