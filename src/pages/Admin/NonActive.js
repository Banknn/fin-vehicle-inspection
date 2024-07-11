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
import { isValidResponse, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const NonActive = () => {
	const dispatch = useDispatch()
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(
		async (startDate, endDate, channel) => {
			dispatch(loadingAction(true))

			const params = {
				startDate,
				endDate,
				channel,
			}
			const API = reportController()
			const res = await API.getReportNonActive(params)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))

				const { result } = res
				const data = result.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						cuscode: e.user_login,
						name: e.name,
						member: e.fin_sale,
						userAdviser: e.user_adviser,
						nameAdviser: e.name_adviser,
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
		const startDate = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const endDate = moment(
			`${currYear}-${currMonth}-${currDay} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		setSelect((e) => ({
			...e,
			month: currMonth,
			year: currYear,
			channel: '1',
		}))
		fetchData(startDate, endDate, '1')
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

		await fetchData(startDate, endDate, select?.channel)
	}

	const columns = [
		{
			title: 'ลำดับ.',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 100,
		},
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
			title: 'Member',
			dataIndex: 'member',
			key: 'member',
			align: 'center',
			width: 120,
		},
		{
			title: 'รหัสผู้แนะนำ',
			dataIndex: 'userAdviser',
			key: 'userAdviser',
			align: 'center',
			width: 120,
		},
		{
			title: 'ชื่อผู้แนะนำ',
			dataIndex: 'nameAdviser',
			key: 'nameAdviser',
			align: 'center',
			width: 200,
		},
	]

	const dataFilter = dataList.filter((e) => {
		if (search)
			return (
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.member.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.userAdviser.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>Non Active</Label>
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
										<Label>ช่องทาง</Label>
										<Select
											name='channel'
											value={select?.channel}
											placeholder=''
											options={[
												{
													key: '1',
													value: '1',
													text: 'ตรอ.',
												},
												{
													key: '2',
													value: '2',
													text: 'หน้าร้าน',
												},
												{
													key: '3',
													value: '3',
													text: 'สำนักงานฟิน',
												},
												{
													key: '4',
													value: '4',
													text: 'ควิกเซอร์วิส',
												},
												{
													key: '5',
													value: '5',
													text: 'สาขาน้องฟ้า',
												},
												{
													key: '6',
													value: '6',
													text: 'เค พี ออนไลน์ เซอร์วิส',
												},
											]}
											onChange={handleChangSelect}
											notvalue
										/>
									</Box>
								</Box>
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
								dataSource={dataFilter}
								className='report-data-table'
								size='middle'
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(
								columns,
								dataFilter,
								select?.channel,
								select?.year,
								select?.month
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default NonActive

const ExportExcel = (colHead, dataList, channel, year, month) => {
	const checkChannel = () => {
		switch (channel) {
			case '1':
				return 'ช่องทาง ตรอ.'
			case '2':
				return 'ช่องทาง หน้าร้าน'
			case '3':
				return 'ช่องทาง หน้าร้าน'
			case '4':
				return 'ช่องทาง ควิกเซอร์วิส'
			case '5':
				return 'ช่องทาง สาขาน้องฟ้า'
			case '6':
				return 'ช่องทาง เค พี ออนไลน์ เซอร์วิส'
			default:
				return
		}
	}

	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('Non Active')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 30 },
			{ width: 15 },
			{ width: 15 },
			{ width: 30 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		let resA2 = checkChannel()

		worksheet.getCell('A1').value = 'Non Active'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = resA2

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		let newDataList = []
		dataList.forEach((e) => {
			newDataList.push([
				e.no,
				e.cuscode,
				e.name,
				e.member,
				e.userAdviser,
				e.nameAdviser,
			])
		})

		dataCell.push(header, ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(4 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(4 + i).getCell(1 + il).border = borders
				worksheet.getRow(4 + i).getCell(1 + il).alignment = textCenter
			})
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `Non Active ${monthTitle.text}${year}`
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
