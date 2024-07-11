import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { systemController } from '../../apiServices'
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
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

const LogApiCompany = () => {
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
		const API = systemController()
		const res = await API.getLogApiCompany(params)
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
			title: 'เลขรายการ',
			dataIndex: 'key_quo_num',
			key: 'key_quo_num',
			align: 'center',
			width: 150,
		},
		{
			title: 'เลขทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 100,
		},
    {
			title: 'สถานะงาน',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 100,
		},
		{
			title: 'policyno',
			dataIndex: 'policyno',
			key: 'policyno',
			align: 'center',
			width: 100,
		},
		{
			title: 'company',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 150,
		},
		{
			title: 'ประเภทงาน',
			dataIndex: 'policy_type',
			key: 'policy_type',
			align: 'center',
			width: 100,
			render: (value) => {
				return <Label>{value === 'VMI' ? 'ประกัน' : 'พรบ'}</Label>
			},
		},
		{
			title: 'แจ้งเตือน',
			dataIndex: 'error_msg',
			key: 'error_msg',
			align: 'center',
			render: (value) => {
				return <Label>{value}</Label>
			},
		},
		{
			title: 'เวลาบันทึก',
			dataIndex: 'created_at',
			key: 'created_at',
			align: 'center',
			width: 150,
			render: (value) => {
				return <Label>{moment(value).format('DD-MM-YYYY HH:mm:ss')}</Label>
			},
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>ตรวจสอบ Log Api</Label>
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
										{ key: 0, value: '', text: 'เลขทะเบียนรถ' },
										{ key: 1, value: 'keyNum', text: 'เลขรายการ' },
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
										chanel === 'keyNum' ? 'ค้นหาเลขรายการ' : 'ค้นหาเลขทะเบียนรถ'
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
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default LogApiCompany
