import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { reportController, systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Input,
} from '../../components'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const OutstandingBalance = () => {
	const dispatch = useDispatch()
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [vifList, setVifList] = useState([])
	const [search, setSearch] = useState('')
	const [headDate, setHeadDate] = useState({
		titlefr: '',
		titlelt: '',
		startDate: '',
		fiftDate: '',
		sixtDate: '',
		endDate: '',
	})

	const fetchData = useCallback(
		async (endDate) => {
			dispatch(loadingAction(true))
			const dateNow = new Date()
			const currDay = moment(dateNow).format('DD')
			const currMonth = moment(dateNow).format('MM')
			const currYear = moment(dateNow).format('YYYY')
			const dateDf = moment(
				`${currYear}-${currMonth}-${currDay} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')

			const API = reportController()
			const res = await API.getOutstandingBalance(endDate || dateDf)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))
				const { result } = res
				const data = result.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						cuscode: e.user_login,
						name: e.name,
						status: e.is_payment_vif === 'no' ? 'Inactive' : 'Active',
						allOutbal: +e.amount_all,
						curOutbal: +e.cur_outbal,
						dateBegin: +e.monst_balance,
						dateEnd: +e.monlt_balance,
					}
				})
				setDataList(data)
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currentDate = moment(new Date()).format('DD')
		const currentMonth = moment(new Date()).format('MM')
		const currentYear = moment(new Date()).format('YYYY')
		const dateLastAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.daysInMonth()
		const monthAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('M/YYYY')
		const currMonthAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('MM')
		const currYearAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('YYYY')

		if (+currentDate <= 15) {
			setHeadDate({
				titlefr: `1-${+currentDate}/${+currentMonth}/${currentYear}`,
				titlelt: `16-${dateLastAgo}/${monthAgo}`,
				startDate: `${currentYear}-${currentMonth}-01 00:00:00`,
				fiftDate: `${currentYear}-${currentMonth}-${currentDate} 23:59:59`,
				sixtDate: `${currYearAgo}-${currMonthAgo}-16 00:00:00`,
				endDate: `${currYearAgo}-${currMonthAgo}-${dateLastAgo} 23:59:59`,
			})
		} else {
			setHeadDate({
				titlefr: `16-${currentDate}/${+currentMonth}/${currentYear}`,
				titlelt: `1-15/${+currentMonth}/${currentYear}`,
				startDate: `${currentYear}-${currentMonth}-16 00:00:00`,
				fiftDate: `${currentYear}-${currentMonth}-${currentDate} 23:59:59`,
				sixtDate: `${currentYear}-${currentMonth}-01 00:00:00`,
				endDate: `${currentYear}-${currentMonth}-15 23:59:59`,
			})
		}
		setSelect((e) => ({
			...e,
			month: currentMonth,
			year: currentYear,
		}))
		fetchData()
		Promise.all([LIST.VIF_ACTIVE()]).then((e) => setVifList(e[0]))
	}, [fetchData])

	const handleChangSelect = (v, even, obj) => {
		const { name } = obj
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const handleFilter = async () => {
		const dayOfMonth = moment(`${select.year}-${select.month}`).daysInMonth()
		let endDatefr = moment(
			`${select.year}-${select.month}-${dayOfMonth} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		const currentDate = moment(new Date()).format('DD')
		const currentMonth = moment(new Date()).format('MM')
		const currentYear = moment(new Date()).format('YYYY')
		const dateLastAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.daysInMonth()
		const monthAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('M/YYYY')
		const currMonthAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('MM')
		const currYearAgo = moment(`${currentYear}-${currentMonth}`)
			.add(-1, 'months')
			.format('YYYY')

		if (currentMonth <= select?.month) {
			if (+currentDate <= 15) {
				setHeadDate({
					titlefr: `1-${+currentDate}/${+currentMonth}/${currentYear}`,
					titlelt: `16-${dateLastAgo}/${monthAgo}`,
					startDate: `${currentYear}-${currentMonth}-01 00:00:00`,
					fiftDate: `${currentYear}-${currentMonth}-${currentDate} 23:59:59`,
					sixtDate: `${currYearAgo}-${currMonthAgo}-16 00:00:00`,
					endDate: `${currYearAgo}-${currMonthAgo}-${dateLastAgo} 23:59:59`,
				})
			} else {
				setHeadDate({
					titlefr: `16-${currentDate}/${+currentMonth}/${currentYear}`,
					titlelt: `1-15/${+currentMonth}/${currentYear}`,
					startDate: `${currentYear}-${currentMonth}-16 00:00:00`,
					fiftDate: `${currentYear}-${currentMonth}-${currentDate} 23:59:59`,
					sixtDate: `${currentYear}-${currentMonth}-01 00:00:00`,
					endDate: `${currentYear}-${currentMonth}-15 23:59:59`,
				})
			}
		} else {
			setHeadDate({
				titlefr: `16-${dayOfMonth}/${+select.month}/${select.year}`,
				titlelt: `1-15/${+select.month}/${select.year}`,
				startDate: `${select.year}-${select.month}-16 00:00:00`,
				fiftDate: `${select.year}-${select.month}-${dayOfMonth} 23:59:59`,
				sixtDate: `${select.year}-${select.month}-01 00:00:00`,
				endDate: `${select.year}-${select.month}-15 23:59:59`,
			})
		}

		await fetchData(endDatefr)
	}

	const handleExportPay = async (dateStatus, cuscode, name, amount) => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายการค้างชำระ')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 20 },
			{ width: 20 },
			{ width: 15 },
			{ width: 25 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		let startDate
		let endDate
		const curentDaylastMonth = moment(`${select?.year}-${select?.month}`)
			.subtract(0, 'months')
			.endOf('month')
			.format('DD')
		const monthNow = moment(new Date()).format('MM')
		const yearNow = moment(new Date()).format('YYYY')
		const dateCurrBill = moment(`${yearNow}-${monthNow - 1}`)
			.subtract(0, 'months')
			.endOf('month')
			.format('DD')
		const currDay = moment(new Date()).format('D')
		const monthTitle = LIST.MONTH.find((e) => e.value === select?.month)
		if (dateStatus === 'allDate') {
			startDate = moment(`2021-09-01 00:00:00`).format('YYYY-MM-DD HH:mm:ss')
			endDate = moment(
				`${select?.year}-${select?.month}-${curentDaylastMonth} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')
		} else if (dateStatus === 'curOutbal') {
			startDate = moment(`2021-09-01 00:00:00`).format('YYYY-MM-DD HH:mm:ss')
			if (currDay > 10) {
				endDate = moment(`${yearNow}-${monthNow}-15 23:59:59`).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			} else {
				endDate = moment(
					`${yearNow}-${monthNow - 1}-${dateCurrBill} 23:59:59`
				).format('YYYY-MM-DD HH:mm:ss')
			}
		} else if (dateStatus === 'startDate') {
			startDate = headDate.startDate
			endDate = headDate.fiftDate
		} else if (dateStatus === 'lastDate') {
			startDate = headDate.sixtDate
			endDate = headDate.endDate
		}

		worksheet.getCell('A1').value = 'รายการค้างชำระ'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `${cuscode} ${name}`
		worksheet.getCell('A3').value = `ช่วงเวลา ${moment(startDate).format(
			'D'
		)}-${moment(endDate).format('D')} ${monthTitle.text} ${select?.year}`
		worksheet.getCell('A4').value = `ยอดค้างชำระ ${convertStrToFormat(
			amount ? amount.toFixed(2) : '',
			'money_digit'
		)} บาท`

		let dataCell = []

		const params = { cuscode, startDate, endDate }
		const API = systemController()
		const res = await API.getCheckPayVif(params)
		if (isValidResponse(res)) {
			const { result } = res
			const header = [
				'ลำดับ',
				'เลขที่รายการ',
				'วันทีแจ้งงาน',
				'ชื่อลูกค้า',
				'ทะเบียน',
				'บริษัทประกัน',
				'ประเภท',
				'ยอดเบี้ยรวม',
				'ค่าคอมมิชชั่น',
				'ยอดชำระ',
			]

			const newDataList = result.map((e, i) => {
				let company = `${e.company_prb ? e.company_prb : ''}${
					e.company ? ' ' + e.company : ''
				}`
				let type = `${e.company_prb ? 'พ.ร.บ.' : ''}${
					e.insureType ? ' ' + e.insureType : ''
				}`
				return [
					i + 1,
					e.quo_num,
					e.datestart,
					e.lastname ? `${e.name} ${e.lastname}` : `${e.name}`,
					e.idcar,
					company,
					type,
					convertStrToFormat(e.amount || '0', 'money_digit'),
					convertStrToFormat(e.commission || '0', 'money_digit'),
					convertStrToFormat(e.balance || '0', 'money_digit'),
				]
			})

			// setSummary
			const amountTotal = result.reduce((acc, curr) => acc + +curr.amount, 0)
			const commissionTotal = result.reduce(
				(acc, curr) => acc + +curr.commission,
				0
			)
			const balanceTotal = result.reduce((acc, curr) => acc + +curr.balance, 0)

			dataCell.push(header, ...newDataList, [
				'รวม',
				'',
				'',
				'',
				'',
				'',
				'',
				convertStrToFormat(amountTotal, 'money_digit'),
				convertStrToFormat(commissionTotal, 'money_digit'),
				convertStrToFormat(balanceTotal, 'money_digit'),
			])
			dataCell.forEach((e, i) => (worksheet.getRow(6 + i).values = e))

			dataCell.forEach((e, i) => {
				e.forEach((el, il) => {
					worksheet.getRow(6 + i).getCell(1 + il).border = borders

					if (i === 0) {
						worksheet.getRow(6 + i).getCell(1 + il).alignment = textCenter
					} else if (6 < il && i !== 0) {
						worksheet.getRow(6 + i).getCell(1 + il).alignment = textRight
					}
				})
				if (dataCell.length - 1 === i) {
					worksheet.mergeCells(`A${6 + i}`, `G${6 + i}`)
				}
			})

			worksheet.columns = columns

			workbook.xlsx.writeBuffer().then((data) => {
				const blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				})
				let nameFile = `รายการค้างชำระ ${moment(startDate).format(
					'D'
				)}-${moment(endDate).format('D')} ${monthTitle.text}${select?.year}`
				saveAs(blob, nameFile)
			})
		}
	}

	const columns = [
		{
			title: 'No.',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
		},
		{
			title: 'รหัสตรอ.',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
		},
		{
			title: 'ชื่อร้าน',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
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
			title: 'ยอดค้างชำระทั้งหมด',
			dataIndex: 'allOutbal',
			key: 'allOutbal',
			align: 'center',
			render: (value, row) => {
				return (
					<Label
						cursor='pointer'
						onClick={() =>
							handleExportPay('allDate', row.cuscode, row.name, value)
						}
					>
						{value ? convertStrToFormat(value, 'money_digit') : ''}
					</Label>
				)
			},
		},
		{
			title: 'ยอดค้างทั้งหมดดีลปัจจุบัน',
			dataIndex: 'curOutbal',
			key: 'curOutbal',
			align: 'center',
			render: (value, row) => {
				return (
					<Label
						cursor='pointer'
						onClick={() =>
							handleExportPay('curOutbal', row.cuscode, row.name, value)
						}
					>
						{value ? convertStrToFormat(value, 'money_digit') : ''}
					</Label>
				)
			},
		},
		{
			title: `วันที่แจ้งงาน ${headDate.titlefr}`,
			dataIndex: 'dateBegin',
			key: 'dateBegin',
			align: 'center',
			render: (value, row) => {
				return (
					<Label
						cursor='pointer'
						onClick={() =>
							handleExportPay('startDate', row.cuscode, row.name, value)
						}
					>
						{value ? convertStrToFormat(value, 'money_digit') : ''}
					</Label>
				)
			},
		},
		{
			title: `วันที่แจ้งงาน ${headDate.titlelt}`,
			dataIndex: 'dateEnd',
			key: 'dateEnd',
			align: 'center',
			render: (value, row) => {
				return (
					<Label
						cursor='pointer'
						onClick={() =>
							handleExportPay('lastDate', row.cuscode, row.name, value)
						}
					>
						{value ? convertStrToFormat(value, 'money_digit') : ''}
					</Label>
				)
			},
		},
	]

	const dataFilter = dataList
		.filter((e) => {
			if (select?.cuscode) return e.cuscode === select?.cuscode
			if (search)
				return (
					e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
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

	const summaryRow = () => {
		const allOutbalTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.allOutbal,
			0
		)
		const curOutbalTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.curOutbal,
			0
		)
		const dateBeginTotal = dataFilter.reduce(
			(acc, curr) => acc + curr.dateBegin,
			0
		)
		const dateEndTotal = dataFilter.reduce((acc, curr) => acc + curr.dateEnd, 0)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(allOutbalTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(curOutbalTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(dateBeginTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(dateEndTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานสรุปยอดค้างชำระ</Label>
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
										<Label>ตรอ.</Label>
										<Select
											name='cuscode'
											placeholder='เลือกตรอ.'
											value={select?.cuscode}
											options={vifList}
											onChange={handleChangSelect}
                      showSearch
											allowClear
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
								summary={summaryRow}
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

export default OutstandingBalance

const ExportExcel = (colHead, dataList, year, month) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานสรุปยอดค้างชำระ')

		const columns = [
			{ width: 10 },
			{ width: 20 },
			{ width: 35 },
			{ width: 20 },
			{ width: 25 },
			{ width: 25 },
			{ width: 25 },
			{ width: 25 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = 'รายงานสรุปยอดค้างชำระ'
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
				e.status,
				convertStrToFormat(e.allOutbal ? e.allOutbal : '0', 'money_digit'),
				convertStrToFormat(e.curOutbal ? e.curOutbal : '0', 'money_digit'),
				convertStrToFormat(e.dateBegin ? e.dateBegin : '0', 'money_digit'),
				convertStrToFormat(e.dateEnd ? e.dateEnd : '0', 'money_digit'),
			]
		})

		// setSummary
		const allOutbalTotal = dataList.reduce(
			(acc, curr) => acc + curr.allOutbal,
			0
		)
		const curOutbalTotal = dataList.reduce(
			(acc, curr) => acc + curr.curOutbal,
			0
		)
		const dateBeginTotal = dataList.reduce(
			(acc, curr) => acc + curr.dateBegin,
			0
		)
		const dateEndTotal = dataList.reduce((acc, curr) => acc + curr.dateEnd, 0)

		dataCell.push(header, ...newDataList, [
			'รวม',
			'',
			'',
			'',
			convertStrToFormat(allOutbalTotal ? allOutbalTotal : '0', 'money_digit'),
			convertStrToFormat(curOutbalTotal ? curOutbalTotal : '0', 'money_digit'),
			convertStrToFormat(dateBeginTotal ? dateBeginTotal : '0', 'money_digit'),
			convertStrToFormat(dateEndTotal ? dateEndTotal : '0', 'money_digit'),
		])

		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				} else if (3 < il && il < 8 && i !== 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textRight
				}
			})
			if (dataCell.length - 1 === i) {
				worksheet.mergeCells(`A${3 + i}`, `D${3 + i}`)
			}
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานสรุปยอดค้างชำระ ${monthTitle.text}${year}`
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
