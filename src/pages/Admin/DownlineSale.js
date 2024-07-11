import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Span,
	DatePicker,
} from '../../components'
import { isValidResponse, convertStrToFormat } from '../../helpers'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { Col, Row, Button as ButtonAnt, Upload } from 'antd'
const XLSX = require('xlsx')

const DownlineSale = () => {
	const dispatch = useDispatch()
	const ref = useRef()
	const [fieldError, setFieldError] = useState({})
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [dataImport, setDataImport] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()

	const fetchData = useCallback(
		async (startD, endD) => {
			if (dataImport.length > 0) {
				dispatch(loadingAction(true))
				const params = {
					arrCuscode: dataImport.map((e) => {
						return { cuscode: e.cuscode }
					}),
					type: select.type,
					startDate: startD,
					endDate: endD,
				}

				const API = systemController()
				const res = await API.getDownlineSale(params)
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
			} else {
				let errors = {}
				errors['dataImport'] = 'กรุณาเลือกข้อมูลนำเข้า'
				setFieldError({ errors })
			}
		},
		[dispatch, select.type, dataImport]
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
		setSelect((e) => ({
			type: 'ตรอ',
		}))
	}, [])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const stDate = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const enDate = moment(`${endSelected} 23:59:59`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		await fetchData(stDate, enDate)
	}

	const handleClick = {
		handleOpenCsv: (file) => {
			const typeFilesAccept = [
				'.csv',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
			]
			if (typeFilesAccept.includes(file.type)) {
				const fileReader = new FileReader()
				fileReader.readAsBinaryString(file)
				fileReader.onload = (event) => {
					const data = event.target.result
					const workbook = XLSX.read(data, {
						type: 'binary',
					})
					let obj = XLSX.utils.sheet_to_row_object_array(
						workbook.Sheets[workbook.SheetNames[0]]
					)
					setDataImport(obj)
				}
			}
		},
		onRemove: () => {
			setDataImport([])
			setDataList([])
		},
	}

	const columns = [
		{
			title: 'รหัสหัวทีม',
			dataIndex: 'head',
			key: 'head',
			align: 'center',
			width: 200,
		},
		{
			title: 'รหัสตรอ.',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 250,
		},
		{
			title: 'รายการทั้งหมด',
			dataIndex: 'count_quo_num',
			key: 'count_quo_num',
			align: 'center',
			width: 200,
		},
		{
			title: 'รายการ พรบ',
			dataIndex: 'count_company_prb',
			key: 'count_company_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'รายการ ประกัน',
			dataIndex: 'count_company',
			key: 'count_company',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบี้ยพรบ',
			dataIndex: 'sum_show_price_prb',
			key: 'sum_show_price_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบี้ยประกัน',
			dataIndex: 'sum_show_price_ins',
			key: 'sum_show_price_ins',
			align: 'center',
			width: 200,
		},
		{
			title: 'ยอดรวมพรบ + ประกัน',
			dataIndex: 'sum_ins_prb',
			key: 'sum_ins_prb',
			align: 'center',
			width: 200,
		},
	]

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ยอดขายทีม</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box>
								<Row gutter={[16, 8]}>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>Import File</Label>
											<Upload
												ref={ref}
												maxCount={1}
												beforeUpload={handleClick.handleOpenCsv}
												onRemove={handleClick.onRemove}
												accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
											>
												<ButtonAnt
													icon={<UploadOutlined />}
													style={{ marginTop: '5px', width: '200px' }}
												>
													เลือกไฟล์
												</ButtonAnt>
											</Upload>
											{fieldError.errors?.dataImport &&
												dataImport.length === 0 && (
													<Span color='red'>กรุณาเลือกไฟล์ให้ถูกต้อง</Span>
												)}
										</Box>
									</Col>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>ช่องทาง</Label>
											<Select
												name='type'
												value={select.type}
												placeholder='กรุณาเลือกช่องทาง'
												options={[
													{ value: 'ตรอ', text: 'ตรอ' },
													{ value: 'ประกันรถ', text: 'ประกันรถ' },
													{ value: 'งาน App', text: 'งาน App' },
												]}
												notvalue
												onChange={handleChangSelect}
											/>
										</Box>
									</Col>
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
									{/* <Col>
										<Box className='filter-input' width='200'>
											<Label>เดือน</Label>
											<Select
												name='month'
												value={select?.month}
												placeholder='เลือกเดือน'
												options={LIST.MONTH}
												onChange={handleChangSelect}
												notvalue
											/>
										</Box>
									</Col>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>ปี</Label>
											<Select
												name='year'
												value={`${select?.year} / ${
													Number(select?.year) + 543
												}`}
												placeholder='เลือกปี'
												options={LIST.YEAR()}
												onChange={handleChangSelect}
												notvalue
											/>
										</Box>
									</Col> */}
									<Col>
										<Box className='filter-input' width='200'>
											<Button
												className='select-btn'
												onClick={handleFilter}
												style={{ marginTop: '27px' }}
											>
												<SearchOutlined style={{ marginRight: '5px' }} />
												ค้นหา
											</Button>
										</Box>
									</Col>
								</Row>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								columns={columns}
								dataSource={dataList}
								className='report-data-table'
								size='middle'
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(columns, dataList, startDate, endDate, select.type)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default DownlineSale

const ExportExcel = (colHead, dataList, startDate, endDate, type) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('ยอดขายทีม')

		const columns = [
			{ width: 20 },
			{ width: 20 },
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

		worksheet.getCell('A1').value = `ยอดขายทีม ประเภท ${type}`
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ช่วงวันที่ ${startDate} ถึง ${endDate}`

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		let newDataList = []
		dataList.forEach((e) => {
			newDataList.push([
				e.head,
				e.cuscode,
				e.name,
				e.count_quo_num,
				e.count_company_prb,
				e.count_company,
				convertStrToFormat(e.sum_show_price_prb || '0', 'money_digit'),
				convertStrToFormat(e.sum_show_price_ins || '0', 'money_digit'),
				convertStrToFormat(e.sum_ins_prb || '0', 'money_digit'),
			])
		})

		dataCell.push(header, ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `ยอดขายทีม`
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
