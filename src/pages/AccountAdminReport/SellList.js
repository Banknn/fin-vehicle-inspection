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
	DatePicker,
	Input,
} from '../../components'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { Col, Row } from 'antd'
import { saveAs } from 'file-saver'

const SellList = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [company, setCompany] = useState('แอกซ่าประกันภัย')
	const [search, setSearch] = useState('')
	const [dataList, setDataList] = useState([])

	const fetchData = useCallback(
		async (startDateFl, endDateFl, company) => {
			dispatch(loadingAction(true))
			const params = {
				startDate: startDateFl,
				endDate: endDateFl,
				company: company,
			}

			const API = reportController()
			const res = await API.getSellList(params)
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
				setDataList(data)
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currDay = moment().format('DD')
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const startDateFl = moment(
			`${currYear}-${currMonth}-${currDay} 00:00:00`
		).format('YYYY-MM-DD HH:mm:ss')
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
		fetchData(stDate, enDate, company)
	}

	const data = dataList
		.filter(
			(e) =>
				e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.idFq.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.idFin.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.policyno.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.nameUser.toLowerCase().indexOf(search.toLowerCase()) !== -1
		)
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	const summaryRow = (pageData) => {
		const pricePrb = pageData.reduce(
			(acc, curr) => acc + +curr.show_price_prb,
			0
		)
		const priceIns = pageData.reduce(
			(acc, curr) => acc + +curr.show_price_ins,
			0
		)
		const comPrb = pageData.reduce((acc, curr) => acc + +curr.com_prb, 0)
		const comIns = pageData.reduce((acc, curr) => acc + +curr.com_ins, 0)
		const sumInsPrb = pageData.reduce(
			(acc, curr) => acc + +curr.summary_ins_prb,
			0
		)

		// setSummary
		const pricePrbTotal = data.reduce(
			(acc, curr) => acc + +curr.show_price_prb,
			0
		)
		const priceInsTotal = data.reduce(
			(acc, curr) => acc + +curr.show_price_ins,
			0
		)
		const comPrbTotal = data.reduce((acc, curr) => acc + +curr.com_prb, 0)
		const comInsTotal = data.reduce((acc, curr) => acc + +curr.com_ins, 0)
		const sumInsPrbTotal = data.reduce(
			(acc, curr) => acc + +curr.summary_ins_prb,
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
						{convertStrToFormat(comPrb || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comIns || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumInsPrb || '0', 'money_digit')}
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
						{convertStrToFormat(comPrbTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comInsTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumInsPrbTotal || '0', 'money_digit')}
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
			title: 'ไฟล์ Copy',
			dataIndex: 'bill_copy',
			key: 'bill_copy',
			align: 'center',
			width: 100,
			render: (value) => {
				return value ? (
					<Button className='success-btn' onClick={() => window.open(value)}>
						เปิด
					</Button>
				) : null
			},
		},
		{
			title: 'ไฟล์ต้นฉบับ',
			dataIndex: 'bill_policy',
			key: 'bill_policy',
			align: 'center',
			width: 100,
			render: (value) => {
				return value ? (
					<Button className='success-btn' onClick={() => window.open(value)}>
						เปิด
					</Button>
				) : null
			},
		},
		{
			title: 'เลขทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 120,
		},
		{
			title: 'เลขFQ',
			dataIndex: 'idFq',
			key: 'idFq',
			align: 'center',
			width: 250,
		},
		{
			title: 'เลขFIN',
			dataIndex: 'idFin',
			key: 'idFin',
			align: 'center',
			width: 250,
		},
		{
			title: 'เลขกรม',
			dataIndex: 'policyno',
			key: 'policyno',
			align: 'center',
			width: 120,
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 400,
		},
		{
			title: 'บริษัทพรบ',
			dataIndex: 'company_prb',
			key: 'company_prb',
			align: 'center',
			width: 300,
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 300,
		},
		{
			title: 'ประเภท',
			dataIndex: 'insureType',
			key: 'insureType',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Label>{row.policy_type === 'CMI' ? 'พ.ร.บ.' : row.insureType}</Label>
				)
			},
		},
		{
			title: 'ราคาพรบ',
			dataIndex: 'show_price_prb',
			key: 'show_price_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'ราคาประกัน',
			dataIndex: 'show_price_ins',
			key: 'show_price_ins',
			align: 'center',
			width: 200,
		},
		{
			title: 'ส่วนลดพรบ',
			dataIndex: 'com_prb',
			key: 'com_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'ส่วนลดประกัน',
			dataIndex: 'com_ins',
			key: 'com_ins',
			align: 'center',
			width: 200,
		},
		{
			title: 'ราคารวม',
			dataIndex: 'summary_ins_prb',
			key: 'summary_ins_prb',
			align: 'center',
			width: 200,
		},
	]

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายการยอดขาย</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box>
								<Row gutter={[16, 8]}>
									<Col>
										<Box className='filter-input' width='200'>
											<Label className='filter-label'>ตั้งแต่วันที่</Label>
											<DatePicker
												name='startDate'
												value={moment(startDate)}
												placeholder='ตั้งแต่วันที่'
												format='DD/MM/YYYY'
												notvalue
												onChange={(e) => setStartDate(e)}
											/>
										</Box>
									</Col>
									<Col>
										<Box className='filter-input' width='200'>
											<Label className='filter-label'>ถึงวันที่</Label>
											<DatePicker
												name='endDate'
												value={moment(endDate)}
												placeholder='ถึงวันที่'
												format='DD/MM/YYYY'
												notvalue
												onChange={(e) => setEndDate(e)}
											/>
										</Box>
									</Col>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>บริษัทประกัน</Label>
											<Select
												name='company'
												value={company}
												placeholder='บริษัทประกัน'
												options={LIST.CompanyPrb}
												notvalue
												onChange={(value) => setCompany(value)}
											/>
										</Box>
									</Col>
								</Row>
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
										<Button
											className='select-btn'
											onClick={handleFilter}
											disabled={moment(endDate).diff(startDate, 'months') !== 0}
										>
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
								scroll={{ x: 1800 }}
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(data, startDate, endDate, company)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default SellList

