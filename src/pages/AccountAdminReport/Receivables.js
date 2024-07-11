import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { reportController } from '../../apiServices'
import { Box, Button, Container, Label, Table, Input } from '../../components'
import { isValidResponse, convertStrToFormat } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import _ from 'lodash'
import { saveAs } from 'file-saver'

const ReportReceivables = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const API = reportController()
		const res = await API.getReceivables()
		if (isValidResponse(res)) {
			dispatch(loadingAction(false))
			const { result } = res
			const sortResult = _.orderBy(
				result,
				['user_login', 'datestart'],
				['asc', 'asc']
			)
			const data = sortResult.map((el, i) => {
				return {
					key: i,
					cuscode: el.user_login,
					name: el.name,
					quoNum: el.quo_num,
					dateStart: moment(el.datestart).format('DD-MM-YYYY'),
					nameUser: el.lastname
						? `${el.nameuser} ${el.lastname}`
						: `${el.nameuser}`,
					company: el.company,
					company_prb: el.company_prb,
					idCar: el.idcar,
					insureType: el.insureType,
					premium: +el.amount,
					com: +el.commission,
					balance: +el.balance,
				}
			})
			setDataList(data)
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const columns = [
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
			title: 'เลขรายการ',
			dataIndex: 'quoNum',
			key: 'quoNum',
			align: 'center',
		},
		{
			title: 'วันที่แจ้งงาน',
			dataIndex: 'dateStart',
			key: 'dateStart',
			align: 'center',
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
		},
		{
			title: 'ทะเบียน',
			dataIndex: 'idCar',
			key: 'idCar',
			align: 'center',
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 200,
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.company}</Label>
						<Label>{row.company_prb}</Label>
					</Box>
				)
			},
		},
		{
			title: 'ประเภท',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.insureType}</Label>
						<Label>{row.company_prb !== null ? 'พ.ร.บ.' : ''}</Label>
					</Box>
				)
			},
		},
		{
			title: 'ยอดเบี้ยรวม',
			dataIndex: 'premium',
			key: 'premium',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'คอมมิชชั่น',
			dataIndex: 'com',
			key: 'com',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
		{
			title: 'ยอดรับชำระ',
			dataIndex: 'balance',
			key: 'balance',
			align: 'center',
			render: (value) => {
				return (
					<Label>{value ? convertStrToFormat(value, 'money_digit') : ''}</Label>
				)
			},
		},
	]

	const summaryRow = () => {
		const premiumTotal = dataFilter.reduce((acc, curr) => acc + curr.premium, 0)
		const comTotal = dataFilter.reduce((acc, curr) => acc + curr.com, 0)
		const balanceTotal = dataFilter.reduce((acc, curr) => acc + curr.balance, 0)

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
						{convertStrToFormat(premiumTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(comTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(balanceTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataFilter = dataList.filter((e) => {
		if (search)
			return (
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.quoNum.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.idCar.toLowerCase().indexOf(search.toLowerCase()) !== -1
			)
		return e
	})

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>รายงานลูกหนี้รายตัว</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box>
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
							{ExportExcel(dataFilter)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default ReportReceivables

const ExportExcel = (dataList) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานลูกหนี้รายตัว')

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 15 },
			{ width: 20 },
			{ width: 15 },
			{ width: 20 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
		]
		const textRight = { vertical: 'middle', horizontal: 'right' }

		worksheet.getCell('A1').value = 'รายงานลูกหนี้รายตัว'
		worksheet.getCell('A1').font = { size: 20 }

		let dataCell = []

		const header = [
			'ลำดับ',
			'เลขรายการ',
			'วันที่แจ้งงาน',
			'ชื่อลูกค้า',
			'ทะเบียน',
			'บริษัทประกัน',
			'ประเภท',
			'ยอดเบี้ยรวม',
			'คอมมิชชั่น',
			'ยอดรับชำระ',
		]
		const newDataList = []
		let groupData = _.groupBy(dataList, 'name')
		for (const [key, value] of Object.entries(groupData)) {
			newDataList.push({
				name: key,
				cuscode: value[0].cuscode,
				result: value,
				header: header,
			})
		}

		newDataList.forEach((e) => {
			dataCell.push([], ['', e.cuscode, e.name], e.header)
			const premiumTotals = e.result.reduce(
				(acc, curr) => acc + curr.premium,
				0
			)
			const comTotals = e.result.reduce((acc, curr) => acc + curr.com, 0)
			const balanceTotals = e.result.reduce(
				(acc, curr) => acc + curr.balance,
				0
			)
			e.result.forEach((el, il) => {
				if (il === e.result.length - 1) {
					dataCell.push(
						[
							il + 1,
							el.quoNum,
						  el.dateStart,
							el.nameUser,
							el.idCar,
							el.company && el.company_prb
								? `${el.company} ${el.company_prb}`
								: el.company
								? el.company
								: el.company_prb,
							el.company && el.company_prb
								? `พ.ร.บ. ${el.insureType}`
								: el.company
								? el.insureType
								: 'พ.ร.บ.',
							convertStrToFormat(el.premium.toFixed(2), 'money_digit'),
							convertStrToFormat(el.com.toFixed(2), 'money_digit'),
							convertStrToFormat(el.balance.toFixed(2), 'money_digit'),
						],
						[
							'',
							'',
							'',
							'',
							'',
							'',
							'รวม',
							convertStrToFormat(premiumTotals, 'money_digit'),
							convertStrToFormat(comTotals, 'money_digit'),
							convertStrToFormat(balanceTotals, 'money_digit'),
						]
					)
				} else {
					dataCell.push([
						il + 1,
						el.quoNum,
						el.dateStart,
						el.nameUser,
						el.idCar,
						el.company && el.company_prb
							? `${el.company} ${el.company_prb}`
							: el.company
							? el.company
							: el.company_prb,
						el.company && el.company_prb
							? `พ.ร.บ. ${el.insureType}`
							: el.company
							? el.insureType
							: 'พ.ร.บ.',
						convertStrToFormat(el.premium.toFixed(2), 'money_digit'),
						convertStrToFormat(el.com.toFixed(2), 'money_digit'),
						convertStrToFormat(el.balance.toFixed(2), 'money_digit'),
					])
				}
			})
		})

		dataCell.forEach((e, i) => (worksheet.getRow(2 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				if (6 < il) {
					worksheet.getRow(2 + i).getCell(1 + il).alignment = textRight
				}
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานลูกหนี้รายตัว ${moment(new Date()).format(
				'YYYY-MM-DD HH-mm'
			)}`
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
