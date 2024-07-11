import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { systemController } from '../../apiServices'
import { PlusCircleOutlined } from '@ant-design/icons'
import {
	Box,
	Container,
	Input,
	Label,
	Table,
	Select,
	Button,
} from '../../components'
import { isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { Modal } from 'antd'
import _ from 'lodash'

const CreateUserAdmin = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [cuscode, setCuscode] = useState('')
	const [countUser, setCountUser] = useState('1')

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))

		const API = systemController()
		const res = await API.getUserAdmin(cuscode)

		if (isValidResponse(res)) {
			const { result } = res
			const sortData = _.orderBy(result, 'ID', 'desc')
			const data = sortData.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					cuscode: e.cuscode,
				}
			})

			setDataList(data)
			dispatch(loadingAction(false))
		}
	}, [dispatch, cuscode])

	const handleClick = {
		handleSearch: () => {
			fetchData()
		},
		handleCreateUser: async () => {
			const params = {
				cuscode,
				countUser,
			}

			Modal.confirm({
				title: 'ต้องการเปิดสิทธิ์แอดมิน?',
				onOk: async () => {
					const API = systemController()
					const res = await API.createUserAdmin(params)
					console.log(res)
					if (isValidResponse(res)) {
						if (res.message === 'เพิ่มผู้ใช้งานสำเร็จ') {
							Modal.success({
								title: res.message,
							})
							fetchData()
						} else {
							Modal.warning({
								title: res.message,
							})
						}
					}
				},
			})
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
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>เพิ่มผู้ใช้งานแอดมินของ ตรอ.</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							กรองข้อมูล
						</Label>
						<Box className='filter-box'>
							<Box className='filter-input' width='200'>
								<Label>รหัสตรอ.</Label>
								<Input.Search
									onSearch={handleClick.handleSearch}
									placeholder='ระบุรหัสตรอ'
									enterButton
									value={cuscode}
									onChange={(e) => setCuscode(e.target.value)}
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Label>จำนวนแอดมิน</Label>
								<Select
									name='countUser'
									value={countUser}
									options={[
										{ value: '1', text: '1 user' },
										{ value: '2', text: '2 user' },
										{ value: '3', text: '3 user' },
										{ value: '4', text: '4 user' },
										{ value: '5', text: '5 user' },
										{ value: '6', text: '6 user' },
										{ value: '7', text: '7 user' },
										{ value: '8', text: '8 user' },
										{ value: '9', text: '9 user' },
										{ value: '10', text: '10 user' },
									]}
									notvalue
									onChange={(value) => setCountUser(value)}
								/>
							</Box>
							<Box className='filter-input' width='200'>
								<Button
									className='select-btn'
									onClick={handleClick.handleCreateUser}
									style={{ width: '150px' }}
								>
									<PlusCircleOutlined style={{ marginRight: '5px' }} />
									สร้างผู้ใช้งาน
								</Button>
							</Box>
						</Box>
					</Box>
					<Box className='report-table' style={{ width: '50%' }}>
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

export default CreateUserAdmin
