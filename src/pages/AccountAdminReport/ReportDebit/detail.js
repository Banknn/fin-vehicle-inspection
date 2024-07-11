import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Input,
} from '../../../components'
import { convertStrToFormat, LIST } from '../../../helpers'
import { TableComponent } from '../../../components/Table/styled'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

const ReportDebitDetail = () => {
	const creditList = useSelector((state) => state.creditListReducer)
	const [select, setSelect] = useState({})
	const [qDebitList, setQDebitList] = useState([])
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')
	const [sumaryObj, setSumaryObj] = useState({})

	useEffect(() => {
		const { qDebit, qList, select, sumary } = creditList
		const data1 = qDebit.map((e, i) => {
			return {
				key: i,
				invoiceNo: e.invoice_no,
				dateAdd: e.date_add,
				amount: convertStrToFormat(e.credit || '0', 'money_digit'),
				pathCredit: e.path_credit,
			}
		})
		const data2 = qList.map((e, i) => {
			return {
				key: i,
				no: i + 1,
				...e,
			}
		})
		setQDebitList(data1)
		setDataList(data2)
		setSelect(select)
		setSumaryObj(sumary)
	}, [creditList])

	const columnsDebit = [
		{
			title: 'เลขรายการ',
			dataIndex: 'invoiceNo',
			key: 'invoiceNo',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(row.pathCredit)}
					>
						{value}
					</Label>
				)
			},
		},
		{
			title: 'ยอดเงิน',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			width: 200,
		},
		{
			title: 'วันที่เติมเงิน',
			dataIndex: 'dateAdd',
			key: 'dateAdd',
			align: 'center',
			width: 200,
		},
	]

	const columnsList = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
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
			width: 120,
		},
		{
			title: 'เลขFIN',
			dataIndex: 'idFin',
			key: 'idFin',
			align: 'center',
			width: 120,
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 200,
		},
		{
			title: 'บริษัทพรบ',
			dataIndex: 'company_prb',
			key: 'company_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 200,
		},
		{
			title: 'ประเภท',
			dataIndex: 'insureType',
			key: 'insureType',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.company_prb !== null ? 'พ.ร.บ.' : ''}</Label>
						<Label>{row.insureType}</Label>
					</Box>
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

	const dataFilter = dataList.filter((e) => {
		if (search)
			return (
				e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.idFq.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.idFin.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.nameUser.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	const summaryRow = () => {
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
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>
						ยอดยกมาเดือนนี้
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sumaryObj?.summary || '0', 'money_digit')}
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
					<TableComponent.Summary.Cell>คงเหลือ</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>
						{convertStrToFormat(
							sumaryObj?.summary - sumInsPrbTotal || '0',
							'money_digit'
						)}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายละเอียดการเติมเงิน</Label>
					<Box className='report-wrapper'>
						<Box>
							<Box className='filter-box'>
								<Box className='daily-price'>
									<Label className='title-daily-price' noLine>
										ยอดเติมเงิน
									</Label>
									<Label className='show-daily-price'>
										{convertStrToFormat(
											sumaryObj?.amount || '0',
											'money_digit'
										)}
									</Label>
								</Box>
								<Box className='daily-price'>
									<Label className='title-daily-price' noLine>
										ยอดยกมาเดือนก่อน
									</Label>
									<Label className='show-daily-price'>
										{convertStrToFormat(
											sumaryObj?.bringForward || '0',
											'money_digit'
										)}
									</Label>
								</Box>
								<Box className='daily-price'>
									<Label className='title-daily-price' noLine>
										รวม
									</Label>
									<Label className='show-daily-price'>
										{convertStrToFormat(
											sumaryObj?.summary || '0',
											'money_digit'
										)}
									</Label>
								</Box>
							</Box>
						</Box>
						<Box className='report-table-left'>
							<Table
								columns={columnsDebit}
								dataSource={qDebitList}
								className='report-data-table'
								size='middle'
							/>
						</Box>
						<Box style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Box className='filter-box'>
								<Box
									className='filter-input'
									width='200'
									style={{ margin: '10px' }}
								>
									<Label>รหัสตรอ</Label>
									<Input name='cuscode' value={select?.cuscode} disabled />
								</Box>
								<Box
									className='filter-input'
									width='200'
									style={{ margin: '10px' }}
								>
									<Label>ชื่อตรอ</Label>
									<Input name='name' value={select?.name} disabled />
								</Box>
							</Box>
							<Box className='filter-box'>
								<Box
									className='filter-input'
									width='200'
									style={{ margin: '10px' }}
								>
									<Label>เดือน</Label>
									<Select
										name='month'
										value={select?.month}
										placeholder='เลือกเดือน'
										options={LIST.MONTH}
										notvalue
										disabled
									/>
								</Box>
								<Box
									className='filter-input'
									width='200'
									style={{ margin: '10px' }}
								>
									<Label>ปี</Label>
									<Select
										name='year'
										value={`${select?.year} / ${Number(select?.year) + 543}`}
										placeholder='เลือกปี'
										options={LIST.YEAR()}
										notvalue
										disabled
									/>
								</Box>
								<Box
									className='filter-input'
									width='200'
									style={{ margin: '10px' }}
								>
									<Label>ค้นหา</Label>
									<Input
										name='search'
										placeholder='ค้นหา'
										onChange={(e) => setSearch(e.target.value)}
									/>
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								columns={columnsList}
								dataSource={dataFilter}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(
								columnsDebit,
								qDebitList,
								dataFilter,
								select,
								sumaryObj
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default ReportDebitDetail

const ExportExcel = (columnsDebit, qDebitList, dataList, select, sumaryObj) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายละเอียดการเติมเงิน')

		let columns = []
		for (let i = 0; i <= 18; i++) {
			columns.push({ width: 20 })
		}

		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }

		worksheet.getCell('A1').value = 'รายละเอียดการเติมเงิน'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `รหัสตรอ ${select.cuscode}`
		worksheet.getCell('A3').value = `ชื่อตรอ ${select.name}`

		const header1 = columnsDebit.map((e) => {
			return e.title
		})
		const header2 = [
			'ลำดับ',
			'เลขทะเบียนรถ',
			'เลขที่FQ',
			'เลขFIN',
			'ชื่อลูกค้า',
			'ประเภทประกัน',
			'บริษัทพรบ',
			'บริษัทประกัน',
			'ราคาพรบ',
			'ราคาประกัน',
			'ประเภท',
			'ส่วนลดพรบ',
			'ส่วนลดประกัน',
			'ราคารวม',
			'วันที่แจ้งงาน',
			'สถานะ',
			'วันที่เริ่มคุ้มครอง',
			'วันที่สิ้นสุดคุ้มครอง',
		]

		let newDataList1 = qDebitList.map((e) => [e.invoiceNo, e.amount, e.dateAdd])
		let newDataList2 = dataList.map((e, i) => {
			return [
				i + 1,
				e.idcar,
				e.idFq,
				e.idFin,
				e.nameUser,
				e.type_insure,
				e.company_prb,
				e.company,
				e.company_prb !== null ? `พ.ร.บ. ${e.insureType || ''}` : e.insureType,
				e.show_price_prb,
				e.show_price_ins,
				e.com_prb,
				e.com_ins,
				e.summary_ins_prb,
				e.datestart,
				e.status,
				e.date_warranty,
				e.date_exp,
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

		let dataCell = []
		let dataCell2 = []
		let dataCell3 = []
		dataCell.push(
			['ยอดเติมเงิน', 'ยอดยกมาเดือนก่อน', 'ยอดใช้งานเดือนนี้', 'คงเหลือ'],
			[
				sumaryObj?.amount,
				sumaryObj?.bringForward,
				sumInsPrbTotal,
				sumaryObj?.summary - sumInsPrbTotal,
			]
		)
		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell2.push(header1, ...newDataList1)
		dataCell2.forEach((e, i) => (worksheet.getRow(8 + i).values = e))
		dataCell2.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(8 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(8 + i).getCell(1 + il).alignment = textCenter
				}
			})
		})

		dataCell3.push(header2, ...newDataList2, [
			'รวม',
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
		])
		dataCell3.forEach(
			(e, i) => (worksheet.getRow(10 + dataCell2.length + i).values = e)
		)
		dataCell3.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(10 + dataCell2.length + i).getCell(1 + il).border =
					borders

				if (i === 0) {
					worksheet.getRow(10 + dataCell2.length + i).getCell(1 + il).alignment =
						textCenter
				}
			})
		})

		const monthTitle = LIST.MONTH.find((e) => e.value === select.month)
		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานการเติมเงิน ${monthTitle.text}${select.year}`
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
