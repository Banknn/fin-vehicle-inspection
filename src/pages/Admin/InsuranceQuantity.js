import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { systemController } from '../../apiServices'
import {
	Box,
	Container,
	Label,
	Table,
	Select,
	Button,
	DatePicker,
} from '../../components'
import { isValidResponse, LIST } from '../../helpers'
import { loadingAction } from '../../actions'
import moment from 'moment'

const InsuranceQuantity = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [vifList, setVifList] = useState([])
	const [cuscode, setCuscode] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [type, setType] = useState('prb')

	const handleFetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const start = moment(startDate).format('YYYY-MM-DD')
		const end = moment(endDate).format('YYYY-MM-DD')
		const params = {
			startDate: moment(`${start} 00:00:00`).format('YYYY-MM-DD HH:mm:ss'),
			endDate: moment(`${end} 23:59:59`).format('YYYY-MM-DD HH:mm:ss'),
			cuscode,
			type,
		}
		const API = systemController()
		const res = await API.getCompanyInsuranceQuantity(params)
		if (isValidResponse(res)) {
			const { result } = res
			let dataList = result[0].filter((e) => e.qty > 0)
			dataList = dataList.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					company: e.company,
					qty: e.qty,
				}
			})
			setDataList(dataList)
			dispatch(loadingAction(false))
		}
	}, [cuscode, dispatch, type, startDate, endDate])

	useEffect(() => {
		setStartDate(moment(new Date('06-01-2021')))
		setEndDate(moment(new Date()))
		Promise.all([LIST.VIF_ACTIVE()]).then((e) => setVifList(e[0]))
	}, [])

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 50,
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 200,
		},
		{
			title: 'จำนวน',
			dataIndex: 'qty',
			key: 'qty',
			align: 'center',
			width: 200,
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>รายการจำนวนกรมธรรม์</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='200'>
								<Label className='filter-label'>ตั้งแต่วันที่</Label>
								<DatePicker
									name='startDate'
									value={startDate}
									placeholder='ตั้งแต่วันที่'
									format='DD/MM/YYYY'
									onChange={(e) => setStartDate(e)}
									notvalue
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label className='filter-label'>ถึงวันที่</Label>
								<DatePicker
									name='endDate'
									value={endDate}
									placeholder='ถึงวันที่'
									format='DD/MM/YYYY'
									onChange={(e) => setEndDate(e)}
									notvalue
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label>ตรอ.</Label>
								<Select
									name='cuscode'
									placeholder='เลือกตรอ.'
									showSearch
									options={vifList}
									onChange={(value) => setCuscode(value)}
									notvalue
									allowClear
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label>ประเภทประกัน</Label>
								<Select
									name='type'
									value={type}
									placeholder='เลือกตรอ.'
									options={[
										{ key: 0, value: 'prb', text: 'พ.ร.บ.' },
										{ key: 1, value: 'insure', text: 'ประกันรถ' },
									]}
									onChange={(value) => setType(value)}
									notvalue
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Button className='select-btn' onClick={handleFetchData}>
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

export default InsuranceQuantity
