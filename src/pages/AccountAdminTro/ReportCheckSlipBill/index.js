import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Table } from 'antd'
import {
	Box,
	Label,
	Button,
	Input,
	Table as TableCustom,
	DatePicker,
	Modal as ModalCustom,
	Icons,
	Container,
} from '../../../components'
import {
	convertStrToFormat,
	isValidResponse,
	redirect,
	ROUTE_PATH,
} from '../../../helpers'
import { loadingAction, detailSlipBillAction } from '../../../actions'
import { reportController } from '../../../apiServices'
import { THEME } from '../../../themes'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const CheckSlipBill = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState()
	const [dataList, setDataList] = useState([])
	const [dataListFile, setDataListFile] = useState([])

	const modalFile = useRef(null)

	const fetchData = useCallback(
		async (start, end) => {
			dispatch(loadingAction(true))

			const API = reportController()
			const res = await API.getCheckSlipBill({ start, end })
			if (isValidResponse(res)) {
				let { result } = res

				result = result.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						...e,
					}
				})
				setDataList(result)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currDay = moment().format('DD')
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const start = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${currYear}-${currMonth}-${currDay} 23:59:59`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		setStartDate(start)
		setEndDate(end)
		fetchData(start, end)
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
			width: 50,
		},
		{
			title: 'เลขสลิป',
			dataIndex: 'inv_no',
			key: 'inv_no',
			align: 'center',
			width: 250,
			render: (value, row) => {
				const handleFileBill = async () => {
					const API = reportController()
					const res = await API.getDetailFileHistory(row.inv_no)
					if (isValidResponse(res)) {
						let { result } = res

						result = result.map((e, i) => {
							return {
								key: i,
								no: i + 1,
								...e,
							}
						})
						setDataListFile(result)
						modalFile.current.open()
					}
				}

				const handleRedirect = async () => {
					const API = reportController()
					const res = await API.getDetailSlipBill(row.inv_no)
					if (isValidResponse(res)) {
						let { result } = res
						result = result.map((e, i) => {
							return {
								key: i,
								no: i + 1,
								...e,
							}
						})
						const params = {
							inv_no: value,
							cuscode: row.cuscode,
							name: row.name,
							price_total: row.price_total,
							dataList: result,
						}
						dispatch(detailSlipBillAction(params))
						redirect(`${ROUTE_PATH.REPORTCHECKSLIPBILL.LINK}/detail`)
					}
				}

				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={
							value.substring(0, 3) === 'BSU' ? handleRedirect : handleFileBill
						}
					>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'วันที่ชำระ',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 200,
		},
		{
			title: 'รหัสตรอ',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 150,
		},
		{
			title: 'ชื่อ',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 350,
		},
		{
			title: 'ยอดชำระ',
			dataIndex: 'price_total',
			key: 'price_total',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ช่องทางการชำระ',
			dataIndex: 'chanel',
			key: 'chanel',
			align: 'center',
			width: 300,
			render: (value, row) => {
				return (
					<Box>
						{value === 'บัตรเครดิต' ? (
							<Label>
								{value} <br />
								เลขอ้างอิง {row.num_credit}
							</Label>
						) : (
							<Label>{value}</Label>
						)}
					</Box>
				)
			},
		},
		{
			title: 'ไฟล์สลิป',
			dataIndex: 'path_slip',
			key: 'path_slip',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					row.chanel !== 'บัตรเครดิต' && (
						<Button className='select-btn' onClick={() => window.open(value)}>
							เปิดไฟล์
						</Button>
					)
				)
			},
		},
	]

	const dataFilter = dataList
		.filter((e) => {
			if (search) {
				return (
					e.inv_no.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
				)
			}
			return e
		})
		.map((e, i) => {
			return {
				...e,
				key: i,
				no: i + 1,
			}
		})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานตรวจสอบแนบสลิปบิล</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
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
								<Button className='select-btn' onClick={handleFilter}>
									<SearchOutlined style={{ marginRight: '5px' }} />
									ค้นหา
								</Button>
							</Box>
							<Box
								className='filter-table-box'
								style={{ justifyContent: 'space-between' }}
							>
								<Box className='filter-item'>
									<Label style={{ marginRight: '25px' }}>ค้นหา</Label>
									<Input
										name='search'
										placeholder='ค้นหา'
										isNotForm
										onChange={(e) => setSearch(e.target.value)}
									/>
								</Box>
								<Box className='filter-item'>
									{ExportExcel(columns, dataFilter, startDate, endDate)}
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<TableCustom
								columns={columns}
								dataSource={dataFilter}
								className='report-data-table'
								size='middle'
								expandable={{
									expandedRowRender: (record) => (
										<p
											style={{
												margin: 0,
											}}
										>
											{record.description}
										</p>
									),
								}}
							/>
						</Box>
						<ModalCustom
							ref={modalFile}
							headerText='ประวัติไฟล์'
							modalHead='modal-header-red'
							iconsClose={
								<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
							}
						>
							<TableHistory dataListFile={dataListFile} />
						</ModalCustom>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default CheckSlipBill

const TableHistory = ({ dataListFile }) => {
	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'วันที่ดึงไฟล์',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 150,
		},
		{
			title: 'ประเภทไฟล์',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
			width: 150,
			render: (value, row) => {
				return (
					<Label>
						{row.type_paper === 'taxA4'
							? 'ใบกำกับภาษี'
							: row.type_paper === 'taxReceiptA4'
							? 'ใบเสร็จรับเงิน'
							: 'ใบฝากงาน'}
						{row.type_paper === 'slip'
							? '(แบบสลิป)'
							: row.type_paper === 'a4'
							? '(แบบเต็ม)'
							: row.type_paper === 'double' && '(แบบครึ่ง)'}
					</Label>
				)
			},
		},
		{
			title: 'ไฟล์',
			dataIndex: 'open',
			key: 'open',
			align: 'center',
			width: 100,
			render: (value, row) => {
				return (
					<Button
						className='success-btn'
						onClick={() => window.open(row.path_file)}
					>
						เปิด
					</Button>
				)
			},
		},
	]
	return (
		<Box className='history-bill-file'>
			<Table columns={columns} dataSource={dataListFile} size='middle' />
		</Box>
	)
}

const ExportExcel = (colHead, dataList, startDate, endDate) => {
	const handleClickExport = () => {
		const sDate = moment(startDate).format('DD-MM-YYYY')
		const eDate = moment(endDate).format('DD-MM-YYYY')
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานตรวจสอบแนบสลิปบิล')

		const columns = [
			{ width: 10 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 30 },
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

		worksheet.getCell('A1').value = 'รายงานตรวจสอบแนบสลิปบิล'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่างวันที่ ${sDate} ถึง ${eDate}`

		let dataCell = []

		const header = colHead
			.filter((e) => e.key !== 'path_slip')
			.map((e) => {
				return e.title
			})

		const newDataList = dataList.map((e) => {
			return [
				e.no,
				e.date,
				e.inv_no,
				e.cuscode,
				e.name,
				convertStrToFormat(e.price_total, 'money_digit'),
				e.chanel,
				e.bank,
				e.num_credit,
			]
		})

		dataCell.push([...header, 'เลขอ้างอิงบัตรเครดิต'], ...newDataList)

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
			let nameFile = `รายงานตรวจสอบแนบสลิปบิล`
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
