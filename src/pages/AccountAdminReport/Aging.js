import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { reportController } from '../../apiServices'
import {
	Box,
	Input,
	Button,
	Container,
	Label,
	Table,
	DatePicker,
} from '../../components'
import { isValidResponse, convertStrToFormat } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const Aging = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState('')
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(
		async (dateStart) => {
			dispatch(loadingAction(true))
			const date = moment(dateStart || new Date()).format('YYYY-MM-DD HH:mm:ss')

			const API = reportController()
			const res = await API.getAgingReportVif(date)
			if (isValidResponse(res)) {
				const { result } = res
				let dataList = result.map((e, i) => {
					return {
						key: i,
						cuscode: e.user_login,
						customerGroup: 'OTHERS',
						name: e.name,
            vif_type: e.vif_type,
						credit: convertStrToFormat(e.credit_vif_total, 'money_digit'),
						status: e.is_payment_vif === 'no' ? 'Inactive' : 'Active',
						grandTotal: e.grand_total,
						fifteen: e.amount_ft,
						thirty: e.amount_tr - e.amount_ft,
						fortyfive: e.amount_forty - e.amount_tr,
						sixty: e.amount_sx - e.amount_forty,
						sixtyMore:
							e.grand_total -
							(e.amount_ft +
								(e.amount_tr - e.amount_ft) +
								(e.amount_forty - e.amount_tr) +
								(e.amount_sx - e.amount_forty)),
					}
				})
				setDataList(dataList)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		setStartDate(moment(new Date()))
		fetchData()
	}, [fetchData])

	const handleFilter = () => {
		fetchData(startDate)
	}

	const columns = [
		{
			title: 'Code',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 150,
		},
		{
			title: 'Customer Group',
			dataIndex: 'customerGroup',
			key: 'customerGroup',
			align: 'center',
			width: 150,
		},
		{
			title: 'ชื่อ',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 250,
		},
		{
			title: 'สถานะระบบ',
			dataIndex: 'vif_type',
			key: 'vif_type',
			align: 'center',
			width: 200,
		},
		{
			title: 'เครดิต',
			dataIndex: 'credit',
			key: 'credit',
			align: 'center',
			width: 200,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (value) => {
				return (
					<Label className='status' status={value === 'Active' && 'active'}>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'Grand Total',
			dataIndex: 'grandTotal',
			key: 'grandTotal',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: '15 วัน',
			dataIndex: 'fifteen',
			key: 'fifteen',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: '30 วัน',
			dataIndex: 'thirty',
			key: 'thirty',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: '45 วัน',
			dataIndex: 'fortyfive',
			key: 'fortyfive',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: '60 วัน',
			dataIndex: 'sixty',
			key: 'sixty',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'เกิน 60 วัน',
			dataIndex: 'sixtyMore',
			key: 'sixtyMore',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
	]

	const summaryRow = (pageData) => {
		const grandTotal = pageData.reduce((acc, curr) => acc + curr.grandTotal, 0)
		const fifteen = pageData.reduce((acc, curr) => acc + curr.fifteen, 0)
		const thirty = pageData.reduce((acc, curr) => acc + curr.thirty, 0)
		const fortyfive = pageData.reduce((acc, curr) => acc + curr.fortyfive, 0)
		const sixty = pageData.reduce((acc, curr) => acc + curr.sixty, 0)
		const sixtyMore = pageData.reduce((acc, curr) => acc + curr.sixtyMore, 0)
		const grandTotals = dataFilter.reduce(
			(acc, curr) => acc + curr.grandTotal,
			0
		)
		const fifteenTotal = dataFilter.reduce((acc, curr) => acc + curr.fifteen, 0)
		const thirtyTotal = dataFilter.reduce((acc, curr) => acc + curr.thirty, 0)
		const fortyfiveTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.fortyfive,
			0
		)
		const sixtyTotal = dataFilter.reduce((acc, curr) => acc + curr.sixty, 0)
		const sixtyMoreTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.sixtyMore,
			0
		)

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
						{convertStrToFormat(grandTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(fifteen, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(thirty, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(fortyfive, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sixty, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sixtyMore, 'money_digit')}
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
						{convertStrToFormat(grandTotals, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(fifteenTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(thirtyTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(fortyfiveTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sixtyTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sixtyMoreTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataFilter = dataList.filter((e) => {
		if (search)
			return (
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>Aging</Label>
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
											value={startDate}
											placeholder='วันที่'
											format='DD/MM/YYYY'
											notvalue
											onChange={(e) => setStartDate(e)}
										/>
									</Box>
									<Box className='filter-input' width='200'>
										<Label>ค้นหา</Label>
										<Input
											name='search'
											placeholder='ค้นหา'
											isNotForm
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
							{ExportExcel(columns, dataFilter)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default Aging

const ExportExcel = (colHead, dataList) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('Aging')

		const columns = [
			{ width: 15 },
			{ width: 15 },
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
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = 'Aging'
		worksheet.getCell('A1').font = { size: 20 }

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e) => {
			return [
				e.cuscode,
				e.customerGroup,
				e.name,
				e.vif_type,
				e.credit,
				e.status,
				convertStrToFormat(e.grandTotal, 'money_digit'),
				convertStrToFormat(e.fifteen, 'money_digit'),
				convertStrToFormat(e.thirty, 'money_digit'),
				convertStrToFormat(e.fortyfive, 'money_digit'),
				convertStrToFormat(e.sixty, 'money_digit'),
				convertStrToFormat(e.sixtyMore, 'money_digit'),
			]
		})

		// setSummary
		const grandTotals = dataList.reduce((acc, curr) => acc + curr.grandTotal, 0)
		const fifteenTotal = dataList.reduce((acc, curr) => acc + curr.fifteen, 0)
		const thirtyTotal = dataList.reduce((acc, curr) => acc + curr.thirty, 0)
		const fortyfiveTotal = dataList.reduce(
			(acc, curr) => acc + curr.fortyfive,
			0
		)
		const sixtyTotal = dataList.reduce((acc, curr) => acc + curr.sixty, 0)
		const sixtyMoreTotal = dataList.reduce(
			(acc, curr) => acc + curr.sixtyMore,
			0
		)

		dataCell.push(header, ...newDataList, [
			'รวม',
			'',
			'',
			'',
			'',
			'',
			convertStrToFormat(grandTotals, 'money_digit'),
			convertStrToFormat(fifteenTotal, 'money_digit'),
			convertStrToFormat(thirtyTotal, 'money_digit'),
			convertStrToFormat(fortyfiveTotal, 'money_digit'),
			convertStrToFormat(sixtyTotal, 'money_digit'),
			convertStrToFormat(sixtyMoreTotal, 'money_digit'),
		])

		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				} else if (5 < il || il === 4) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textRight
				} else if (il === 5) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${3 + i}`, `F${3 + i}`)
			}
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `Aging ${moment(new Date()).format('YYYY-MM-DD HH-mm')}`
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
