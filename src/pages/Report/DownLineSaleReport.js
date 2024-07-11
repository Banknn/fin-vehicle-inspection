import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { reportController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Label,
	Table,
	DatePicker,
	Input,
} from '../../components'
import { isValidResponse, convertStrToFormat } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { Modal } from 'antd'
import { saveAs } from 'file-saver'

const DownLineSaleReport = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState('')
	const [dataList, setDataList] = useState([])

	const fetchData = useCallback(
		async (startDateFl, endDateFl) => {
			dispatch(loadingAction(true))
			const params = {
				startDate: startDateFl,
				endDate: endDateFl,
			}

			const API = reportController()
			const res = await API.getDownLineSaleReport(params)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))
				const { result } = res
				const data = result.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						...e,
					}
				})

				if (data.length === 0) {
					Modal.warning({
						title: 'ไม่พบข้อมูลลูกทีม',
					})
				} else {
					setDataList(data)
				}
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currDay = moment().format('DD')
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const startDateFl = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const endDateFl = moment(
			`${currYear}-${currMonth}-${currDay} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		setStartDate(startDateFl)
		setEndDate(endDateFl)
	}, [])

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const stDate = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const enDate = moment(`${endSelected} 23:59:59`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		fetchData(stDate, enDate)
	}

	const data = dataList
		.filter((e) => {
			if (search)
				return (
					e.cuscode?.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
				)
      return e
		})
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	const summaryRow = (pageData) => {
		const pricePrb = pageData.reduce((acc, curr) => acc + +curr.pricePrb, 0)
		const priceIns = pageData.reduce((acc, curr) => acc + +curr.priceIns, 0)
		const sumPrbIns = pageData.reduce((acc, curr) => acc + +curr.sumPrbIns, 0)

		// setSummary
		const pricePrbTotal = data.reduce((acc, curr) => acc + +curr.pricePrb, 0)
		const priceInsTotal = data.reduce((acc, curr) => acc + +curr.priceIns, 0)
		const sumPrbInsTotal = data.reduce((acc, curr) => acc + +curr.sumPrbIns, 0)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(pricePrb || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceIns || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumPrbIns || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(pricePrbTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceInsTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumPrbInsTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'รหัสนายหน้า',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 230,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 400,
		},
		{
			title: 'รายการทั้งหมด',
			dataIndex: 'countQuoNum',
			key: 'countQuoNum',
			align: 'center',
			width: 200,
			sorter: (a, b) => b.countQuoNum - a.countQuoNum,
		},
		{
			title: 'รายการพ.ร.บ.',
			dataIndex: 'countCompanyPrb',
			key: 'countCompanyPrb',
			align: 'center',
			width: 200,
			sorter: (a, b) => b.countCompanyPrb - a.countCompanyPrb,
		},
		{
			title: 'รายการประกัน',
			dataIndex: 'countCompany',
			key: 'countCompany',
			align: 'center',
			width: 200,
			sorter: (a, b) => b.countCompany - a.countCompany,
		},
		{
			title: 'เบี้ยรวมพ.ร.บ.',
			dataIndex: 'pricePrb',
			key: 'pricePrb',
			align: 'center',
			width: 200,
			sorter: (a, b) => b.pricePrb - a.pricePrb,
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
			sorter: (a, b) => b.priceIns - a.priceIns,
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
			sorter: (a, b) => b.sumPrbIns - a.sumPrbIns,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
	]

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ยอดขายลูกทีม</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box>
								<Box className='filter-box'>
									<Box className='filter-input' width='200'>
										<Label>วันที่</Label>
										<DatePicker
											name='startDate'
											placeholder='วันที่'
											format='DD/MM/YYYY'
											onChange={(e) => setStartDate(e)}
											value={moment(startDate)}
											notvalue
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Label>ถึงวันที่</Label>
										<DatePicker
											name='endDate'
											placeholder='วันที่'
											format='DD/MM/YYYY'
											onChange={(e) => setEndDate(e)}
											value={moment(endDate)}
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
								dataSource={data}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(columns, data, startDate, endDate)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default DownLineSaleReport

const ExportExcel = (colHead, dataList, startDate, endDate) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('ยอดขายลูกทีม')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 38 },
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

		worksheet.getCell('A1').value = 'ยอดขายลูกทีม'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่าง วันที่ ${moment(startDate).format(
			'DD/MM/YYYY'
		)} ถึง วันที่ ${moment(endDate).format('DD/MM/YYYY')}`

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e, i) => {
			return [
				i + 1,
				e.cuscode,
				e.name,
				e.countQuoNum,
				e.countCompanyPrb,
				e.countCompany,
				e.pricePrb,
				e.priceIns,
				e.sumPrbIns,
			]
		})

		// setSummary
		const pricePrbTotal = dataList.reduce(
			(acc, curr) => acc + +curr.pricePrb,
			0
		)
		const priceInsTotal = dataList.reduce(
			(acc, curr) => acc + +curr.priceIns,
			0
		)
		const sumPrbInsTotal = dataList.reduce(
			(acc, curr) => acc + +curr.sumPrbIns,
			0
		)

		const sumList = []
		sumList.push(
			'รวม',
			'',
			'',
			'',
			'',
			'',
			convertStrToFormat(pricePrbTotal || '0', 'money_digit'),
			convertStrToFormat(priceInsTotal || '0', 'money_digit'),
			convertStrToFormat(sumPrbInsTotal || '0', 'money_digit')
		)

		dataCell.push(header, ...newDataList, sumList)

		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(5 + i).getCell(1 + il).border = borders
				if (i === 0) {
					worksheet.getRow(5 + i).getCell(1 + il).alignment = textCenter
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${5 + i}`, `F${5 + i}`)
			}
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = 'ยอดขายลูกทีม'
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
