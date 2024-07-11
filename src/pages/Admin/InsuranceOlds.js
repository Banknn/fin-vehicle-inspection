import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { reportController } from '../../apiServices'
import {
	Box,
	Container,
	Input,
	Label,
	Table,
	Button,
	Select,
} from '../../components'
import { isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { SearchOutlined, FileDoneOutlined } from '@ant-design/icons'
import { THEME } from '../../themes'
import moment from 'moment'

const InsuranceOlds = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')
	const [chanel, setChanel] = useState('')

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))

		const params = {
			search,
			chanel,
		}
		const API = reportController()
		const res = await API.getInsuranceOlds(params)
		if (isValidResponse(res)) {
			let data = res.result
			data = data.map((e, i) => {
				return { no: i + 1, ...e }
			})
			setDataList(data)
			dispatch(loadingAction(false))
		}
		dispatch(loadingAction(false))
	}, [dispatch, chanel, search])

	const handleSearch = async () => {
		await fetchData()
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
			title: 'วันที่แจ้งงาน',
			dataIndex: 'datestart',
			key: 'datestart',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{moment(value).format('DD-MM-YYYY HH:mm:ss')}</Label>
			},
		},
		{
			title: 'เลขรายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขงาน Task',
			dataIndex: 'order_number',
			key: 'order_number',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 200,
		},
		{
			title: 'สถานะระบบ',
			dataIndex: 'status_paybill',
			key: 'status_paybill',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขใบแจ้งหนี้',
			dataIndex: 'paybill_clear_no',
			key: 'paybill_clear_no',
			align: 'center',
			width: 200,
		},
		{
			title: 'ใบเสร็จ',
			dataIndex: 'path_receipt',
			key: 'path_receipt',
			align: 'center',
			width: 200,
			render: (value) => {
				return (
					value && (
						<Label
							color='blue'
							cursor='pointer'
							onClick={() => window.open(value)}
						>
							<FileDoneOutlined
								style={{ fontSize: '22px', color: THEME.COLORS.RED }}
							/>
						</Label>
					)
				)
			},
		},
		{
			title: 'ไฟล์พรบ',
			dataIndex: 'bill_copyprb',
			key: 'bill_copyprb',
			align: 'center',
			width: 100,
			render: (value) => {
				return (
					value && (
						<Button
							className='btn-open-file'
							onClick={() => window.open(value)}
						>
							เปิด
						</Button>
					)
				)
			},
		},
		{
			title: 'ไฟล์ประกัน',
			dataIndex: 'bill_copyinsurance',
			key: 'bill_copyinsurance',
			align: 'center',
			width: 100,
			render: (value) => {
				return (
					value && (
						<Button
							className='btn-open-file'
							onClick={() => window.open(value)}
						>
							เปิด
						</Button>
					)
				)
			},
		},
		{
			title: 'สถานะงาน',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 200,
			render: (value) => {
				return <Label>{value === 'cancel' ? 'ยกเลิก' : 'ออกงานสำเร็จ'}</Label>
			},
		},
		{
			title: 'รหัสตรอ',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
		},
		{
			title: 'ชื่อ ตรอ',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 250,
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>ค้นหากรมธรรม์เดิม</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='150'>
								<Label>ช่องทางค้นหา</Label>
								<Select
									name='chanel'
									value={chanel}
									options={[
										{ key: 0, value: '', text: 'เลขรายการ' },
										{ key: 1, value: 'idcar', text: 'เลขทะเบียนรถ' },
										{ key: 3, value: 'numTask', text: 'เลขรายการ Task' },
									]}
									notvalue
									onChange={(value) => {
										setChanel(value)
									}}
								/>
							</Box>
							<Box className='filter-input' width='250'>
								<Label>ค้นหา</Label>
								<Input
									name='search'
									placeholder={
										chanel === 'idcar'
											? 'ค้นหาเลขทะเบียนรถ'
											: chanel === 'numTask'
											? 'ค้นหาเลขรายการ Task'
											: 'ค้นหาเลขรายการ'
									}
									isNotForm
									onChange={(e) => setSearch(e.target.value)}
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Button className='select-btn' onClick={handleSearch}>
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
              scroll={{ x: 1500 }}
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default InsuranceOlds
