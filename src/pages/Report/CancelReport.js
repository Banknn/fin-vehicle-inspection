import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Modal } from 'antd'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { reportController, systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Input,
	DatePicker,
	Select,
	Label,
	Table,
	Icons,
	Modal as ModalCustom,
	Span,
	UploadFiles,
} from '../../components'
import { convertStrToFormat, isValidResponse, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import { THEME } from '../../themes'
import _ from 'lodash'

const CancelReport = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')
	const [cancelQuoNum, setCancelQuoNum] = useState('')
	const [reason, setReason] = useState('')
	const [checkCxl, setCheckCxl] = useState('')
	const [bank, setBank] = useState('')
	const [slipImg, setSlipImg] = useState({})
	const [fieldError, setFieldError] = useState({})
	const [bankList, setBankList] = useState([])
	const modal = useRef(null)

	const fetchData = useCallback(
		async (start, end, status) => {
			dispatch(loadingAction(true))

			const params = {
				startDate: start,
				endDate: end,
			}
			const API = reportController()
			const res = await API.getDailyCancelReport(params)
			if (isValidResponse(res)) {
				const result = res.result
				const dataFilter = result.filter((e) => {
					if (status === 'all' || !status) {
						return e
					}
					return e.status === status
				})
				let data = _.orderBy(dataFilter, 'datestart', 'desc')
				data = data.map((e, i) => {
					const net = +e.show_price_prb + +e.show_price_ins
					return {
						key: i,
						no: i + 1,
						quo_num: e.quo_num,
						idcar: e.idcar,
						carprovince: e.carprovince,
						name: `${e.title || ''} ${e.name} ${e.lastname || ''}`,
						prb: +e.show_price_prb,
						insure: +e.show_price_ins,
						date: moment(e.datestart).format('DD/MM/YYYY'),
						net,
						status: e.status,
					}
				})
				setReportData(data)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		const currDay = moment(new Date()).format('DD')
		const currMonth = moment(new Date()).format('MM')
		const currYear = moment(new Date()).format('YYYY')
		const startToday = moment(`${currYear}-${currMonth}-01 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const endToday = moment(
			`${currYear}-${currMonth}-${currDay} 23:59:59`
		).format('YYYY-MM-DD HH:mm:ss')
		setStartDate(startToday)
		setEndDate(endToday)
		fetchData(startToday, endToday, status)
		Promise.all([LIST.BANKS()]).then((e) => {
			setBankList(e[0])
		})
	}, [fetchData, status])

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!reason || reason.trim().length === 0) {
			formIsValid = false
			errors['reason'] = 'กรุณาระบุเหตุผลการขอยกเลิกกรมธรรม์'
		}
		if (!bank && checkCxl) {
			formIsValid = false
			errors['bank'] = 'กรุณาเลือกธนาคาร'
		}
		if (_.isEmpty(slipImg) && checkCxl) {
			formIsValid = false
			errors['slipImg'] = 'กรุณาแนบสลิปการโอนเงิน'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleTriggerSlip = (props) => {
		setSlipImg(props)
	}

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const start = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${endSelected} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
		setStartDate(start)
		setEndDate(end)
		await fetchData(start, end, status)
	}

	const handleClickCancel = async () => {
		if (validateFields()) {
			dispatch(loadingAction(true))
			let formData = new FormData()
			formData.append('quo_num', cancelQuoNum)
			formData.append('reason', reason)
			if (slipImg[0]) {
        formData.append('bank', bank)
				formData.append('slip_cancel_vif', slipImg[0].originFileObj)
			}
			const API = systemController()
			const res = await API.cancelInsuranceVif(formData)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))
				Modal.success({
					title: 'แจ้งยกเลิกสำเร็จ',
					content: 'กรุณารอเจ้าหน้าทำการยกเลิกสักครู่',
				})
				setReason('')
				await fetchData(startDate, endDate, status)
				setDefaultValue()
			}
		}
	}

	const setDefaultValue = () => {
		setReason('')
		setCheckCxl('')
		setBank('')
		setSlipImg({})
		setFieldError({})
		modal.current.close()
		dispatch(loadingAction(false))
	}

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
			title: 'ทะเบียน',
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
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'วันที่แจ้งงาน',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
		},
		{
			title: 'พ.ร.บ. รถ',
			dataIndex: 'prb',
			key: 'prb',
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
			dataIndex: 'insure',
			key: 'insure',
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
			title: 'สุทธิ',
			dataIndex: 'net',
			key: 'net',
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
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (value) => {
				return value === 'active' ? (
					<Label className='status' status={value}>
						สำเร็จ
					</Label>
				) : value === 'wait-cancel' ? (
					<Label className='status' status={value}>
						รอยกเลิก
					</Label>
				) : (
					<Label className='status' status={value}>
						ยกเลิก
					</Label>
				)
			},
		},
		{
			title: 'ทำรายการ',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				const handelClickCancelWait = () => {
					Modal.confirm({
						title: 'คุณต้องการยกเลิกรายการนี้หรือไม่',
						onOk: async () => {
							dispatch(loadingAction(true))

							const API = systemController()
							const res = await API.cancelWaitInsuranceVif(record.quo_num)
							if (isValidResponse(res)) {
								Modal.success({
									title: 'ทำการยกเลิกรายการสำเร็จ',
								})
								await fetchData(startDate, endDate, status)
								dispatch(loadingAction(false))
							} else {
								Modal.error({
									title: 'ทำการยกเลิกรายการไม่สำเร็จ',
								})
								dispatch(loadingAction(false))
							}
						},
						okText: 'ใช่',
						cancelText: 'ไม่',
					})
				}

				const handleClickCxl = async () => {
					const API = systemController()
					const res = await API.getSlipCancelVif(record.quo_num)

					setCheckCxl(res?.result?.statusCxl)
					modal.current.open()
					setCancelQuoNum(record.quo_num)
				}

				return (
					<>
						{record.status === 'active' ? (
							<Button
								className='remove-btn'
								width='100'
								onClick={handleClickCxl}
							>
								ยกเลิก
							</Button>
						) : record.status === 'wait-cancel' ? (
							<Button
								className='select-btn'
								width='120'
								onClick={handelClickCancelWait}
							>
								ดึงงานคืน
							</Button>
						) : null}
					</>
				)
			},
		},
	]

	const dataList = reportData.filter(
		(e) =>
			e.quo_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
			e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
			e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1
	)

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>รายงานยกเลิกกรมธรรม์</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='200'>
								<Label>วันที่</Label>
								<DatePicker
									name='startDate'
									placeholder='วันที่'
									format='DD/MM/YYYY'
									onChange={(e) => setStartDate(e)}
									value={moment(startDate)}
									notvalue
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label>ถึงวันที่</Label>
								<DatePicker
									name='endDate'
									placeholder='วันที่'
									format='DD/MM/YYYY'
									onChange={(e) => setEndDate(e)}
									value={moment(endDate)}
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
											value: 'active',
											text: 'สำเร็จ',
										},
										{
											key: '2',
											value: 'wait-cancel',
											text: `รอยกเลิก`,
										},
										{
											key: '3',
											value: 'cancel',
											text: 'ยกเลิก',
										},
										{
											key: '4',
											value: 'all',
											text: 'ทั้งหมด',
										},
									]}
									isNotForm
									onChange={(value) => setStatus(value)}
									notvalue
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label>ค้นหา</Label>
								<Input
									name='search'
									placeholder='ค้นหา'
									isNotForm
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
					</Box>
					<Box className='report-table'>
						<Table
							columns={columns}
							dataSource={dataList}
							className='report-data-table'
							size='middle'
						/>
						<ModalCustom
							ref={modal}
							okText='ใช่'
							cancelText='ไม่'
							onCallback={handleClickCancel}
							headerText='ต้องการจะยกเลิกกรมธรรม์หรือไม่'
							modalHead='modal-header-red'
							iconsClose={
								<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
							}
							isCloseEnd={true}
						>
							<Box className='slip-print'>
								<Label>{cancelQuoNum}</Label>
								<Label style={{ marginBottom: '5px', marginTop: '10px' }}>
									เหตุผลการขอยกเลิกกรมธรรม์
								</Label>
								<Input
									placeholder='เหตุผล'
									onChange={(e) => setReason(e.target.value)}
									error={fieldError.errors?.reason}
								/>
								{checkCxl && (
									<Box style={{ marginBottom: '5px', marginTop: '10px' }}>
										<Box>
											<Select
												placeholder='เลือกบัญชีธนาคาร'
												options={bankList}
                        value={bank}
												onChange={(e) => setBank(e)}
												className='choose-bank'
												error={fieldError.errors?.bank}
											/>
										</Box>
										<Label>แนบสลิป (มีค่ายกเลิก 200 บาท)</Label>
										<UploadFiles onTrigger={handleTriggerSlip} maxCount={1} />
										{_.isEmpty(slipImg) && fieldError.errors?.slipImg && (
											<Box>
												<Span color='red'>กรุณาแนบสลิปการโอนเงิน</Span>
											</Box>
										)}
									</Box>
								)}
							</Box>
						</ModalCustom>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}
export default CancelReport
