import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { companyController } from '../../apiServices'
import { Box, Container, Input, Label, Table } from '../../components'
import { isValidResponse } from '../../helpers'
import { loadingAction } from '../../actions'
import { Switch, message } from 'antd'

const CompanyOnVif = () => {
	const dispatch = useDispatch()
	const [dataList, setDataList] = useState([])
	const [search, setSearch] = useState('')
	const companyList = [
		{ title: 'เคดับบลิวไอประกันภัย', onPrb: '1', onIns: '3s' },
		{ title: 'ฟอลคอนประกันภัย', onPrb: '2', onIns: '' },
		{ title: 'ไทยศรีประกันภัย', onPrb: '3', onIns: '' },
		{ title: 'อินทรประกันภัย(สาขาสีลม)', onPrb: '4', onIns: '' },
		{ title: 'คุ้มภัยโตเกียวมารีนประกันภัย', onPrb: '5', onIns: '1s' },
		{ title: 'เจมาร์ทประกันภัย (เจพี)', onPrb: '6', onIns: '' },
		{ title: 'ไทยเศรษฐกิจประกันภัย', onPrb: '7', onIns: '' },
		{ title: 'แอกซ่าประกันภัย', onPrb: '8', onIns: '6s' },
		{ title: 'วิริยะประกันภัย', onPrb: '9', onIns: '4s' },
		{ title: 'ทิพยประกันภัย', onPrb: '10', onIns: '' },
		{ title: 'ชับบ์สามัคคีประกันภัย', onPrb: '11', onIns: '2s' },
		{ title: 'บริษัทกลาง', onPrb: '12', onIns: '' },
		{ title: 'เมืองไทยประกันภัย', onPrb: '13', onIns: '5s' },
	]

	const fetchData = useCallback(async () => {
		dispatch(loadingAction(true))
		const API = companyController()
		const res = await API.getOnCompanyAll()
		if (isValidResponse(res)) {
			const { result } = res
			const data = result.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					...e,
				}
			})

			setDataList(data)
			dispatch(loadingAction(false))
		}
	}, [dispatch])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleChang = {
		OnPrbClick: async (checked, company) => {
			dispatch(loadingAction(true))
			const item = companyList.find(({ title }) => title === company)
			const params = {
				company,
				prb_rank: checked ? item.onPrb : '99',
				type: 'prb',
			}
			const API = companyController()
			const res = await API.changOnCompanyAll(params)
			if (isValidResponse(res)) {
				message.success(res.message)
				await fetchData()
				dispatch(loadingAction(false))
			} else {
				message.success('ปรับข้อมูลไม่สำเร็จ')
				dispatch(loadingAction(false))
			}
		},
		OnInsClick: async (checked, company) => {
			dispatch(loadingAction(true))
			const item = companyList.find(({ title }) => title === company)
			const params = {
				company,
				insure_rank: checked ? item.onIns : '99',
				type: 'ins',
			}
			const API = companyController()
			const res = await API.changOnCompanyAll(params)
			if (isValidResponse(res)) {
				message.success(res.message)
				await fetchData()
				dispatch(loadingAction(false))
			} else {
				message.success('ปรับข้อมูลไม่สำเร็จ')
				dispatch(loadingAction(false))
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
			title: 'บริษัท',
			dataIndex: 'company_name',
			key: 'company_name',
			align: 'center',
			width: 300,
		},
		{
			title: 'ขึ้นระบบ พรบ',
			dataIndex: 'prb_rank',
			key: 'prb_rank',
			align: 'center',
			width: 50,
			render: (value, row) => {
				return (
					<Label>
						<Switch
							checkedChildren='on'
							unCheckedChildren='off'
							checked={companyList.map((e) => e.onPrb).includes(value)}
							onChange={(checked) =>
								handleChang.OnPrbClick(checked, row.company_name)
							}
						/>
					</Label>
				)
			},
		},
		{
			title: 'ขึ้นระบบ ประกัน',
			dataIndex: 'insure_rank',
			key: 'insure_rank',
			align: 'center',
			width: 50,
			render: (value, row) => {
				return (
					companyList
						.filter((e) => e.onIns)
						.map((e) => e.title)
						.includes(row.company_name) && (
						<Label>
							<Switch
								checkedChildren='on'
								unCheckedChildren='off'
								checked={companyList.map((e) => e.onIns).includes(value)}
								onChange={(checked) =>
									handleChang.OnInsClick(checked, row.company_name)
								}
							/>
						</Label>
					)
				)
			},
		},
	]

	const data = dataList
		.filter(
			(e) => e.company_name.toLowerCase().indexOf(search.toLowerCase()) !== -1
		)
		.map((e, i) => {
			return {
				...e,
				no: i + 1,
			}
		})

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>บริษัทประกันขึ้นระบบ</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
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
							pagination={false}
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default CompanyOnVif
