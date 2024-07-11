import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { reportController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Label,
	Select,
	Chart,
	Table,
} from '../../components'
import { convertStrToFormat, isValidResponse, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import { THEME } from '../../themes'
import _ from 'lodash'
import { DownloadOutlined } from '@ant-design/icons'
import { TableComponent } from '../../components/Table/styled'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const SalesYearReport = () => {
	const dispatch = useDispatch()
	const [year, setYear] = useState('')
	const [dataChart, setDataChart] = useState('')
	const [dataChart2, setDataChart2] = useState('')
	const [dataExport, setDataExport] = useState([])
	const [dataCharts] = useState({
		labels: LIST.MONTH.map((e) => {
			return e.text
		}),
		datasets: [
			{
				type: 'line',
				label: 'ยอดรวมพรบ + ประกัน',
				borderColor: THEME.COLORS.RED,
				backgroundColor: THEME.COLORS.RED,
				borderWidth: 2,
				fill: false,
				data: [],
			},
			{
				type: 'bar',
				label: 'ยอดขายพรบ',
				backgroundColor: 'rgb(144, 153, 170)',
				data: [],
				borderColor: 'white',
				borderWidth: 2,
			},
			{
				type: 'bar',
				label: 'ยอดขายประกัน',
				backgroundColor: 'rgb(43, 44, 64)',
				data: [],
			},
		],
	})
	const [dataCharts2] = useState({
		labels: LIST.MONTH.map((e) => {
			return e.text
		}),
		datasets: [
			{
				type: 'line',
				label: 'รายการทั้งหมด',
				borderColor: THEME.COLORS.RED,
				backgroundColor: THEME.COLORS.RED,
				borderWidth: 2,
				fill: false,
				data: [],
			},
			{
				type: 'bar',
				label: 'รายการพ.ร.บ.',
				backgroundColor: 'rgb(144, 153, 170)',
				data: [],
				borderColor: 'white',
				borderWidth: 2,
			},
			{
				type: 'bar',
				label: 'รายการประกัน',
				backgroundColor: 'rgb(43, 44, 64)',
				data: [],
			},
		],
	})

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const API = reportController()
		const res = await API.getReportSalesYears(year)
		if (isValidResponse(res)) {
			dispatch(loadingAction(false))
			const { result } = res
			const arrPrbIns = result.map((e) => e.sumPrbIns)
			const arrPrb = result.map((e) => e.pricePrb)
			const arrIns = result.map((e) => e.priceIns)
			// set chart
			const cloneDataCharts = _.cloneDeep(dataCharts)
			_.set(cloneDataCharts, 'datasets[0].data', arrPrbIns)
			_.set(cloneDataCharts, 'datasets[1].data', arrPrb)
			_.set(cloneDataCharts, 'datasets[2].data', arrIns)
			// set chart2
			const arrCountQuoNum = result.map((e) =>
				!!e.countQuoNum ? e.countQuoNum : null
			)
			const arrCountCompanyPrb = result.map((e) =>
				!!e.countCompanyPrb ? e.countCompanyPrb : null
			)
			const arrCountCompany = result.map((e) =>
				!!e.countCompany ? e.countCompany : null
			)
			const cloneDataCharts2 = _.cloneDeep(dataCharts2)
			_.set(cloneDataCharts2, 'datasets[0].data', arrCountQuoNum)
			_.set(cloneDataCharts2, 'datasets[1].data', arrCountCompanyPrb)
			_.set(cloneDataCharts2, 'datasets[2].data', arrCountCompany)
			setDataChart(cloneDataCharts)
			setDataChart2(cloneDataCharts2)
			setDataExport(result)
		}
	}, [dispatch, year, dataCharts, dataCharts2])

	useEffect(() => {
		const dateNow = new Date()
		const currYear = moment(dateNow).format('YYYY')
		setYear(currYear)
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const columns = [
		{
			title: 'เดือน',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
			width: 250,
		},
		{
			title: 'รายการทั้งหมด',
			dataIndex: 'countQuoNum',
			key: 'countQuoNum',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{!!value ? value : ''}</Label>
			},
		},
		{
			title: 'รายการพ.ร.บ.',
			dataIndex: 'countCompanyPrb',
			key: 'countCompanyPrb',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{!!value ? value : ''}</Label>
			},
		},
		{
			title: 'รายการประกัน',
			dataIndex: 'countCompany',
			key: 'countCompany',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{!!value ? value : ''}</Label>
			},
		},
		{
			title: 'เบี้ยรวมพ.ร.บ.',
			dataIndex: 'pricePrb',
			key: 'pricePrb',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'เบี้ยรวมประกัน',
			dataIndex: 'priceIns',
			key: 'priceIns',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'คอมพ.ร.บ.',
			dataIndex: 'comPrb',
			key: 'comPrb',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'คอมประกัน',
			dataIndex: 'comIns',
			key: 'comIns',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'ยอดรวมประกัน+พรบ',
			dataIndex: 'sumPrbIns',
			key: 'sumPrbIns',
			align: 'center',
			width: 200,
			sorter: (a, b) => a.sumPrbIns - b.sumPrbIns,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
	]

	const summaryRow = (pageData) => {
		// setSummary
		const countQuoNumTotal = pageData.reduce(
			(acc, curr) => acc + curr.countQuoNum,
			0
		)
		const countCompanyPrbTotal = pageData.reduce(
			(acc, curr) => acc + curr.countCompanyPrb,
			0
		)
		const countCompanyTotal = pageData.reduce(
			(acc, curr) => acc + curr.countCompany,
			0
		)
		const pricePrbTotal = pageData.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceInsTotal = pageData.reduce((acc, curr) => acc + curr.priceIns, 0)
		const comPrbTotal = pageData.reduce((acc, curr) => acc + curr.comPrb, 0)
		const comInsTotal = pageData.reduce((acc, curr) => acc + curr.comIns, 0)
		const sumPrbInsTotal = pageData.reduce(
			(acc, curr) => acc + curr.sumPrbIns,
			0
		)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{!!countQuoNumTotal ? countQuoNumTotal : ''}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{!!countCompanyPrbTotal ? countCompanyPrbTotal : ''}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{!!countCompanyTotal ? countCompanyTotal : ''}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(pricePrbTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceInsTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comPrbTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comInsTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumPrbInsTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>รายงานยอดขายประจำปี</Label>
				<Box className='report-wrapper'>
					<Box className='chart-box-center'>
						<Box className='chart-detail'>
							<Box className='filter-chart-between'>
								<Box className='filter-table-box'>
									<Box className='filter-item'>
										<Label className='filter-label'>เลือกปี</Label>
										<Select
											name='year'
											value={`${year} / ${Number(year) + 543}`}
											placeholder='เลือกปี'
											options={LIST.YEAR()}
											onChange={(value) => setYear(value)}
											notvalue
										/>
									</Box>
								</Box>
								<Box>{ExportExcel(dataExport, columns, year)}</Box>
							</Box>
							<Box>
								<Label className='title-chart'>กราฟแสดงยอดขาย</Label>
								<Chart
									style={{ marginTop: '20px', marginBottom: '20px' }}
									data={dataChart ? dataChart : dataCharts}
								/>
							</Box>
							<Box>
								<Label className='title-chart'>กราฟจำนวนรายการ</Label>
								<Chart
									style={{ marginTop: '20px', marginBottom: '20px' }}
									data={dataChart2 ? dataChart2 : dataCharts2}
								/>
							</Box>
						</Box>
					</Box>
					<Box className='report-table'>
						<Table
							columns={columns}
							dataSource={dataExport}
							className='report-data-table'
							size='middle'
							pagination={false}
							summary={summaryRow}
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default SalesYearReport

const ExportExcel = (dataExport, headers, year) => {
	const handleClickExport = async () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet(`รายงานยอดขายประจำปี ${year}`)

		const columns = [
			{ width: 30 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = `รายงานยอดขายประจำปี ${year}`
		worksheet.getCell('A1').font = { size: 20 }

		const header = headers.map((e) => e.title)
		const dataList = dataExport.map((e, i) => {
			return [
				e.month,
				!e.countQuoNum ? null : e.countQuoNum,
				!e.countCompanyPrb ? null : e.countCompanyPrb,
				!e.countCompany ? null : e.countCompany,
				convertStrToFormat(e.pricePrb, 'money_digit'),
				convertStrToFormat(e.priceIns, 'money_digit'),
				convertStrToFormat(e.comPrb, 'money_digit'),
				convertStrToFormat(e.comIns, 'money_digit'),
				convertStrToFormat(e.sumPrbIns, 'money_digit'),
			]
		})
		// setSummary
		const countQuoNumTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.countQuoNum,
			0
		)
		const countCompanyPrbTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.countCompanyPrb,
			0
		)
		const countCompanyTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.countCompany,
			0
		)
		const pricePrbTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.pricePrb,
			0
		)
		const priceInsTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.priceIns,
			0
		)
		const comPrbTotal = dataExport.reduce((acc, curr) => acc + +curr.comPrb, 0)
		const comInsTotal = dataExport.reduce((acc, curr) => acc + +curr.comIns, 0)
		const sumPrbInsTotal = dataExport.reduce(
			(acc, curr) => acc + +curr.sumPrbIns,
			0
		)

		let dataCell = []

		dataCell.push(header, ...dataList, [
			'รวม',
			convertStrToFormat(countQuoNumTotal, 'money_digit'),
			convertStrToFormat(countCompanyPrbTotal, 'money_digit'),
			convertStrToFormat(countCompanyTotal, 'money_digit'),
			convertStrToFormat(pricePrbTotal, 'money_digit'),
			convertStrToFormat(priceInsTotal, 'money_digit'),
			convertStrToFormat(comPrbTotal, 'money_digit'),
			convertStrToFormat(comInsTotal, 'money_digit'),
			convertStrToFormat(sumPrbInsTotal, 'money_digit'),
		])
		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders
				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				} else if (il > 0 && i !== 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textRight
				}
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานยอดขายประจำปี ${year}`
      saveAs(blob, nameFile)
		})
	}

	return (
		<Button
			className='select-btn'
			width='150'
			onClick={handleClickExport}
			disabled={dataExport.length === 0}
		>
			<DownloadOutlined style={{ marginRight: '15px' }} />
			Export
		</Button>
	)
}