const ExportExcel = (dataList, startDate, endDate, company) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายการยอดขาย')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 25 },
			{ width: 15 },
			{ width: 28 },
			{ width: 28 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 20 },
			{ width: 10 },
			{ width: 20 },
			{ width: 20 },
			{ width: 15 },
			{ width: 30 },
			{ width: 30 },
			{ width: 30 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = 'รายการยอดขาย'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่าง วันที่ ${moment(startDate).format(
			'DD/MM/YYYY'
		)} ถึง วันที่ ${moment(endDate).format('DD/MM/YYYY')}`
		worksheet.getCell('A3').value = `บริษัท ${company}`

		let dataCell = []

		const header = [
			'ลำดับ',
			'เลขทะเบียนรถ',
			'เลขที่FQ',
			'เลขFIN',
			'เลขกรม',
			'ชื่อลูกค้า',
			'ประเภทประกัน',
			'บริษัทพรบ',
			'บริษัทประกัน',
			'ประเภท',
			'ราคาพรบ',
			'ราคาประกัน',
			'ส่วนลดพรบ',
			'ส่วนลดประกัน',
			'ราคารวม',
			'วันที่แจ้งงาน',
			'สถานะ',
			'วันที่เริ่มคุ้มครอง',
			'วันที่สิ้นสุดคุ้มครอง',
			'รหัสตรอ',
			'ชื่อตรอ',
			'ไฟล์ Copy',
			'ไฟล์ต้นฉบับ',
		]

		const newDataList = dataList.map((e, i) => {
			return [
				i + 1,
				e.idcar,
				e.idFq,
				e.idFin,
				e.policyno,
				e.nameUser,
				e.type_insure,
				e.company_prb,
				e.company,
				e.policy_type === 'CMI' ? 'พ.ร.บ.' : e.insureType,
				e.show_price_prb,
				e.show_price_ins,
				e.com_prb,
				e.com_ins,
				e.summary_ins_prb,
				e.datestart,
				e.status,
				e.date_warranty,
				e.date_exp,
				e.user_login,
				e.name,
				e.bill_copy,
				e.bill_policy,
			]
		})

		// setSummary
		const pricePrbTotal = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_prb,
			0
		)
		const priceInsTotal = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_ins,
			0
		)
		const comPrbTotal = dataList.reduce((acc, curr) => acc + +curr.com_prb, 0)
		const comInsTotal = dataList.reduce((acc, curr) => acc + +curr.com_ins, 0)
		const sumInsPrbTotal = dataList.reduce(
			(acc, curr) => acc + +curr.summary_ins_prb,
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
			'',
			'',
			'',
			'',
			convertStrToFormat(pricePrbTotal || '0', 'money_digit'),
			convertStrToFormat(priceInsTotal || '0', 'money_digit'),
			convertStrToFormat(comPrbTotal || '0', 'money_digit'),
			convertStrToFormat(comInsTotal || '0', 'money_digit'),
			convertStrToFormat(sumInsPrbTotal || '0', 'money_digit'),
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			''
		)

		dataCell.push(header, ...newDataList, sumList)

		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(5 + i).getCell(1 + il).border = borders
				if (i === 0 || il === 0 || il === 5 || il === 13) {
					worksheet.getRow(5 + i).getCell(1 + il).alignment = textCenter
				} else if (6 < il && il < 13) {
					worksheet.getRow(5 + i).getCell(1 + il).alignment = textRight
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${5 + i}`, `J${5 + i}`)
			}
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = 'รายการยอดขาย'
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
