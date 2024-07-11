import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { comissionController } from '../../apiServices'
import { Box, Button, Container, Select, Label, Table } from '../../components'
import { isValidResponse, LIST, convertStrToFormat } from '../../helpers'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const IncentiveShoptro = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [month, setMonth] = useState('')
	const [year, setYear] = useState('')

	const fetchData = useCallback(
		async (currMMYear) => {
			dispatch(loadingAction(true))
			const API = comissionController()
			const res = await API.getIncentiveShoptro({ month: currMMYear })
			if (isValidResponse(res)) {
				const data = res.result.map((e, i) => {
					return {
						key: i + 1,
						...e,
					}
				})
				setReportData(data)
			}
			dispatch(loadingAction(false))
		},
		[dispatch]
	)

	useEffect(() => {
		const currMM = moment().format('MM')
		const currYear = moment().format('YYYY')
		const currMMYear = moment().format('YYYY-MM')

		setMonth(currMM)
		setYear(currYear)
		fetchData(`${currMMYear}%`)
	}, [fetchData])

	const handleFilter = async () => {
		const currMMYear = moment(`${year}-${month}`).format('YYYY-MM')

		await fetchData(`${currMMYear}%`)
	}

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'key',
			key: 'key',
			align: 'center',
		},
		{
			title: 'เลขรายการบิล',
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
		},
		{
			title: 'เลขรายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
		},
		{
			title: 'เบอร์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
		},
		{
			title: 'เลขทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'วันที่',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
		},
		{
			title: 'ค่าตรวจสภาพรถ',
			dataIndex: 'inspection_fee',
			key: 'inspection_fee',
			align: 'center',
		},
		{
			title: 'เบี้ยประกัน',
			dataIndex: 'show_price_ins',
			key: 'show_price_ins',
			align: 'center',
		},
		{
			title: 'เบี้ยพรบ',
			dataIndex: 'show_price_prb',
			key: 'show_price_prb',
			align: 'center',
		},
		{
			title: 'คอมตรวจสถาพรถ',
			dataIndex: 'com_inspection_fee',
			key: 'com_inspection_fee',
			align: 'center',
		},
		{
			title: 'คอมเบี้ยประกัน',
			dataIndex: 'com_ins',
			key: 'com_ins',
			align: 'center',
		},
		{
			title: 'คอมเบี้ยพรบ',
			dataIndex: 'com_prb',
			key: 'com_prb',
			align: 'center',
		},
	]

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>คอมมิชชั่น ช๊อป ตรอ.</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box
								className='filter-table-box'
								style={{ justifyContent: 'space-between' }}
							>
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
										<Button className='select-btn' onClick={handleFilter}>
											<SearchOutlined style={{ marginRight: '5px' }} />
											ค้นหา
										</Button>
									</Box>
								</Box>
								<Box className='filter-item' style={{ marginTop: '25px' }}>
									{ExportExcel(columns, reportData, month, year)}
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								columns={columns}
								dataSource={reportData}
								className='report-data-table'
								size='middle'
							/>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default IncentiveShoptro

const ExportExcel = (colHead, dataList, month, year) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานคอมมิชชั่น ช๊อป ตรอ.')
		const monthFl = LIST.MONTH.find((e) => e.value === month)

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 25 },
			{ width: 15 },
			{ width: 15 },
			{ width: 30 },
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

		worksheet.getCell('A1').value = 'รายงานคอมมิชชั่น ช๊อป ตรอ.'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `เดือน ${monthFl.text} ปี ${
			Number(year) + 543
		}`

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e) => {
			return [
				e.key,
				e.bill_num,
				e.quo_num,
				e.nameUser,
				e.tel,
				e.idcar,
				e.date,
				e.inspection_fee,
				e.show_price_ins,
				e.show_price_prb,
				e.com_inspection_fee,
				e.com_ins,
				e.com_prb,
			]
		})

		// setSummary
		const inspectionFeeTotal = dataList.reduce(
			(acc, curr) => acc + +curr.inspection_fee,
			0
		)
		const showPriceInsTotal = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_ins,
			0
		)
		const showPricePrbTotal = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_prb,
			0
		)
		const comInspectionFeeTotal = dataList.reduce(
			(acc, curr) => acc + +curr.com_inspection_fee,
			0
		)
		const comInsTotal = dataList.reduce((acc, curr) => acc + +curr.com_ins, 0)
		const comPrbTotal = dataList.reduce((acc, curr) => acc + +curr.com_prb, 0)

		dataCell.push([...header], ...newDataList, [
			'รวม',
			'',
			'',
			'',
			'',
			'',
			'',
			convertStrToFormat(
				inspectionFeeTotal ? inspectionFeeTotal : '0',
				'money_digit'
			),
			convertStrToFormat(
				showPriceInsTotal ? showPriceInsTotal : '0',
				'money_digit'
			),
			convertStrToFormat(
				showPricePrbTotal ? showPricePrbTotal : '0',
				'money_digit'
			),
			convertStrToFormat(
				comInspectionFeeTotal ? comInspectionFeeTotal : '0',
				'money_digit'
			),
			convertStrToFormat(comInsTotal ? comInsTotal : '0', 'money_digit'),
			convertStrToFormat(comPrbTotal ? comPrbTotal : '0', 'money_digit'),
		])

		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(5 + i).getCell(1 + il).border = borders
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${5 + i}`, `G${5 + i}`)
			}
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานคอมมิชชั่น ช๊อป ตรอ.`
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
