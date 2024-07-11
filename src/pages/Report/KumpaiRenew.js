import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { reportController } from '../../apiServices'
import { Box, Button, Container, Input, Label, Table } from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const KumpaiRenew = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))

		const API = reportController()
		const res = await API.getPriceRenewKumpai()
		if (isValidResponse(res)) {
			const { result } = res
			let data = result.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					...e,
					idcar: convertStrToFormat(e.idcar, 'idcar'), 
          date_warranty: moment(e.date_warranty).format('DD-MM-YYYY') ,
          date_exp: moment(e.date_exp).format('DD-MM-YYYY') ,
				}
			})
			setReportData(data)
			dispatch(loadingAction(false))
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
		},
		{
			title: 'เลขที่รายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
		},
		{
			title: 'วันที่เริ่มคุ้มครอง',
			dataIndex: 'date_warranty',
			key: 'date_warranty',
			align: 'center',
		},
		{
			title: 'วันที่สิ้นสุดคุ้มครอง',
			dataIndex: 'date_exp',
			key: 'date_exp',
			align: 'center',
		},
		{
			title: 'เลขทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'จังหวัดป้ายทะเบียน',
			dataIndex: 'carprovince',
			key: 'carprovince',
			align: 'center',
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
		},
		{
			title: 'เบอร์โทรศัพท์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'phone_number') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			render: (value, row) => {
				return (
					<Label>
						{value}
						<br />
						{row.insureType}
					</Label>
				)
			},
		},
		{
			title: 'เบี้ยรวม',
			dataIndex: 'amount_inc',
			key: 'amount_inc',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
	]

	const dataList = reportData.filter(
		(e) => e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1
	)

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>
					เช็คเบี้ยต่ออายุคุ้มภัย (ลูกค้าเก่า)
				</Label>
				<Box className='report-wrapper'>
					<Box className='filter-table-box'>
						<Box className='filter-item'>
							<Label className='filter-label'>ค้นหา</Label>
							<Input
								name='search'
								placeholder='ค้นหาเลขทะเบียน'
								isNotForm
								onChange={(e) => setSearch(e.target.value)}
							/>
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
						{ExportExcel(columns, dataList)}
					</Box>
				</Box>
			</Box>
		</Container>
	)
}
export default KumpaiRenew

const ExportExcel = (colHead, dataList) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet(
			'เช็คเบี้ยต่ออายุคุ้มภัย (ลูกค้าเก่า)'
		)

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 30 },
			{ width: 15 },
			{ width: 35 },
			{ width: 15 },
		]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }

		worksheet.getCell('A1').value = 'เช็คเบี้ยต่ออายุคุ้มภัย (ลูกค้าเก่า)'
		worksheet.getCell('A1').font = { size: 20 }

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e, i) => {
			return [
				i + 1,
				e.quo_num,
				e.date_warranty,
				e.date_exp,
				e.idcar,
				e.carprovince,
				e.nameUser,
        convertStrToFormat(e.tel, 'phone_number'),
				e.company + ' ' + e.insureType,
			  convertStrToFormat(e.amount_inc, 'money_digit'),
			]
		})

		dataCell.push(header, ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(3 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(3 + i).getCell(1 + il).border = borders
				if (i === 0) {
					worksheet.getRow(3 + i).getCell(1 + il).alignment = textCenter
				}
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = 'เช็คเบี้ยต่ออายุคุ้มภัย (ลูกค้าเก่า)'
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
