import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { reportController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	DatePicker,
	Label,
	Table,
	Input,
	Modal as ModalCustom,
	Icons,
} from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { TableComponent } from '../../components/Table/styled'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { THEME } from '../../themes'

const DailyShopReport = () => {
	const dispatch = useDispatch()
	const premistions = useSelector((state) => state.premissionsReducer)
	const [reportData, setReportData] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState()
	const [summary, setSummary] = useState({
		pricePrbToday: '0',
		priceInsToday: '0',
		priceInspecFeeToday: '0',
		priceSeviceToday: '0',
		priceTotalToday: '0',
	})
	const [dataListFile, setDataListFile] = useState([])

	const modalFile = useRef(null)

	const fetchData = useCallback(
		async (start, end) => {
			dispatch(loadingAction(true))
			const currDay = moment().format('DD')
			const currMonth = moment().format('MM')
			const currYear = moment().format('YYYY')
			const startDf = moment(
				`${currYear}-${currMonth}-${currDay} 00:00:00`
			).format('YYYY-MM-DD HH:mm:ss')
			const endDf = moment(
				`${currYear}-${currMonth}-${currDay} 23:59:59`
			).format('YYYY-MM-DD HH:mm:ss')

			const API = reportController()
			const [res, res2] = await Promise.all([
				API.getDetailBillDaily({
					start: start || startDf,
					end: end || endDf,
					id_cus: premistions.cuscode,
				}),
				API.getDetailBillDaily({
					start: startDf,
					end: endDf,
					id_cus: premistions.cuscode,
				}),
			])

			if (isValidResponse(res) || isValidResponse(res2)) {
				const { result } = res
				const result2 = res2.result.filter((e) => e.status === 'success')

				const dataFilter = result.filter((e) => e.status === 'success')
				const data = dataFilter.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						bill_num: e.bill_num,
						quo_num: e.quo_num,
						nameUser: e.nameUser,
						date: moment(e.date).format('DD/MM/YYYY HH:mm:ss'),
						pricePrb: +e.show_price_prb,
						priceIns: +e.show_price_ins,
						priceTax: +e.price_tax,
						priceFine: +e.fine,
						priceInspecFee: +e.inspection_fee,
						sevice: +e.sevice,
						transCar: +e.trans_car,
						cost: +e.cost,
						discount: +e.discount,
						priceTotal: +e.price_total,
						chanel: e.chanel,
						by: e.id_key,
						tel: e.tel,
						idcar: e.idcar,
						num_credit: e.num_credit,
						company: e.company,
						companyPrb: e.company_prb,
						log_bill: JSON.parse(e.log_bill),
					}
				})

				const pricePrbTotal = result2.reduce(
					(acc, curr) => acc + +curr.show_price_prb,
					0
				)
				const priceInsTotal = result2.reduce(
					(acc, curr) => acc + +curr.show_price_ins,
					0
				)
				const priceInspecFeeTotal = result2.reduce(
					(acc, curr) => acc + +curr.inspection_fee,
					0
				)
				const seviceTotal = result2.reduce((acc, curr) => acc + +curr.sevice, 0)
				const priceTotal = result2.reduce(
					(acc, curr) => acc + +curr.price_total,
					0
				)

				setReportData(data)
				setStartDate(start)
				setEndDate(end)
				setSummary({
					pricePrbToday: pricePrbTotal || '0',
					priceInsToday: priceInsTotal || '0',
					priceInspecFeeToday: priceInspecFeeTotal || '0',
					priceSeviceToday: seviceTotal || '0',
					priceTotalToday: priceTotal || '0',
				})
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		fetchData()
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
		},
		{
			title: 'เลขบิล',
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
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
			title: 'เลขรายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
		},
		{
			title: 'เบอร์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
		},
		{
			title: 'เลขทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'บริษัทพรบ',
			dataIndex: 'companyPrb',
			key: 'companyPrb',
			align: 'center',
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
		},
		{
			title: 'พ.ร.บ. รถ',
			dataIndex: 'pricePrb',
			key: 'pricePrb',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ประกันรถ',
			dataIndex: 'priceIns',
			key: 'priceIns',
			align: 'center',
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
			dataIndex: 'priceTax',
			key: 'priceTax',
			align: 'center',
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
			dataIndex: 'priceFine',
			key: 'priceFine',
			align: 'center',
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
			dataIndex: 'priceInspecFee',
			key: 'priceInspecFee',
			align: 'center',
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
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าโอนรถ',
			dataIndex: 'transCar',
			key: 'transCar',
			align: 'center',
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'ค่าใช้จ่ายเพิ่มเติม',
			dataIndex: 'cost',
			key: 'cost',
			align: 'center',
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
			dataIndex: 'priceTotal',
			key: 'priceTotal',
			align: 'center',
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
			width: 200,
			render: (value, row) => {
				return (
					<Box>
						{value === 'บัตรเครดิต' ? (
							<Label>
								{value} ({row.num_credit})
							</Label>
						) : (
							<Label>{value}</Label>
						)}
					</Box>
				)
			},
		},
		{
			title: 'ออกโดย',
			dataIndex: 'by',
			key: 'by',
			align: 'center',
		},
		{
			title: 'วันที่แจ้งงาน',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
		},
	]

	const summaryRow = (pageData) => {
		const pricePrb = pageData.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceIns = pageData.reduce((acc, curr) => acc + curr.priceIns, 0)
		const priceTax = pageData.reduce((acc, curr) => acc + curr.priceTax, 0)
		const priceFine = pageData.reduce((acc, curr) => acc + curr.priceFine, 0)
		const priceInspecFee = pageData.reduce(
			(acc, curr) => acc + curr.priceInspecFee,
			0
		)
		const transCar = pageData.reduce((acc, curr) => acc + curr.transCar, 0)
		const cost = pageData.reduce((acc, curr) => acc + curr.cost, 0)
		const sevice = pageData.reduce((acc, curr) => acc + curr.sevice, 0)
		const discount = pageData.reduce((acc, curr) => acc + curr.discount, 0)
		const priceTotal = pageData.reduce((acc, curr) => acc + curr.priceTotal, 0)

		// total
		const pricePrbTotal = dataList.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceInsTotal = dataList.reduce((acc, curr) => acc + curr.priceIns, 0)
		const priceTaxTotal = dataList.reduce((acc, curr) => acc + curr.priceTax, 0)
		const priceFineTotal = dataList.reduce(
			(acc, curr) => acc + curr.priceFine,
			0
		)
		const priceInspecFeeTotal = dataList.reduce(
			(acc, curr) => acc + curr.priceInspecFee,
			0
		)
		const seviceTotal = dataList.reduce((acc, curr) => acc + curr.sevice, 0)
		const transCarTotal = dataList.reduce((acc, curr) => acc + curr.transCar, 0)
		const costTotal = dataList.reduce((acc, curr) => acc + curr.cost, 0)
		const discountTotal = dataList.reduce((acc, curr) => acc + curr.discount, 0)
		const priceTotals = dataList.reduce((acc, curr) => acc + curr.priceTotal, 0)

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
					<TableComponent.Summary.Cell>รวม</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(pricePrb || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceIns || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceTax || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceFine || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceInspecFee || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(sevice || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(transCar || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(cost || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(discount || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
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
						{convertStrToFormat(priceTaxTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceFineTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceInspecFeeTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(seviceTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(transCarTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(costTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(discountTotal || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceTotals || '0', 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
					<TableComponent.Summary.Cell />
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	const dataList = reportData
		.filter((e) => {
			if (search)
				return e.bill_num.toLowerCase().indexOf(search.toLowerCase()) !== -1
			return e
		})
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>รายงานประจำวัน</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box'>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								พ.ร.บ. รถวันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(summary.pricePrbToday, 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								ประกันรถวันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(summary.priceInsToday, 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								ตรวจสภาพรถวันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(summary.priceInspecFeeToday, 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								บริการอื่นๆ วันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(summary.priceSeviceToday, 'money_digit')}
							</Label>
						</Box>
						<Box className='daily-price'>
							<Label className='title-daily-price' noLine>
								รวมทั้งหมด วันนี้
							</Label>
							<Label className='show-daily-price'>
								{convertStrToFormat(summary.priceTotalToday, 'money_digit')}
							</Label>
						</Box>
					</Box>
					<Box className='report-table'>
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
							<Box className='filter-item'>
								<Input
									name='search'
									placeholder='ค้นหา'
									isNotForm
									onChange={(e) => setSearch(e.target.value)}
								/>
							</Box>
							<Button className='select-btn' onClick={handleFilter}>
								<SearchOutlined style={{ marginRight: '5px' }} />
								ค้นหา
							</Button>
						</Box>
						<Table
							columns={columns}
							dataSource={dataList}
							className='report-data-table'
							size='middle'
							summary={summaryRow}
							scroll={{ x: 1800 }}
						/>
					</Box>
					<Box className='accept-group-btn-wrapper'>
						{ExportExcel(columns, dataList, summary, startDate, endDate)}
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
	)
}

export default DailyShopReport

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

const ExportExcel = (columnsHead, dataList, summary, startDate, endDate) => {
	const handleClickExport = () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รายงานประจำวัน')

		let columns = []
		for (let i = 0; i <= 20; i++) {
			if (i === 0) {
				columns.push({ width: 10 })
			} else {
				columns.push({ width: 20 })
			}
		}

		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }

		worksheet.getCell('A1').value = 'รายงานประจำวัน'
		worksheet.getCell('A1').font = { size: 20 }
		worksheet.getCell('A2').value = `ระหว่างวันที่ ${moment(startDate).format(
			'DD-MM-YYYY'
		)} - ${moment(endDate).format('DD-MM-YYYY')}`

		const header1 = columnsHead.map((e) => {
			return e.title
		})

		let newDataList1 = dataList.map((e) => {
			const product =
				e.log_bill.productList &&
				JSON.parse(e.log_bill.productList).map(
					(el) => `${el.name} ราคา ${el.price}`
				)
			const costList =
				e.log_bill.costList &&
				JSON.parse(e.log_bill.costList).map(
					(el) => `${el.name} ราคา ${el.price}`
				)
			return [
				e.no,
				e.bill_num,
				e.quo_num,
				e.nameUser,
				e.tel,
				e.idcar,
				e.companyPrb,
				e.company,
				convertStrToFormat(e.pricePrb || '0', 'money_digit'),
				convertStrToFormat(e.priceIns || '0', 'money_digit'),
				convertStrToFormat(e.priceTax || '0', 'money_digit'),
				convertStrToFormat(e.priceFine || '0', 'money_digit'),
				convertStrToFormat(e.priceInspecFee || '0', 'money_digit'),
				convertStrToFormat(e.sevice || '0', 'money_digit'),
				convertStrToFormat(e.transCar || '0', 'money_digit'),
				convertStrToFormat(e.cost || '0', 'money_digit'),
				convertStrToFormat(e.discount || '0', 'money_digit'),
				convertStrToFormat(e.priceTotal || '0', 'money_digit'),
				e.chanel === 'บัตรเครดิต' ? `${e.chanel} ${e.num_credit}` : e.chanel,
				e.by,
				e.date,
				product,
				costList,
			]
		})

		// setSummary
		const pricePrbTotal = dataList.reduce((acc, curr) => acc + curr.pricePrb, 0)
		const priceInsTotal = dataList.reduce((acc, curr) => acc + curr.priceIns, 0)
		const priceTaxTotal = dataList.reduce((acc, curr) => acc + curr.priceTax, 0)
		const priceFineTotal = dataList.reduce(
			(acc, curr) => acc + curr.priceFine,
			0
		)
		const priceInspecFeeTotal = dataList.reduce(
			(acc, curr) => acc + curr.priceInspecFee,
			0
		)
		const seviceTotal = dataList.reduce((acc, curr) => acc + curr.sevice, 0)
		const transCarTotal = dataList.reduce((acc, curr) => acc + curr.transCar, 0)
		const costTotal = dataList.reduce((acc, curr) => acc + curr.cost, 0)
		const discountTotal = dataList.reduce((acc, curr) => acc + curr.discount, 0)
		const priceTotals = dataList.reduce((acc, curr) => acc + curr.priceTotal, 0)

		let dataCell = []
		let dataCell2 = []
		dataCell.push(
			[
				'',
				'พ.ร.บ. รถวันนี้',
				'ประกันรถวันนี้',
				'ตรวจสภาพรถวันนี้',
				'บริการอื่นๆ วันนี้',
				'รวมทั้งหมด วันนี้',
			],
			[
				'',
				convertStrToFormat(summary?.pricePrbToday || '0', 'money_digit'),
				convertStrToFormat(summary?.priceInsToday || '0', 'money_digit'),
				convertStrToFormat(summary?.priceInspecFeeToday || '0', 'money_digit'),
				convertStrToFormat(summary?.priceSeviceToday || '0', 'money_digit'),
				convertStrToFormat(summary?.priceTotalToday || '0', 'money_digit'),
			]
		)
		dataCell.forEach((e, i) => (worksheet.getRow(5 + i).values = e))
		dataCell.forEach((e, i) => {
			e.forEach((el, il) => {
				if (il !== 0) {
					worksheet.getRow(5 + i).getCell(1 + il).border = borders
				}
			})
		})

		dataCell2.push(
			[...header1, 'ค่าบริการต่างๆ', 'ค่าใช้จ่ายเพิ่มเติม'],
			...newDataList1,
			[
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'รวม',
				convertStrToFormat(pricePrbTotal || '0', 'money_digit'),
				convertStrToFormat(priceInsTotal || '0', 'money_digit'),
				convertStrToFormat(priceTaxTotal || '0', 'money_digit'),
				convertStrToFormat(priceFineTotal || '0', 'money_digit'),
				convertStrToFormat(priceInspecFeeTotal || '0', 'money_digit'),
				convertStrToFormat(seviceTotal || '0', 'money_digit'),
				convertStrToFormat(transCarTotal || '0', 'money_digit'),
				convertStrToFormat(costTotal || '0', 'money_digit'),
				convertStrToFormat(discountTotal || '0', 'money_digit'),
				convertStrToFormat(priceTotals || '0', 'money_digit'),
				'',
				'',
				'',
				'',
				'',
			]
		)
		dataCell2.forEach((e, i) => (worksheet.getRow(9 + i).values = e))
		dataCell2.forEach((e, i) => {
			e.forEach((el, il) => {
				worksheet.getRow(9 + i).getCell(1 + il).border = borders

				if (i === 0) {
					worksheet.getRow(9 + i).getCell(1 + il).alignment = textCenter
				}
			})
		})

		worksheet.columns = columns

		workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			let nameFile = `รายงานประจำวัน ${moment(startDate).format(
				'DDMMYYYY'
			)} - ${moment(endDate).format('DDMMYYYY')}`
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
