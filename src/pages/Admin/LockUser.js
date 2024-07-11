import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { systemController, reportController } from '../../apiServices'
import { Box, Container, Input, Label, Table, Select } from '../../components'
import { isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { Switch } from 'antd'

const LockUser = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')
	const [searchCuscodeL, setSearchCuscodeL] = useState([])
	const [optionCuscode, setOptionCuscode] = useState([])

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const API = reportController()
		const res = await API.getUserVif()
		if (isValidResponse(res)) {
			const { result } = res
			const data = result.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					...e,
					status: e.status === 'no' ? 'InActive' : 'Active',
				}
			})

			setOptionCuscode(
				data.map((e) => {
					return { text: e.cuscode, value: e.cuscode }
				})
			)
			setDataList(data)
			dispatch(loadingAction(false))
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleChangStatus = async (checked, cuscode) => {
		const params = {
			cuscode,
			status: checked ? 'yes' : 'no',
		}
		const API = systemController()
		await API.lockUserVif(params)
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
			title: 'รหัสนายหน้า',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 100,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 50,
			render: (value) => {
				return (
					<Label className='status' status={value === 'Active' && 'active'}>
						{value}
					</Label>
				)
			},
		},
		{
			title: '',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 50,
			render: (value, row) => {
				return (
					<Label>
						<Switch
							checkedChildren='ล็อก'
							unCheckedChildren='ปลดล็อก'
							checked={row.status === 'Active' ? true : false}
							onChange={(checked) => handleChangStatus(checked, row.cuscode)}
						/>
					</Label>
				)
			},
		},
	]

	const data = dataList
		.filter((e) => {
			const compare =
				e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
				e.status.toLowerCase() === search.toLowerCase()
			if (searchCuscodeL.length > 0)
				return searchCuscodeL.includes(e.cuscode) && compare
			return compare
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
				<Label className='title-form'>ล็อก User</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='500'>
								<Label>ค้นหา รหัสตรอ. </Label>
								<Select
									placeholder='กรอกรหัสตรอ. คั่นด้วย , หรือช่องว่าง ระหว่างอีกรหัสตรอ.'
									mode='tags'
									onChange={(v) => {
										setSearchCuscodeL(v.map((e) => e.replaceAll(' ', '')))
									}}
									value={searchCuscodeL}
									tokenSeparators={[',', ' ']}
									options={optionCuscode}
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
									isNotForm
									onChange={(e) => setSearch(e.target.value)}
								/>
							</Box>
						</Box>
					</Box>
					<Box className='report-table'>
						<Table
							columns={columns}
							dataSource={data}
							className='report-data-table'
							size='middle'
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default LockUser
