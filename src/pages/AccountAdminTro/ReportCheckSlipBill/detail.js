import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'antd'
import {
	Box,
	Label,
	Button,
	Table as TableCustom,
	Modal as ModalCustom,
	Icons,
	Container,
} from '../../../components'
import { convertStrToFormat, isValidResponse } from '../../../helpers'
import { reportController } from '../../../apiServices'
import { THEME } from '../../../themes'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const DetailCheckSlipBill = () => {
	const dataBillList = useSelector((state) => state.detailSlipBillReducer)
	const [dataListFile, setDataListFile] = useState([])

	const modalFile = useRef(null)

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
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
			width: 250,
			render: (value) => {
				const handleFileBill = async () => {
					const API = reportController()
					const res = await API.getDetailFileHistory(value)
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

				return (
					<Label color='blue' cursor='pointer' onClick={handleFileBill}>
						{value}
					</Label>
				)
			},
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
			title: 'วันที่บิล',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 200,
		},
		{
			title: 'รหัสคีย์งาน',
			dataIndex: 'id_key',
			key: 'id_key',
			align: 'center',
			width: 200,
		},
	]

	const dataFilter = dataBillList?.dataList?.map((e, i) => {
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
					<Label className='title-form'>รายละเอียดแนบสลิปบิล</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Box
								className='filter-table-box'
								style={{ justifyContent: 'space-between' }}
							>
								<Box className='filter-item'>
									<Label style={{ fontSize: '16px' }}>
										<strong>เลขรายการสลิป:</strong> {dataBillList.inv_no}{' '}
										<strong>ยอดชำระรวม:</strong> {dataBillList.price_total}{' '}
										<br />
										<strong>รหัสตรอ:</strong> {dataBillList.cuscode}{' '}
										<strong>ชื่อตรอ:</strong> {dataBillList.name}{' '}
									</Label>
								</Box>
								<Box className='filter-item'>
									{ExportExcel(columns, dataFilter, dataBillList)}
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

export default DetailCheckSlipBill

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

const ExportExcel = (colHead, dataList, dataBillList) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายละเอียดแนบสลิปบิล')

		const columns = [
			{ width: 10 },
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

		worksheet.getCell('A1').value = 'รายละเอียดแนบสลิปบิล'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `เลขรายการ ${dataBillList.inv_no}`
		worksheet.getCell('A3').value = `รหัสตรอ ${dataBillList.cuscode}`
		worksheet.getCell('A4').value = `ชื่อตรอ ${dataBillList.name}`
		worksheet.getCell('A5').value = `ยอดชำระรวม ${dataBillList.price_total}`

		let dataCell = []

		const header = colHead
			.filter((e) => e.key !== 'path_slip')
			.map((e) => {
				return e.title
			})

		const newDataList = dataList.map((e) => {
			return [
				e.no,
				e.bill_num,
				convertStrToFormat(e.price_total, 'money_digit'),
				e.date,
				e.id_key,
			]
		})

		dataCell.push([...header], ...newDataList)

		dataCell.forEach((e, i) => (worksheet.getRow(7 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(7 + i).getCell(1 + il).border = borders
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายละเอียดแนบสลิปบิล`
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
