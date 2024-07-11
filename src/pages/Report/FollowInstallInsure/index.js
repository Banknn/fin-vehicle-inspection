import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { installmentController } from '../../../apiServices'
import {
	Box,
	Button,
	Container,
	Input,
	Select,
	Label,
	Table,
} from '../../../components'
import { isValidResponse, redirect, ROUTE_PATH } from '../../../helpers'
import { loadingAction, installmentAction } from '../../../actions'

const FollowInstallInsure = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')

	const fetchData = useCallback(
		async (status) => {
			dispatch(loadingAction(true))

			const API = installmentController()
			const res = await API.getFollowInstall()
			if (isValidResponse(res)) {
				const result = res.result
				const dataFilter = result.filter((e) => {
					if (status === 'all' || !status) {
						return e
					}
					return e.status === status
				})
				let data = dataFilter.map((e) => {
					return {
						...e,
					}
				})
				console.log(data)
				setReportData(data)
				dispatch(loadingAction(false))
			}
		},
		[dispatch]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleFilter = async () => {
		await fetchData(status)
	}

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (value) => {
				return value === 'success-install' ? (
					<Label className='status' status='active'>
						ผ่อนครบแล้ว
					</Label>
				) : value === 'success-waitinstall' ? (
					<Label className='status' status='wait-cancel'>
						รอผ่อน
					</Label>
				) : (
					<Label className='status' status='cancel'>
						ยกเลิก
					</Label>
				)
			},
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
			title: 'วันที่ชำระ',
			dataIndex: 'dayPay',
			key: 'dayPay',
			align: 'center',
			render: (value) => {
				return <Label>{value ? moment(value).format('DD-MM-YYYY') : ''}</Label>
			},
		},
		{
			title: 'จำนวนงวดผ่อน',
			dataIndex: 'numpay',
			key: 'numpay',
			align: 'center',
			render: (value, record) => {
				return <Label>{`${record.countPay} / ${value}`}</Label>
			},
		},
		{
			title: 'ทำรายการ',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				const handleClick = async () => {
					dispatch(
						installmentAction({
							...record,
						})
					)
					redirect(`${ROUTE_PATH.REPORT.LINK}/follow-install-insure/detail`)
				}
				return (
					<Button className='remove-btn' width='100' onClick={handleClick}>
						ดูข้อมูล
					</Button>
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
				<Label className='title-form'>ติดตามค่างวด</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='200'>
								<Label>สถานะ</Label>
								<Select
									name='status'
									value={status}
									placeholder='สถานะ'
									options={[
										{
											key: '1',
											value: 'all',
											text: 'ทั้งหมด',
										},
										{
											key: '2',
											value: 'success-waitinstall',
											text: `รอผ่อน`,
										},
										{
											key: '3',
											value: 'cancel',
											text: 'ยกเลิกแล้ว',
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
					</Box>
				</Box>
			</Box>
		</Container>
	)
}
export default FollowInstallInsure
