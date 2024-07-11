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
	DatePicker,
	Input,
} from '../../components'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { TableComponent } from '../../components/Table/styled'
import { loadingAction } from '../../actions'
import Excel from 'exceljs'
import { Col, Row } from 'antd'
import { saveAs } from 'file-saver'

const SystemPayInsurance = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [type, setType] = useState('isAll')
	const [company, setCompany] = useState()
	const [channel, setChannel] = useState('1')
	const [search, setSearch] = useState('')
	const [dataList, setDataList] = useState([])
	const [dataClassifyList, setDataClassifyList] = useState([])
	const [columnsFilter, setColumnsFilter] = useState('')
	const [typeFilter, setTypeFilter] = useState('isAll')
	const [level, setLevel] = useState('isAll')
	const [fieldError, setFieldError] = useState({})
	const [countUserDebit, setcountUserDebit] = useState('0')
	const columns = [
		{
			value: [
				{
					title: 'ลำดับ',
					dataIndex: 'no',
					key: 'no',
					align: 'center',
					width: 50,
				},
				{
					title: 'รหัสนายหน้า',
					dataIndex: 'cuscode',
					key: 'cuscode',
					align: 'center',
					width: 230,
				},
				{
					title: 'ชื่อตรอ.',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
					width: 400,
				},
				{
					title: 'Sale Member',
					dataIndex: 'member',
					key: 'member',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการทั้งหมด',
					dataIndex: 'countQuoNum',
					key: 'countQuoNum',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการพ.ร.บ.',
					dataIndex: 'countCompanyPrb',
					key: 'countCompanyPrb',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการประกัน',
					dataIndex: 'countCompany',
					key: 'countCompany',
					align: 'center',
					width: 200,
				},
				{
					title: 'เบี้ยรวมพ.ร.บ.',
					dataIndex: 'pricePrb',
					key: 'pricePrb',
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
					title: 'เบี้ยรวมประกัน',
					dataIndex: 'priceIns',
					key: 'priceIns',
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
					title: 'คอมพ.ร.บ.',
					dataIndex: 'comPrb',
					key: 'comPrb',
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
					title: 'คอมประกัน',
					dataIndex: 'comIns',
					key: 'comIns',
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
					title: 'ยอดรวมประกัน+พรบ',
					dataIndex: 'sumPrbIns',
					key: 'sumPrbIns',
					align: 'center',
					width: 200,
					sorter: (a, b) => a.sumPrbIns - b.sumPrbIns,
					render: (value) => {
						return (
							<Label>
								{value ? convertStrToFormat(value, 'money_digit') : '-'}
							</Label>
						)
					},
				},
			],
		},
		{
			value: [
				{
					title: 'ลำดับ',
					dataIndex: 'no',
					key: 'no',
					align: 'center',
					width: 50,
				},
				{
					title: 'รหัสนายหน้า',
					dataIndex: 'cuscode',
					key: 'cuscode',
					align: 'center',
					width: 230,
				},
				{
					title: 'ชื่อตรอ.',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
					width: 400,
				},
				{
					title: 'Sale Member',
					dataIndex: 'member',
					key: 'member',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการทั้งหมด',
					dataIndex: 'countQuoNum',
					key: 'countQuoNum',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการพ.ร.บ.',
					dataIndex: 'countCompanyPrb',
					key: 'countCompanyPrb',
					align: 'center',
					width: 200,
				},
				{
					title: 'เบี้ยรวมพ.ร.บ.',
					dataIndex: 'pricePrb',
					key: 'pricePrb',
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
					title: 'คอมพ.ร.บ.',
					dataIndex: 'comPrb',
					key: 'comPrb',
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
			],
		},
		{
			value: [
				{
					title: 'ลำดับ',
					dataIndex: 'no',
					key: 'no',
					align: 'center',
					width: 50,
				},
				{
					title: 'รหัสนายหน้า',
					dataIndex: 'cuscode',
					key: 'cuscode',
					align: 'center',
					width: 230,
				},
				{
					title: 'ชื่อตรอ.',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
					width: 400,
				},
				{
					title: 'Sale Member',
					dataIndex: 'member',
					key: 'member',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการทั้งหมด',
					dataIndex: 'countQuoNum',
					key: 'countQuoNum',
					align: 'center',
					width: 200,
				},
				{
					title: 'รายการประกัน',
					dataIndex: 'countCompany',
					key: 'countCompany',
					align: 'center',
					width: 200,
				},
				{
					title: 'เบี้ยรวมประกัน',
					dataIndex: 'priceIns',
					key: 'priceIns',
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
					title: 'คอมประกัน',
					dataIndex: 'comIns',
					key: 'comIns',
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
			],
		},
		{
			value: [
				{
					title: 'ระบบ',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
					width: 150,
				},
				{
					title: 'พรบ',
					dataIndex: 'numPrb',
					key: 'numPrb',
					align: 'center',
					width: 150,
				},
				{
					title: 'กรมธรรม์',
					dataIndex: 'numIns',
					key: 'numIns',
					align: 'center',
					width: 150,
				},
				{
					title: 'รวม',
					dataIndex: 'sumPrbIns',
					key: 'sumPrbIns',
					align: 'center',
					width: 150,
				},
			],
		},
	]

	const fetchData = useCallback(
		async (
			startDateFl,
			endDateFl,
			typeFl,
			companyFl,
			columnsFl,
			channelFl,
			levelFL
		) => {
			dispatch(loadingAction(true))
			const params = {
				startDate: startDateFl,
				endDate: endDateFl,
				company: typeFl === 'isAll' ? '' : companyFl,
				type: typeFl || 'isAll',
				channel: channelFl,
				level: levelFL || 'isAll',
			}

			const API = reportController()
			const res = await API.getSalesPrbInsVif(params)
			const res2 = await API.getReportClassifyDebitCredit(params)
			if (isValidResponse(res) || isValidResponse(res2)) {
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
				columnsFl &&
					setColumnsFilter(
						typeFl === 'prb'
							? columnsFl[1].value
							: typeFl === 'insure'
							? columnsFl[2].value
							: columnsFl[0].value
					)
				setTypeFilter(typeFl || 'isAll')

				const { counts, classifyDebitCredit } = res2.result
				const data2 = classifyDebitCredit.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						name: e.name,
						numPrb: convertStrToFormat(e.numPrb.toFixed(2), 'money_digit'),
						numIns: convertStrToFormat(e.numIns.toFixed(2), 'money_digit'),
						sumPrbIns: convertStrToFormat(
							(+e.numPrb + +e.numIns).toFixed(2),
							'money_digit'
						),
					}
				})

				setcountUserDebit(counts.countDebit)
				setDataClassifyList(data2)
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
		fetchData(startDateFl, endDateFl)
	}, [fetchData])

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if ((type === 'prb' && !company) || (type === 'insure' && !company)) {
			formIsValid = false
			errors['company'] = 'กรุณาเลือกบริษัทประกัน'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const stDate = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const enDate = moment(`${endSelected} 23:59:59`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		if (validateFields()) {
			await fetchData(stDate, enDate, type, company, columns, channel, level)
		}
	}

	const data = dataList
		.filter(
			(e) =>
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
		)
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	const summaryRow = (pageData) => {
		const countQuoNum = pageData.reduce(
			(acc, curr) => acc + curr.countQuoNum,
			0
		)
		const countCompanyPrb = pageData.reduce(
			(acc, curr) => acc + curr.countCompanyPrb,
			0
		)
		const countCompany = pageData.reduce(
			(acc, curr) => acc + curr.countCompany,
			0
		)
		const pricePrb = pageData.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceIns = pageData.reduce((acc, curr) => acc + curr.priceIns, 0)
		const comPrb = pageData.reduce((acc, curr) => acc + curr.comPrb, 0)
		const comIns = pageData.reduce((acc, curr) => acc + curr.comIns, 0)
		const sumPrbIns = pageData.reduce((acc, curr) => acc + curr.sumPrbIns, 0)

		// setSummary
		const countQuoNumTotal = data.reduce(
			(acc, curr) => acc + curr.countQuoNum,
			0
		)
		const countCompanyPrbTotal = data.reduce(
			(acc, curr) => acc + curr.countCompanyPrb,
			0
		)
		const countCompanyTotal = data.reduce(
			(acc, curr) => acc + curr.countCompany,
			0
		)
		const pricePrbTotal = data.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceInsTotal = data.reduce((acc, curr) => acc + curr.priceIns, 0)
		const comPrbTotal = data.reduce((acc, curr) => acc + curr.comPrb, 0)
		const comInsTotal = data.reduce((acc, curr) => acc + curr.comIns, 0)
		const sumPrbInsTotal = data.reduce((acc, curr) => acc + curr.sumPrbIns, 0)

		return (
			<TableComponent.Summary>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{countQuoNum}
					</TableComponent.Summary.Cell>
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{countCompanyPrb}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{countCompany}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(pricePrb.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(priceIns.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(comPrb.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(comIns.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
					{typeFilter === 'isAll' && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(sumPrbIns.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
				</TableComponent.Summary.Row>
				<TableComponent.Summary.Row style={{ textAlign: 'center' }}>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell>รวมทั้งหมด</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{countQuoNumTotal || '0'}
					</TableComponent.Summary.Cell>
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{countCompanyPrbTotal || '0'}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{countCompanyTotal || '0'}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(
								pricePrbTotal ? pricePrbTotal.toFixed(2) : '0',
								'money_digit'
							)}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(
								priceInsTotal ? priceInsTotal.toFixed(2) : '0',
								'money_digit'
							)}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'prb') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(
								comPrbTotal ? comPrbTotal.toFixed(2) : '0',
								'money_digit'
							)}
						</TableComponent.Summary.Cell>
					)}
					{(typeFilter === 'isAll' || typeFilter === 'insure') && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(
								comInsTotal ? comInsTotal.toFixed(2) : '0',
								'money_digit'
							)}
						</TableComponent.Summary.Cell>
					)}
					{typeFilter === 'isAll' && (
						<TableComponent.Summary.Cell>
							{convertStrToFormat(sumPrbInsTotal.toFixed(2), 'money_digit')}
						</TableComponent.Summary.Cell>
					)}
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ยอดขายกรมธรรม์</Label>
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
									<Col>
										<Box className='filter-input' width='200'>
											<Label>ช่องทาง</Label>
											<Select
												name='channel'
												value={channel}
												placeholder=''
												options={[
													{
														key: '1',
														value: '1',
														text: 'ทั้งหมด',
													},
													{
														key: '2',
														value: '2',
														text: 'ตรอ.',
													},
													{
														key: '3',
														value: '3',
														text: 'หน้าร้าน',
													},
													{
														key: '4',
														value: '4',
														text: 'สำนักงานฟิน',
													},
													{
														key: '5',
														value: '5',
														text: 'ควิกเซอร์วิส',
													},
													{
														key: '6',
														value: '6',
														text: 'สาขาน้องฟ้า',
													},
													{
														key: '7',
														value: '7',
														text: 'เค พี ออนไลน์ เซอร์วิส',
													},
												]}
												onChange={(e) => setChannel(e)}
												notvalue
											/>
										</Box>
									</Col>
									<Col>
										<Box className='filter-input' width='200'>
											<Label>ประเภท</Label>
											<Select
												name='type'
												value={type}
												placeholder='ประเภท'
												options={[
													{ key: 0, value: 'isAll', text: 'ทั้งหมด' },
													{ key: 1, value: 'prb', text: 'พ.ร.บ.' },
													{ key: 2, value: 'insure', text: 'ประกันรถ' },
												]}
												notvalue
												onChange={(value) => {
													setType(value)
													setCompany()
												}}
											/>
										</Box>
									</Col>
									<Col>
										{type === 'prb' && (
											<Box className='filter-input' width='200'>
												<Label>บริษัทประกัน</Label>
												<Select
													name='company'
													value={company}
													placeholder='บริษัทประกัน'
													options={[
														{
															key: 15,
															value: 'all_prb',
															text: 'ทั้งหมด',
														},
														...LIST.CompanyPrb,
													]}
													notvalue
													onChange={(value) => setCompany(value)}
													error={fieldError.errors?.company}
												/>
											</Box>
										)}
										{type === 'insure' && (
											<Box className='filter-input' width='200'>
												<Label>บริษัทประกัน</Label>
												<Select
													name='company'
													value={company}
													placeholder='บริษัทประกัน'
													options={[
														{
															key: 3,
															value: 'all_ins',
															text: 'ทั้งหมด',
														},
														...LIST.CompanyIns,
													]}
													notvalue
													onChange={(value) => setCompany(value)}
													error={fieldError.errors?.company}
												/>
											</Box>
										)}
									</Col>
								</Row>
								<Box className='filter-box'>
									<Box className='filter-input' width='200'>
										<Label>level</Label>
										<Select
											name='level'
											value={level}
											options={[
												{ key: 0, value: 'isAll', text: 'ทั้งหมด' },
												{ key: 1, value: 'silver', text: 'Silver' },
												{ key: 2, value: 'gold', text: 'Gold' },
												{ key: 3, value: 'platinum', text: 'Platinum' },
											]}
											notvalue
											onChange={(value) => {
												setLevel(value)
											}}
										/>
									</Box>
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
								<Box className='text-user-credit-debit'>
									<Label style={{ marginLeft: '20px' }}>
										ระบบเติมเงิน {countUserDebit} user
									</Label>
								</Box>
							</Box>
						</Box>
						<Box className='report-table-right'>
							<Table
								columns={columns[3].value}
								dataSource={dataClassifyList}
								className='report-data-table'
								size='middle'
								pagination={false}
							/>
						</Box>
						<Box className='report-table'>
							<Table
								columns={columnsFilter || columns[0].value}
								dataSource={data}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							{ExportExcel(
								columnsFilter || columns[0].value,
								data,
								startDate,
								endDate,
								type,
								company
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default SystemPayInsurance

const ExportExcel = (colHead, dataList, startDate, endDate, type, company) => {
	const handleClickExport = () => {
		let typeCell =
			type === 'prb' ? 'พ.ร.บ.' : type === 'insure' ? 'ประกันรถ' : 'ทั้งหมด'
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet(
			type === 'prb' || type === 'insure'
				? company === 'all_prb' || company === 'all_ins'
					? 'ทั้งหมด'
					: company
				: typeCell
		)

		const columns = [
			{ width: 10 },
			{ width: 15 },
			{ width: 25 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
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

		worksheet.getCell('A1').value = 'ยอดขายกรมธรรม์'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่าง วันที่ ${moment(startDate).format(
			'DD/MM/YYYY'
		)} ถึง วันที่ ${moment(endDate).format('DD/MM/YYYY')}`
		worksheet.getCell('A3').value = `ประเภท ${typeCell}`

		let dataCell = []

		const header = colHead.map((e) => {
			return e.title
		})

		const newDataList = dataList.map((e) => {
			let list = []
			Object.entries(e).forEach(([key, value]) => {
				if (
					key === 'pricePrb' ||
					key === 'priceIns' ||
					key === 'comPrb' ||
					key === 'comIns' ||
					key === 'sumPrbIns'
				) {
					list.push(value ? convertStrToFormat(value, 'money_digit') : 0)
				} else if (key !== 'key') {
					list.push(value)
				}
			})
			return list
		})

		// setSummary
		const countQuoNumTotal = dataList.reduce(
			(acc, curr) => acc + curr.countQuoNum,
			0
		)
		const countCompanyPrbTotal = dataList.reduce(
			(acc, curr) => acc + curr.countCompanyPrb,
			0
		)
		const countCompanyTotal = dataList.reduce(
			(acc, curr) => acc + curr.countCompany,
			0
		)
		const pricePrbTotal = dataList.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceInsTotal = dataList.reduce((acc, curr) => acc + curr.priceIns, 0)
		const comPrbTotal = dataList.reduce((acc, curr) => acc + curr.comPrb, 0)
		const comInsTotal = dataList.reduce((acc, curr) => acc + curr.comIns, 0)
		const sumPrbInsTotal = dataList.reduce(
			(acc, curr) => acc + curr.sumPrbIns,
			0
		)

		const sumList = []

		if (type === 'isAll') {
			sumList.push(
				'รวม',
				'',
				'',
				'',
				convertStrToFormat(countQuoNumTotal || '0', 'money_digit'),
				convertStrToFormat(countCompanyPrbTotal || '0', 'money_digit'),
				convertStrToFormat(countCompanyTotal || '0', 'money_digit'),
				convertStrToFormat(pricePrbTotal || '0', 'money_digit'),
				convertStrToFormat(priceInsTotal || '0', 'money_digit'),
				convertStrToFormat(comPrbTotal || '0', 'money_digit'),
				convertStrToFormat(comInsTotal || '0', 'money_digit'),
				convertStrToFormat(sumPrbInsTotal || '0', 'money_digit'),
				'',
				'',
				'',
        ''
			)
		} else if (type === 'prb') {
			sumList.push(
				'รวม',
				'',
				'',
				'',
				convertStrToFormat(countQuoNumTotal || '0', 'money_digit'),
				convertStrToFormat(countCompanyPrbTotal || '0', 'money_digit'),
				convertStrToFormat(pricePrbTotal || '0', 'money_digit'),
				convertStrToFormat(comPrbTotal || '0', 'money_digit'),
				'',
				'',
				'',
        ''
			)
		} else if (type === 'insure') {
			sumList.push(
				'รวม',
				'',
				'',
				'',
				convertStrToFormat(countQuoNumTotal || '0', 'money_digit'),
				convertStrToFormat(countCompanyTotal || '0', 'money_digit'),
				convertStrToFormat(priceInsTotal || '0', 'money_digit'),
				convertStrToFormat(comInsTotal || '0', 'money_digit'),
				'',
				'',
				'',
				''
			)
		}

		dataCell.push(
			[...header, 'จังหวัด', 'ภูมิภาค', 'กลุ่ม', 'แสดงผลชื่อ'],
			...newDataList,
			sumList
		)

		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))

		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(5 + i).getCell(1 + il).border = borders
				if (i === 0 || (2 < il && il < 6)) {
					worksheet.getRow(5 + i).getCell(1 + il).alignment = textCenter
				} else if (2 < il) {
					worksheet.getRow(5 + i).getCell(1 + il).alignment = textRight
				}
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = 'ยอดขายกรมธรรม์'
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
