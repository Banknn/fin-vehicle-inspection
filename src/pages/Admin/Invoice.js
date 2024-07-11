import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { Upload, Button as ButtonAntd, Modal } from 'antd'
import {
	SearchOutlined,
	UploadOutlined,
	DownloadOutlined,
} from '@ant-design/icons'
import { invoiceController, systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Modal as ModalCustom,
	Input,
	Icons,
	Span,
} from '../../components'
import { isValidResponse, LIST, convertStrToFormat } from '../../helpers'
import { THEME } from '../../themes'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { loadingAction } from '../../actions'
import { useDispatch } from 'react-redux'

const Invoice = () => {
	const dispatch = useDispatch()
	const [month, setMonth] = useState('')
	const [year, setYear] = useState('')
	const [dataList, setDataList] = useState([])
	const [periodDate, setPeriodDate] = useState('')
	const [invoiceNo, setInvoiceNo] = useState('')
	const [note, setNote] = useState('')
	const [slipImage, setSlipImage] = useState([])
	const [bankList, setBankList] = useState([])
	const [cuscode, setCuscode] = useState([])
	const [selectedRow, setSelectedRow] = useState([])
	const [genInvAll, setGenInvAll] = useState([])
	const [bank, setBank] = useState('')
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [discounts, setDiscounts] = useState({})

	const modal = useRef(null)

	const fetchData = async (end) => {
		const API = invoiceController()
		const res = await API.getInvoiceByAdminVif(end)
		if (isValidResponse(res)) {
			const { result } = res
			const dataFilter = result.filter((e) => {
				if (status === 'done') return e.paybill_clear_no !== null
				if (status === 'export') return e.paybill_clear_no === null
				return e
			})

			const dataList = dataFilter.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					cuscode: e.user_login,
					credit_total: convertStrToFormat(e.credit_vif_total, 'money_digit'),
					credit_cur: convertStrToFormat(e.credit_vif_cur, 'money_digit'),
					name: e.name,
					invNo: e.paybill_clear_no,
					slip: e.path_credit,
					amount: convertStrToFormat(e.sum_amount, 'money_digit'),
					commission: convertStrToFormat(e.sum_commission, 'money_digit'),
					balance: convertStrToFormat(e.sum_balance, 'money_digit'),
				}
			})
			Promise.all([LIST.BANKS()]).then((e) => {
				setBankList(e[0])
			})
			setDataList(dataList)
		}
	}

	useEffect(() => {
		const dateNow = new Date()
		const currentMonth = moment(dateNow).format('MM')
		const currentYear = moment(dateNow).format('YYYY')

		const curentDaylastMonth = moment(dateNow)
			.subtract(0, 'months')
			.endOf('month')
			.format('DD')
		const dateNowDF = moment(dateNow).format('YYYY-MM-DD HH:mm:ss')
		const date1st = moment(`${currentYear}-${currentMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const date15st = moment(
			`${currentYear}-${currentMonth}-15 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		const date16st = moment(
			`${currentYear}-${currentMonth}-16 00:00:00`
		).format('YYYY-MM-DD HH:mm:ss')
		const datelast = moment(
			`${currentYear}-${currentMonth}-${curentDaylastMonth} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')

		if (moment(dateNowDF).isBetween(date1st, date15st)) {
			setPeriodDate('1')
		} else if (moment(dateNowDF).isBetween(date16st, datelast)) {
			setPeriodDate('2')
		}
		setMonth(currentMonth)
		setYear(currentYear)
	}, [])

	const handleFilter = async () => {
		const dayOfMonth = moment(`${year}-${month}`).daysInMonth()
		const end =
			periodDate === '1'
				? moment(`${year}-${month}-15 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
				: periodDate === '2'
				? moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
						'YYYY-MM-DD HH:mm:ss'
				  )
				: moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
						'YYYY-MM-DD HH:mm:ss'
				  )
		await fetchData(end)
	}

	const handleGenInvAll = async () => {
		setLoading(true)
		const dayOfMonth = moment(`${year}-${month}`).daysInMonth()
		let end
		if (periodDate === '1') {
			end = moment(`${year}-${month}-15 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
		} else if (periodDate === '2') {
			end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
		} else if (periodDate === '3') {
			end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
				'YYYY-MM-DD HH:mm:ss'
			)
		}
		const dataList = genInvAll.map((e) => {
			const discount = discounts[e.key]
			return {
				...e,
				discount: discount,
			}
		})
		const params = {
			dataList: dataList,
			end_date: end,
			type: 'all',
			periodDate,
		}

		const API = invoiceController()
		const res = await API.generateInvoiceAll(params)
		if (isValidResponse(res)) {
			const { result } = res
			let zip = new JSZip()
			const zipFilename = `INV${moment(end).format('DDMMYYHHmm')}.zip`

			result.forEach((e) => {
				zip.file(`${e.nameFiles}.pdf`, e.urlFiles.data, { binary: true })
			})

			zip.generateAsync({ type: 'blob' }).then((content) => {
				const blob = new Blob([content], {
					type: 'application/zip',
				})

				saveAs(blob, zipFilename)
				setLoading(false)
				setSelectedRow([])
				setGenInvAll([])
			})
		}
	}

	const onSelectChange = (newSelectedRow, result) => {
		setSelectedRow(newSelectedRow)
		setGenInvAll(
			result.map((e) => {
				return { cuscode: e.cuscode, name: e.name, key: e.key }
			})
		)
	}

	const rowSelection = {
		selectedRowKeys: selectedRow,
		onChange: onSelectChange,
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
			title: 'รหัสนายหน้า',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'วงเงินเครดิต',
			dataIndex: 'credit_total',
			key: 'credit_total',
			align: 'center',
			width: 200,
		},
		{
			title: 'ยอดคงเหลือ',
			dataIndex: 'credit_cur',
			key: 'credit_cur',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขที่ใบแจ้งหนี้',
			dataIndex: 'invNo',
			key: 'invNo',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบี้ยรวมทั้งหมด',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			width: 200,
		},
		{
			title: 'คอมมิชชั่น',
			dataIndex: 'commission',
			key: 'commission',
			align: 'center',
			width: 200,
		},
		{
			title: 'ยอดที่จ่าย',
			dataIndex: 'balance',
			key: 'balance',
			align: 'center',
			width: 200,
		},
		{
			title: 'คืนเครดิต',
			dataIndex: 'discount',
			key: 'discount',
			align: 'center',
			width: 200,
			render: (text, record) => (
				<Input
					onChange={(e) => {
						const { value } = e.currentTarget
						setDiscounts({ ...discounts, [record.key]: value })
					}}
				/>
			),
		},
		{
			title: 'ใบแจ้งหนี้',
			dataIndex: 'invoice',
			key: 'invoice',
			align: 'center',
			width: 200,
			render: (text, record, index) => {
				const onClickGetInvoice = async () => {
					setLoading(record.cuscode)
					const dayOfMonth = moment(`${year}-${month}`).daysInMonth()
					let end
					if (periodDate === '1') {
						end = moment(`${year}-${month}-15 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					} else if (periodDate === '2') {
						end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					} else if (periodDate === '3') {
						end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					}
					const discount = discounts[record.key]
					const params = {
						cuscode: record.cuscode,
						end_date: end,
						type: 'all',
						periodDate,
						discount,
					}
					const API = invoiceController()
					const res = await API.genInvoiceByAdminVif(params)
					if (isValidResponse(res)) {
						const pdf = res.result.url
						window.open(pdf, '__blank')
						setLoading(false)
						await fetchData(end)
					}
				}
				return loading === record.cuscode ? (
					'กำลังดึงข้อมูล'
				) : record.invNo === null ? (
					<Label className='download' onClick={onClickGetInvoice}>
						ดึงข้อมูล
					</Label>
				) : (
					<Label
						className='download'
						onClick={onClickGetInvoice}
						color={THEME.COLORS.GREEN}
					>
						ดึงซ้ำ
					</Label>
				)
			},
		},
		{
			title: 'สลิป',
			dataIndex: 'slip',
			key: 'slip',
			align: 'center',
			render: (text, record) => {
				const handleChangeUpload = ({ file, fileList }) => {
					if (file.status !== 'uploading') {
						setSlipImage(fileList)
					}
				}

				const handleClickImportInvoiceNo = async () => {
					dispatch(loadingAction(true))
					const dayOfMonth = moment(`${year}-${month}`).daysInMonth()
					let end
					if (periodDate === '1') {
						end = moment(`${year}-${month}-15 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					} else if (periodDate === '2') {
						end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					} else if (periodDate === '3') {
						end = moment(`${year}-${month}-${dayOfMonth} 23:59:59`).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					}
					let formData = new FormData()
					formData.append('cuscode', cuscode)
					formData.append('status_credit', 'wait')
					formData.append('type_credit', 'C')
					formData.append('invoice_no', invoiceNo)
					formData.append('bank', bank)
					formData.append('note', note)
					formData.append('img_credit_vif', slipImage[0].originFileObj)
					const API = systemController()
					const res = await API.saveInvoiceSlipAdminVif(formData)
					if (isValidResponse(res)) {
						dispatch(loadingAction(false))
						const { result } = res
						const form = {
							list: [
								{
									title: 'สลิปซ้ำในระบบ (Duplicated)  :',
									detail: result?.duplicated,
								},
								{
									title: 'สลิปซ้ำใน Task (Duplicated Task)  :',
									detail: result?.duplicated_task,
								},
								{
									title: 'เปอร์เซ็นต์ความถูกต้อง (Percent Confidence)  :',
									detail: `${result?.percent_confidence || 0} %`,
								},
								{
									title: 'วันที่ในสลิป (Date Read)  :',
									detail: result?.date_read,
								},
								{
									title: 'วันที่บันทึก (Date Expect)  :',
									detail: result?.date_expect,
								},
								{
									title: 'Ref สลิป (Reference Read)  :',
									detail: result?.reference_read,
								},
								{
									title: 'Ref ในระบบ (Reference Expect)  :',
									detail: result?.reference_expect,
								},
								{
									title: 'จำนวนเงินสลิป (Money Read)  :',
									detail: `${result?.money_read || 0} บาท`,
								},
								{
									title: 'จำนวนเงินระบบ (money Expect)  :',
									detail: `${result?.money_expect || 0} บาท`,
								},
								{
									title: 'Dst Acc สลิป (Dst Acc Read)  :',
									detail: result?.dst_acc_read,
								},
								{
									title: 'Dst Acc ระบบ (Dst Acc Expect)  :',
									detail: result?.dst_acc_expect,
								},
								{ title: 'โดย (Dst Read)  :', detail: result?.dst_read },
							],
						}

						Modal.success({
							content: (
								<>
									<Box className='title-modal-inv'>บันทึกสำเร็จ</Box>
									<br />
									{form.list.map((e, i) => (
										<Box key={i}>
											<Span className='text-head-inv'>{e.title}</Span>
											{e.detail}
										</Box>
									))}
								</>
							),
							onOk: async () => await fetchData(end),
						})
					}
				}
				return (
					<>
						{record.invNo !== null &&
							(text ? (
								<Button
									className='select-btn'
									width='100'
									onClick={() => window.open(text)}
								>
									เปิด
								</Button>
							) : (
								<Button
									className='select-btn'
									width='100'
									onClick={() => {
										setCuscode(record.cuscode)
										setInvoiceNo(record.invNo)
										setNote('')
										modal.current.open()
									}}
								>
									Import
								</Button>
							))}
						<ModalCustom
							ref={modal}
							okText='ใช่'
							cancelText='ไม่'
							onCallback={handleClickImportInvoiceNo}
							headerText='สลิป'
							modalHead='modal-header-red'
							iconsClose={
								<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
							}
						>
							<Box className='slip-print'>
								<Box>
									<Label style={{ marginBottom: '5px', marginTop: '10px' }}>
										{cuscode}
									</Label>
								</Box>
								<Box>
									<Label style={{ marginBottom: '5px', marginTop: '10px' }}>
										เลขที่ใบแจ้งหนี้
									</Label>
									<Input
										placeholder='เลขที่ใบแจ้งหนี้'
										onChange={(e) => setInvoiceNo(e.target.value)}
										value={invoiceNo}
									/>
								</Box>
								<Box>
									<Select
										placeholder='เลือกบัญชีธนาคาร'
										options={[
											{
												key: '5',
												value: 'qrcode',
												text: 'ชำระโดย Qr Code',
											},
											...bankList,
										]}
										onChange={(e) => setBank(e)}
										className='choose-bank'
										isNotForm
									/>
								</Box>
								<Box>
									<Input
										placeholder='หมายเหตุ'
										onChange={(e) => setNote(e.target.value)}
										value={note}
									/>
								</Box>
								<Box style={{ marginTop: '10px' }}>
									<Upload
										beforeUpload={() => false}
										onChange={handleChangeUpload}
										maxCount={1}
									>
										<ButtonAntd icon={<UploadOutlined />}>Upload</ButtonAntd>
									</Upload>
								</Box>
							</Box>
						</ModalCustom>
					</>
				)
			},
		},
	]

	const data = dataList.filter(
		(e) =>
			e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
			e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
			(e.invNo && e.invNo?.toLowerCase().indexOf(search.toLowerCase()) !== -1)
	)

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>ใบแจ้งหนี้</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box className='filter-box'>
								<Box className='filter-input' width='200'>
									<Label>เดือน</Label>
									<Select
										name='month'
										value={month}
										placeholder='เลือกเดือน'
										options={LIST.MONTH}
										onChange={(value) => setMonth(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
									<Label>ปี</Label>
									<Select
										name='year'
										value={`${year} / ${Number(year) + 543}`}
										placeholder='เลือกปี'
										options={LIST.YEAR()}
										onChange={(value) => setYear(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
									<Label>ช่วงการแจ้งงาน</Label>
									<Select
										name='periodDate'
										value={periodDate}
										placeholder='ช่วงการแจ้งงาน'
										options={[
											{
												key: '1',
												value: '1',
												text: 'วันที่ 1 - 15',
											},
											{
												key: '2',
												value: '2',
												text: `วันที่ 16 - ${moment(
													`${year}-${month}`,
													'YYYY-MM'
												).daysInMonth()}`,
											},
											{
												key: '3',
												value: '3',
												text: 'ทั้งหมด',
											},
										]}
										onChange={(value) => setPeriodDate(value)}
										notvalue
									/>
								</Box>
								<Box className='filter-input' width='200'>
									<Label>สถานะ</Label>
									<Select
										name='status'
										value={status}
										placeholder='สถานะ'
										options={[
											{
												key: '1',
												value: 'export',
												text: 'ยังไม่ดึงข้อมูล',
											},
											{
												key: '2',
												value: 'done',
												text: `ดึงข้อมูลแล้ว`,
											},
											{
												key: '3',
												value: 'all',
												text: 'ทั้งหมด',
											},
										]}
										onChange={(value) => setStatus(value)}
										notvalue
									/>
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
								<Box className='filter-input' width='100'>
									<Button className='select-btn' onClick={handleFilter}>
										<SearchOutlined style={{ marginRight: '5px' }} />
										ค้นหา
									</Button>
								</Box>
								<Box className='filter-input' width='200'>
									<Button
										className='success-btn'
										style={{ width: '200px' }}
										onClick={handleGenInvAll}
										disabled={genInvAll.length === 0 || loading}
									>
										{loading ? (
											'กำลังดึงข้อมูล'
										) : (
											<>
												<DownloadOutlined style={{ marginRight: '5px' }} />
												ดึงใบแจ้งหนี้ {genInvAll.length} รายการ
											</>
										)}
									</Button>
								</Box>
							</Box>
						</Box>
						<Box className='report-table'>
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={data}
								className='report-data-table'
								size='middle'
							/>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default Invoice
