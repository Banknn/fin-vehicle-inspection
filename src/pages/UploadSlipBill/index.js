import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'
import { reportController, systemController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	Select,
	Label,
	Table,
	Modal as ModalCustom,
	Icons,
} from '../../components'
import { convertStrToFormat, isValidResponse } from '../../helpers'
import { THEME } from '../../themes'
import { loadingAction } from '../../actions'
import { TableComponent } from '../../components/Table/styled'
import { Modal, Upload, message, DatePicker } from 'antd'

const UploadSlipBill = () => {
	const dispatch = useDispatch()
	const [datePay, setDatePay] = useState()
	const [bank, setBank] = useState('ธนาคารไทยพาณิชย์')
	const [amount, setAmount] = useState(0)
	const [slipImage, setSlipImage] = useState([])
	const [dataList, setDataList] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [dataSelected, setDataSelected] = useState([])

	const modal = useRef(null)

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))

		const API = reportController()
		const res = await API.getUploadSlipBill()
		if (isValidResponse(res)) {
			const dataList = res.result

			const data = dataList.map((e, i) => {
				return {
					no: i + 1,
					key: i,
					...e,
				}
			})
			setDataList(data)
			dispatch(loadingAction(false))
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
		setDatePay(moment())
	}, [fetchData])

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'เลขบิล',
			dataIndex: 'bill_num',
			key: 'bill_num',
			align: 'center',
			width: 150,
		},
		{
			title: 'วันที่เปิดบิล',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 150,
		},
		{
			title: 'ชื่อ',
			dataIndex: 'nameUser',
			key: 'nameUser',
			align: 'center',
			width: 200,
		},
		{
			title: 'ทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 300,
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
			dataIndex: 'insureType',
			key: 'insureType',
			align: 'center',
			width: 150,
			render: (value, row) => {
				return (
					<Box>
						<Label>{row.insureType}</Label>
						<Label>{row.prbType}</Label>
					</Box>
				)
			},
		},
		{
			title: 'รวม',
			dataIndex: 'price_total',
			key: 'price_total',
			align: 'center',
			width: 150,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'เบี้ยประกัน',
			dataIndex: 'show_price_ins',
			key: 'show_price_ins',
			align: 'center',
			width: 150,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
		{
			title: 'เบี้ยพรบ',
			dataIndex: 'show_price_prb',
			key: 'show_price_prb',
			align: 'center',
			width: 150,
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
			dataIndex: 'price_tax',
			key: 'price_tax',
			align: 'center',
			width: 150,
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
			dataIndex: 'fine',
			key: 'fine',
			align: 'center',
			width: 150,
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
			dataIndex: 'inspection_fee',
			key: 'inspection_fee',
			align: 'center',
			width: 150,
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
			width: 150,
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
			dataIndex: 'trans_car',
			key: 'trans_car',
			align: 'center',
			width: 150,
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
			width: 150,
			render: (value) => {
				return (
					<Label>
						{value ? convertStrToFormat(value, 'money_digit') : '-'}
					</Label>
				)
			},
		},
	]

	const onSelectChange = async (selectedRowKeys, selectedRows) => {
		setSelectedRowKeys(selectedRowKeys)
		setDataSelected(selectedRows)
		setAmount(selectedRows.reduce((acc, curr) => acc + +curr.price_total, 0))
	}

	const handleTriggerSlip = (props) => {
		setSlipImage(props)
	}

	const handleUploadSlip = async () => {
		if (bank && slipImage.length > 0) {
			dispatch(loadingAction(true))
			let formData = new FormData()
			formData.append(
				'dataSelected',
				JSON.stringify(dataSelected.map((e) => e.bill_num))
			)
			formData.append('amount', amount)
			formData.append('type_credit', 'C')
			formData.append('bank', bank)
			formData.append('date_pay', moment(datePay).format('YYYY-MM-DD HH:mm:ss'))
			formData.append('img_credit_vif', slipImage[0].originFileObj)

			const API = systemController()
			const res = await API.saveBillSlipVif(formData)
			if (isValidResponse(res)) {
				dispatch(loadingAction(false))
				Modal.success({
					title: 'บันทึกข้อมูลสำเร็จ',
				})
				setSelectedRowKeys([])
				setDataSelected([])
        setAmount(0)
				setBank('')
				setSlipImage('')
				modal.current.close()
				fetchData()
			} else {
				modal.error({
					title: 'กรุณาติดต่อผู้พัฒนา',
				})
			}
		} else if (dataSelected.length === 0) {
			message.warn({
				content: 'ไม่มีข้อมูลสำหรับแนบสลิป',
			})
		} else {
			message.warn({
				content: 'กรุณาเลือกธนาคารและอัพโหลดสลิปให้เรียบร้อย',
			})
		}
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	}

	const summaryRow = () => {
		const priceTotal = dataList.reduce(
			(acc, curr) => acc + +curr.price_total,
			0
		)
		const priceIns = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_ins,
			0
		)
		const pricePrb = dataList.reduce(
			(acc, curr) => acc + +curr.show_price_prb,
			0
		)
		const priceTax = dataList.reduce((acc, curr) => acc + +curr.price_tax, 0)
		const priceFine = dataList.reduce((acc, curr) => acc + +curr.fine, 0)
		const priceFee = dataList.reduce(
			(acc, curr) => acc + +curr.inspection_fee,
			0
		)
		const priceSevice = dataList.reduce((acc, curr) => acc + +curr.sevice, 0)
		const discount = dataList.reduce((acc, curr) => acc + +curr.discount, 0)
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
						{convertStrToFormat(priceTotal, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceIns, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(pricePrb, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceTax, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceFine, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceFee, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(priceSevice, 'money_digit')}
					</TableComponent.Summary.Cell>
					<TableComponent.Summary.Cell>
						{convertStrToFormat(discount, 'money_digit')}
					</TableComponent.Summary.Cell>
				</TableComponent.Summary.Row>
			</TableComponent.Summary>
		)
	}

	return (
		<>
			<Container className='report-container'>
				<Box>
					<Label className='title-form'>แนบสลิปรายการบิล</Label>
					<Box className='report-wrapper'>
						<Box className='report-table'>
							<Table
								rowSelection={rowSelection}
								columns={columns}
								dataSource={dataList}
								className='report-data-table'
								size='middle'
								summary={summaryRow}
								scroll={{ x: 1900 }}
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							<Button
								className='accept-btn'
								width='150'
								onClick={() => modal.current.open()}
								disabled={selectedRowKeys.length === 0}
							>
								อัพโหลดสลิป
							</Button>
						</Box>
						<ModalCustom
							ref={modal}
							headerText='สลิป'
							modalHead='modal-header-red'
							iconsClose={
								<Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
							}
						>
							<Box className='slip-print'>
								<Box>
									<Label>
										ยอดชำระ {convertStrToFormat(amount, 'money_digit')}
									</Label>
								</Box>
								<Box>
									<Select
										placeholder='เลือกบัญชีธนาคาร'
										options={[
											{
												text: '165-292255-7 ธนาคารไทยพาณิชย์',
												value: 'ธนาคารไทยพาณิชย์',
											},
										]}
										value={bank}
										onChange={(e) => setBank(e)}
										className='choose-bank'
										isNotForm
									/>
								</Box>
								<Box>
									<Label className='subject'>วันที่-เวลา โอนเงิน</Label>
									<DatePicker
										style={{ width: '100%' }}
										name='datePay'
										value={moment(datePay)}
										placeholder='วันที่โอนเงิน'
										format='DD-MM-YYYY HH:mm'
										showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
										notvalue
										onChange={(e) => setDatePay(e)}
									/>
								</Box>
								<Box>
									<Label className='subject'>แนบสลิปโอนเงิน</Label>
									<UploadBox onTrigger={handleTriggerSlip} />
								</Box>
								<Box style={{ display: 'flex', justifyContent: 'end' }}>
									<Button className='success-btn' onClick={handleUploadSlip}>
										ยืนยัน
									</Button>
								</Box>
							</Box>
						</ModalCustom>
					</Box>
				</Box>
			</Container>
		</>
	)
}

const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = (error) => reject(error)
	})
}

const uploadButton = () => {
	return (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>แนบสลิป</div>
		</div>
	)
}

const UploadBox = (props) => {
	const [previewVisible, setPreviewVisible] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}
		setPreviewImage(file.url || file.preview)
		setPreviewVisible(true)
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
		)
	}
	const handleCancel = () => setPreviewVisible(false)
	const handleChange = ({ fileList }) => {
		props.onTrigger(fileList)
	}

	return (
		<Box>
			<Upload
				beforeUpload={() => false}
				listType='picture-card'
				onPreview={handlePreview}
				onChange={handleChange}
				maxCount={1}
			>
				{uploadButton()}
			</Upload>
			<Modal
				visible={previewVisible}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<img alt='example' style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</Box>
	)
}

export default UploadSlipBill
