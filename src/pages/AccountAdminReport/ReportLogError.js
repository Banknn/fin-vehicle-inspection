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
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { Col, Row } from 'antd'
import { saveAs } from 'file-saver'

const ReportCancel = () => {
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
			const res = await API.getLogErrorAccount(params)
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
		.filter(
			(e) =>
				e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.quo_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.nameUser.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1
		)
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'Policyno',
			dataIndex: 'policyno',
			key: 'policyno',
			align: 'center',
			width: 150,
		},
		{
			title: 'เลขรายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
			width: 150,
		},
		{
			title: 'เลขทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 120,
		},
		{
			title: 'เลขตัวถัง',
			dataIndex: 'id_motor2',
			key: 'id_motor2',
			align: 'center',
			width: 120,
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 250,
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 250,
		},
		{
			title: 'ราคา',
			dataIndex: 'price_insure',
			key: 'price_insure',
			align: 'center',
			width: 150,
      render: (value) => {
				return <Label>{convertStrToFormat(value, 'money')}</Label>
			},
		},
		{
			title: 'ประเภท',
			dataIndex: 'policy_type',
			key: 'policy_type',
			align: 'center',
			width: 150,
			render: (value) => {
				return <Label>{value === 'CMI' ? 'พรบ' : 'ภาคสมัครใจ'}</Label>
			},
		},
		{
			title: 'วันที่ส่ง Api',
			dataIndex: 'created_at',
			key: 'created_at',
			align: 'center',
			width: 150,
		},
		{
			title: 'แจ้งเตือน',
			dataIndex: 'error_msg',
			key: 'error_msg',
			align: 'center',
			width: 300,
		},
		{
			title: 'รหัส ตรอ',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 150,
		},
		{
			title: 'ชื่อ ตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 300,
		},
	]

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายการ Log Error</Label>
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
								scroll={{ x: 2000 }}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(data, columns, startDate, endDate)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default ReportCancel

const ExportExcel = (dataList, colHead, startDate, endDate) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายการ Log Error')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 25 },
			{ width: 20 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 30 },
			{ width: 15 },
			{ width: 30 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}

		worksheet.getCell('A1').value = 'รายการ Log Error'
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
				e.policyno,
				e.quo_num,
				e.idcar,
				e.id_motor2,
				e.nameUser,
				e.company,
				e.price_insure,
				e.policy_type === 'CMI' ? 'พรบ' : 'ภาคสมัครใจ',
				e.created_at,
				e.error_msg,
				e.cuscode,
				e.name,
			]
		})


		dataCell.push(header, ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(5 + i).getCell(1 + il).border = borders
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = 'รายการ Log Error'
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
