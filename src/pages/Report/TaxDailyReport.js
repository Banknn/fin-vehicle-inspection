import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import { reportController, receiptController } from '../../apiServices'
import {
	Box,
	Button,
	Container,
	DatePicker,
	Label,
	Table,
} from '../../components'
import { isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'

const TaxDailyReport = () => {
	const dispatch = useDispatch()
	const [reportData, setReportData] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()

	const fetchData = useCallback(
		async (start, end) => {
			dispatch(loadingAction(true))

			const params = {
				startDate: start,
				endDate: end,
			}
			const API = reportController()
			const res = await API.getTaxDailyReport(params)
			if (isValidResponse(res)) {
				const { result } = res
				const data = result.map((e, i) => {
					return {
						key: i,
						...e,
						no: i + 1,
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
		fetchData(startToday, endToday)
	}, [fetchData])

	const handleFilter = async () => {
		const startSelected = moment(startDate).format('YYYY-MM-DD')
		const endSelected = moment(endDate).format('YYYY-MM-DD')
		const start = moment(`${startSelected} 00:00:00`).format(
			'YYYY-MM-DD HH:mm:ss'
		)
		const end = moment(`${endSelected} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
		setStartDate(start)
		setEndDate(end)
		await fetchData(start, end)
	}

	const genFileTax = async () => {
		dispatch(loadingAction(true))
		const API = receiptController()
		const res = await API.generateTaxShopDailyVif()
		if (isValidResponse(res)) {
			dispatch(loadingAction(false))
			const { url } = res.result

			if (url) window.open(url)
		}
	}

	const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
		},
		{
			title: 'วันที่',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			render: (value) => {
				return moment(value).format('DD-MM-YYYY HH:mm:ss')
			},
		},
		{
			title: 'เลขใบกำกับ',
			dataIndex: 'ref_num',
			key: 'ref_num',
			align: 'center',
		},
		{
			title: 'ไฟล์ใบกำกับ',
			dataIndex: 'path_file',
			key: 'path_file',
			align: 'center',
			render: (value) => {
				return (
					<Label
						color='blue'
						cursor='pointer'
						onClick={() => window.open(value)}
					>
						เปิด
					</Label>
				)
			},
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>ใบกำกับรายวัน</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box
							className='filter-table-box'
							style={{ justifyContent: 'space-between' }}
						>
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
									<Button className='select-btn' onClick={handleFilter}>
										<SearchOutlined style={{ marginRight: '5px' }} />
										ค้นหา
									</Button>
								</Box>
							</Box>

							<Box className='filter-item' style={{ marginTop: '25px' }}>
								<Button className='select-btn' width='170' onClick={genFileTax}>
									Gen ใบกำกับรายวัน
								</Button>
							</Box>
						</Box>
					</Box>
					<Box className='report-table'>
						<Table
							columns={columns}
							dataSource={reportData}
							className='report-data-table'
							size='middle'
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}
export default TaxDailyReport
