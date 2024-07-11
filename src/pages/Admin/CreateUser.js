import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { systemController } from '../../apiServices'
import {
	PlusCircleOutlined,
	EyeOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import {
	Box,
	Container,
	Label,
	Table,
	Select,
	Button as Buttons,
	Span,
} from '../../components'
import { isValidResponse, convertStrToFormat, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import { Modal, Col, Row, Button, Upload } from 'antd'
import moment from 'moment'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
const XLSX = require('xlsx')

const CreateUser = () => {
	const dispatch = useDispatch()
	const ref = useRef()
	const [fieldError, setFieldError] = useState({})
	const [select, setSelect] = useState({})
	const [dataList, setDataList] = useState([])
	const [dataImport, setDataImport] = useState([])
	const [lotList, setLotList] = useState([])

	useEffect(() => {
		Promise.all([LIST.ALL_COUNT_LOT()]).then((e) => {
			setLotList(e[0])
		})
		setSelect((e) => ({ ...e, vif_store: 'no', vif_type: '2' }))
	}, [])

	const handleChangeSelect = (v, name) => {
		setSelect((e) => ({ ...e, [name]: v }))
	}

	const validateFields = () => {
		let errors = {}
		let formIsValid = true
		if (!select?.rank) {
			formIsValid = false
			errors['rank'] = 'กรุณาเลือก rank'
		}
		if (!select?.credit_vif) {
			formIsValid = false
			errors['credit_vif'] = 'กรุณาเลือกวงเงิน'
		}
		if (dataImport.length === 0) {
			formIsValid = false
			errors['dataImport'] = 'กรุณาเลือกข้อมูลนำเข้า'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleClick = {
		handleOpenCsv: (file) => {
			const typeFilesAccept = [
				'.csv',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
			]
			if (typeFilesAccept.includes(file.type)) {
				const fileReader = new FileReader()
				fileReader.readAsBinaryString(file)
				fileReader.onload = (event) => {
					const data = event.target.result
					const workbook = XLSX.read(data, {
						type: 'binary',
					})
					let obj = XLSX.utils.sheet_to_row_object_array(
						workbook.Sheets[workbook.SheetNames[0]]
					)
					setDataImport(obj)
				}
			}
		},
		onRemove: () => {
			setDataImport([])
			setDataList([])
		},
		handlecheck: () => {
			if (validateFields()) {
				dispatch(loadingAction(true))
				const data = dataImport.map((e, i) => {
					return {
						key: i,
						no: i + 1,
						name: e.name,
						idcard: e.idcard,
						rank: select?.rank,
						vif_store: select?.vif_store === 'yes' ? 'ใช่' : 'ไม่ใช่',
						credit_vif: convertStrToFormat(select?.credit_vif, 'money_digit'),
						vif_type: select?.vif_type === '2' ? 'เครดิต' : 'เติมเงิน',
						user_adviser: e.user_adviser,
						name_user: e.comment_detail,
						address: e.address,
						city: e.city,
						district: e.district,
						province: e.province,
						postcode: e.postcode,
					}
				})
				setDataList(data)
				dispatch(loadingAction(false))
			}
		},
		handleCreateUser: async () => {
			if (validateFields()) {
				let data = dataImport.map((e) => {
					return {
						...e,
						user_registered: moment().format('YYYY-MM-HH HH:mm:ss'),
						store: 'yes',
						type_agent: 'sell',
						card_ins: 'no',
						card_ins_type: 'N',
						card_ins_life: 'no',
						card_ins_type_life: 'N',
						idcard: e.idcard || '',
						user_adviser: e.user_adviser || '',
						rank: select?.rank,
						type_sub: 'fin',
						credit_money: 0,
						credit_money_plus: 0,
						vif: 'yes',
						vif_store: select?.vif_store,
						status_vif: 1,
						credit_vif_total: select?.credit_vif,
						credit_vif_cur: select?.credit_vif,
						credit_vif_use: 0,
						role: 1,
						vif_type: select?.vif_type,
						tax_status: 'no',
					}
				})
				const params = {
					obj: data,
				}
				Modal.confirm({
					title: 'ต้องการ import user?',
					onOk: async () => {
						const API = systemController()
						const res = await API.createUser(params)
						if (isValidResponse(res)) {
							if (res.message === 'เพิ่มผู้ใช้งานสำเร็จ') {
								Promise.all([LIST.ALL_COUNT_LOT()]).then((e) => {
									setLotList(e[0])
								})
								Modal.success({
									title: res.message,
								})
							} else {
								Modal.warning({
									title: res.message,
								})
							}
						}
					},
				})
			}
		},
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
			title: 'รหัสผู้ใช้งาน',
			dataIndex: 'cuscode',
			key: 'cuscode',
			width: 100,
		},
		{
			title: 'ชื่อ ตรอ.',
			dataIndex: 'name',
			key: 'name',
			width: 200,
		},
		{
			title: 'ชื่อลูกค้า',
			dataIndex: 'name_user',
			key: 'name_user',
			width: 150,
		},
		{
			title: 'rank',
			dataIndex: 'rank',
			key: 'rank',
			width: 50,
		},
		{
			title: 'สำนักงานฟิน',
			dataIndex: 'vif_store',
			key: 'vif_store',
			width: 50,
		},
		{
			title: 'วงเงิน',
			dataIndex: 'credit_vif',
			key: 'credit_vif',
			width: 100,
		},
		{
			title: 'ประเภทวงเงิน',
			dataIndex: 'vif_type',
			key: 'vif_type',
			width: 50,
		},
		{
			title: 'ที่อยู่',
			dataIndex: 'address',
			key: 'address',
			width: 150,
		},
		{
			title: 'อำเภอ',
			dataIndex: 'city',
			key: 'city',
			width: 50,
		},
		{
			title: 'ตำบล',
			dataIndex: 'district',
			key: 'district',
			width: 50,
		},
		{
			title: 'จังหวัด',
			dataIndex: 'province',
			key: 'province',
			width: 50,
		},
		{
			title: 'รหัสไปรษณีย์',
			dataIndex: 'postcode',
			key: 'postcode',
			width: 50,
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>Import User</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							ข้อมูล
						</Label>
						<Box>
							<Row gutter={[16, 8]} style={{ marginTop: '20px' }}>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>Import File</Label>
										<Upload
											ref={ref}
											maxCount={1}
											beforeUpload={handleClick.handleOpenCsv}
											onRemove={handleClick.onRemove}
											accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
										>
											<Button
												icon={<UploadOutlined />}
												style={{ marginTop: '5px', width: '200px' }}
											>
												เลือกไฟล์
											</Button>
										</Upload>
										{fieldError.errors?.dataImport &&
											dataImport.length === 0 && (
												<Span color='red'>กรุณาเลือกไฟล์ให้ถูกต้อง</Span>
											)}
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>rank</Label>
										<Select
											name='rank'
											value={select.rank}
											placeholder='กรุณาเลือก rank'
											options={[
												{ value: '1', text: '1' },
												{ value: '2', text: '2' },
												{ value: '3', text: '3' },
												{ value: '4', text: '4' },
												{ value: '5', text: '5' },
												{ value: '6', text: '6' },
												{ value: '7', text: '7' },
												{ value: '8', text: '8' },
												{ value: '9', text: '9' },
												{ value: '10', text: '10' },
											]}
											notvalue
											onChange={(v) => handleChangeSelect(v, 'rank')}
											error={fieldError.errors?.rank}
										/>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>ผ่อนไม่หักคอม</Label>
										<Select
											name='vif_store'
											value={select.vif_store}
											placeholder='กรุณาเลือกผ่อนไม่หักคอม'
											options={[
												{ value: 'yes', text: 'ใช่' },
												{ value: 'no', text: 'ไม่ใช่' },
											]}
											notvalue
											onChange={(v) => handleChangeSelect(v, 'vif_store')}
										/>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>วงเงิน</Label>
										<Select
											name='credit_vif'
											value={select.credit_vif}
											placeholder='กรุณาเลือกวงเงิน'
											options={[
												{ value: '0', text: '0 บาท' },
												{ value: '10000', text: '10,000 บาท' },
												{ value: '15000', text: '15,000 บาท' },
												{ value: '30000', text: '30,000 บาท' },
												{ value: '50000', text: '50,000 บาท' },
											]}
											notvalue
											onChange={(v) => handleChangeSelect(v, 'credit_vif')}
											error={fieldError.errors?.credit_vif}
										/>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>ประเภทวงเงิน</Label>
										<Select
											name='vif_type'
											value={select.vif_type}
											placeholder='กรุณาเลือกประเภทวงเงิน'
											options={[
												{ value: '1', text: 'เติมเงิน' },
												{ value: '2', text: 'เครดิต' },
											]}
											notvalue
											onChange={(v) => handleChangeSelect(v, 'vif_type')}
										/>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='150'>
										<Buttons
											className='success-btn'
											onClick={handleClick.handlecheck}
											style={{ width: '150px', marginTop: '27px' }}
										>
											<EyeOutlined style={{ marginRight: '5px' }} />
											ตรวจสอบข้อมูล
										</Buttons>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='150'>
										<Buttons
											className='select-btn'
											onClick={handleClick.handleCreateUser}
											style={{ width: '150px', marginTop: '27px' }}
										>
											<PlusCircleOutlined style={{ marginRight: '5px' }} />
											สร้างผู้ใช้งาน
										</Buttons>
									</Box>
								</Col>
							</Row>
							<Row gutter={[16, 8]} style={{ marginTop: '20px' }}>
								<Col>
									<Box className='filter-input' width='200'>
										<Label>lot</Label>
										<Select
											name='lot'
											value={select?.lot}
											placeholder='กรุณาเลือก lot'
											options={lotList}
											notvalue
											onChange={(v) => handleChangeSelect(v, 'lot')}
										/>
									</Box>
								</Col>
								<Col>
									<Box className='filter-input' width='150'>
										{ExportExcel(select.lot)}
									</Box>
								</Col>
							</Row>
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
				</Box>
			</Box>
		</Container>
	)
}

export default CreateUser

const ExportExcel = (lot) => {
	const handleClickExport = async () => {
		let workbook = new Excel.Workbook()
		const worksheet = workbook.addWorksheet('รัน FNG')

		const columns = [{ width: 10 }, { width: 15 }, { width: 30 }]
		const borders = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' },
		}
		const textCenter = { vertical: 'middle', horizontal: 'center' }

		const API = systemController()
		const res = await API.getCuscodeByLot(lot)
		if (isValidResponse(res)) {
			const header = ['ลำดับ', 'รหัสผู้ใช้งาน', 'ชื่อตรอ.']
			const data = await res.result
			const dataList = data.map((e, i) => {
				return [i + 1, e.cuscode, e.name]
			})

			let dataCell = []

			dataCell.push(header, ...dataList)
			dataCell.forEach((e, i) => (worksheet.getRow(1 + i).values = e))

			dataCell.forEach((e, i) => {
				e.forEach((el, il) => {
					worksheet.getRow(1 + i).getCell(1 + il).border = borders

					worksheet.getRow(1 + i).getCell(1 + il).alignment = textCenter
				})
			})

			worksheet.columns = columns

			workbook.xlsx.writeBuffer().then((data) => {
				const blob = new Blob([data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				})
				let nameFile = `รัน FNG`
				saveAs(blob, nameFile)
			})
		}
	}

	return (
		<Buttons
			className='select-btn'
			disabled={!lot}
			onClick={handleClickExport}
			style={{ width: '150px', marginTop: '27px' }}
		>
			<EyeOutlined style={{ marginRight: '5px' }} />
			export
		</Buttons>
	)
}
