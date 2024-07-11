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
} from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { reportController } from '../../apiServices'
import { THEME } from '../../themes'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const CancelBillAccount = () => {
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
			const res = await API.getDetailBillAccount({ start, end })
			if (isValidResponse(res)) {
				let { result } = res
				console.log(result)

				result = result.filter((e) => e.status === 'cancel')
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
			title: 'เลขบิล',
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
			width: 250,
			render: (value, row) => {
				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={async () => {
							const API = reportController()
							const res = await API.getDetailFileHistory(row.bill_num)
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
						}}
					>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'ไฟล์ CN',
			dataIndex: 'path_cn_tax',
			key: 'path_cn_tax',
			align: 'center',
			width: 200,
			render: (value) => {
				return value ? (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(value)}
					>
						เปิด
					</Label>
				) : (
					'-'
				)
			},
		},
		{
			title: 'เหตุผล',
			dataIndex: 'reason',
			key: 'reason',
			align: 'center',
			width: 200,
		},
		{
			title: 'ช่องทางการชำระ',
			dataIndex: 'chanel',
			key: 'chanel',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Box>
						<Label>{value}</Label>
					</Box>
				)
			},
		},
		{
			title: 'เลขรายการกรมธรรม์',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
			width: 250,
			render: (value, row) => {
				return value ? <Label>{value}</Label> : '-'
			},
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 350,
		},
		{
			title: 'ยี่ห้อ',
			dataIndex: 'brand',
			key: 'brand',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'รุ่น',
			dataIndex: 'series',
			key: 'series',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'ปี',
			dataIndex: 'year',
			key: 'year',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'เบอร์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'จังหวัดป้ายทะเบียน',
			dataIndex: 'carprovince',
			key: 'carprovince',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value ? value : '-'}</Label>
			},
		},
		{
			title: 'ค่าประกัน',
			dataIndex: 'show_price_ins',
			key: 'show_price_ins',
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
			title: 'ค่าพรบ',
			dataIndex: 'show_price_prb',
			key: 'show_price_prb',
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
			title: 'ค่าภาษี',
			dataIndex: 'price_tax',
			key: 'price_tax',
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
			title: 'ค่าปรับ',
			dataIndex: 'fine',
			key: 'fine',
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
			title: 'ค่าตรวจสภาพรถ',
			dataIndex: 'inspection_fee',
			key: 'inspection_fee',
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
			title: 'ค่าบริการ',
			dataIndex: 'sevice',
			key: 'sevice',
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
			title: 'ส่วนลดพรบ',
			dataIndex: 'discount_prb',
			key: 'discount_prb',
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
			title: 'ส่วนลดตรวจสภาพรถ',
			dataIndex: 'discount_inspection_fee',
			key: 'discount_inspection_fee',
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
			title: 'ส่วนลดค่าบริการ',
			dataIndex: 'discount_sevice',
			key: 'discount_sevice',
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
			title: 'ส่วนลด',
			dataIndex: 'discount',
			key: 'discount',
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
			title: 'รวม',
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
			title: 'แอดมินคีย์รายการ',
			dataIndex: 'id_key',
			key: 'id_key',
			align: 'center',
			width: 200,
		},
	]

	const dataFilter = dataList
		.filter((e) => {
			if (search) {
				return e.bill_num.toLowerCase().indexOf(search.toLowerCase()) !== -1
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
					<Label className='title-form'>รายงานยกเลิกบิล</Label>
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
								scroll={{ x: 2300 }}
							/>
						</Box>
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
			</Container>
		</>
	)
}

export default CancelBillAccount

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
		const worksheet = workbook.addWorksheet('รายงานยกเลิกบิล')


    let columns = []
		for (let i = 0; i <= 23; i++) {
			if (i === 0) {
				columns.push({ width: 10 })
			} else {
				columns.push({ width: 15 })
			}
		}
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}

		worksheet.getCell('A1').value = 'รายงานยกเลิกบิล'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่างวันที่ ${sDate} ถึง ${eDate}`

		let dataCell = []

		const header = colHead
			.filter((e) => !['path_cn_tax'].includes(e.key))
			.map((e) => {
				return e.title
			})

		const newDataList = dataList.map((e) => {
			return [
				e.no,
				e.bill_num,
				e.reason,
				e.chanel,
				e.quo_num,
				e.nameUser,
				e.brand,
				e.series,
				e.year,
				e.tel,
				e.carprovince,
				e.show_price_ins,
				e.show_price_prb,
				e.price_tax,
				e.fine,
				e.inspection_fee,
				e.sevice,
				e.discount_prb,
				e.discount_inspection_fee,
				e.discount_sevice,
				e.discount,
				e.price_total,
				e.id_key,
			]
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
			let nameFile = `รายงานยกเลิกบิล`
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
