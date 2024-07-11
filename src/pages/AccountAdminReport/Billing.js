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
	Select,
} from '../../components'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import _ from 'lodash'
import { saveAs } from 'file-saver'

const Billing = () => {
	const dispatch = useDispatch()
	const [search, setSearch] = useState('')
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])

	const fetchData = useCallback(
		async (startDate) => {
			dispatch(loadingAction(true))
			const API = reportController()
			const res = await API.getBillReportVIF(startDate)
			if (isValidResponse(res)) {
				const { result } = res
				let data = _.orderBy(result, ['cuscode'], ['asc'])
				data = data.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						cuscode: e.cuscode,
						name: e.name,
						noInvoice: e.paybill_clear_no,
						paybillDate: moment(e.paybill_date).format('YYYY-MM-DD HH:mm:ss'),
						premium: convertStrToFormat(e.amount, 'money_digit'),
						com: convertStrToFormat(e.commission, 'money_digit'),
						discount: convertStrToFormat(e.discount, 'money_digit'),
						amountBill: convertStrToFormat(e.balance, 'money_digit'),
						pathInv: e.invoice_path,
					}
				})
				setDataList(data)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currMonth = moment().format('MM')
		const currYear = moment().format('YYYY')
		const startDate = moment().format('YYYY-MM-DD HH:mm:ss')
		setSelect((e) => ({
			...e,
			month: currMonth,
			year: currYear,
		}))
		fetchData(startDate)
	}, [fetchData])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const startDate = moment(
			`${select.year}-${select.month}-01 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')

		await fetchData(startDate)
	}

	const columns = [
		{
			title: 'No.',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'รหัสตรอ.',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
		},
		{
			title: 'ชื่อร้าน',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 300,
		},
		{
			title: 'เลขที่ใบแจ้งหนี้',
			dataIndex: 'noInvoice',
			key: 'noInvoice',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return row.pathInv ? (
					<Label color='blue' cursor='pointer' onClick={() => window.open(row.pathInv)}>
						{value}
					</Label>
				) : (
					<Label>{value}</Label>
				)
			},
		},
		{
			title: 'วันที่ใบแจ้งหนี้',
			dataIndex: 'paybillDate',
			key: 'paybillDate',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบี้ยรวม',
			dataIndex: 'premium',
			key: 'premium',
			align: 'center',
			width: 200,
		},
		{
			title: 'คอมมิชชั่น',
			dataIndex: 'com',
			key: 'com',
			align: 'center',
			width: 200,
		},
		{
			title: 'คืนเครดิต',
			dataIndex: 'discount',
			key: 'discount',
			align: 'center',
			width: 200,
		},
		{
			title: 'ยอดวางบิล',
			dataIndex: 'amountBill',
			key: 'amountBill',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return row.pathInv ? (
					<Label cursor='pointer' onClick={() => window.open(row.pathInv)}>
						{value}
					</Label>
				) : (
					<Label>{value}</Label>
				)
			},
		},
	]

	const dataFilter = dataList
		.filter((e) => {
			if (search)
				return (
					e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
					e.noInvoice.toLowerCase().indexOf(search.toLowerCase()) !== -1
				)
			return e
		})
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานสรุปรอบวางบิล</Label>
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
											onChange={handleChangSelect}
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
										<Button className='select-btn' onClick={handleFilter}>
											<SearchOutlined style={{ marginRight: '5px' }} />
											ค้นหา
										</Button>
									</Box>
								</Box>
								<Box className='filter-box'>
									<Box className='filter-input' width='200'>
										<Label>ค้นหา</Label>
										<Input
											name='search'
											placeholder='ค้นหา'
											isNotForm
											onChange={(e) => setSearch(e.target.value)}
										/>
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
							{ExportExcel(columns, dataFilter, select?.year, select?.month)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default Billing

const ExportExcel = (colHead, dataList, year, month) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานสรุปรอบวางบิล')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 30 },
			{ width: 15 },
			{ width: 20 },
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

		worksheet.getCell('A1').value = 'รายงานสรุปรอบวางบิล'
		worksheet.getCell('A1').font = { size: 20 }

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e) => {
			return [
				e.no,
				e.cuscode,
				e.name,
				e.noInvoice,
				e.paybillDate,
				e.premium,
				e.com,
				e.discount,
				e.amountBill,
			]
		})

		dataCell.push(header, ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				} else if (4 < il) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textRight
				}
			})
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานสรุปรอบวางบิล ${monthTitle.text}${year}`
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
