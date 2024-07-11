import { Modal } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadingAction } from '../../actions'
import {
	externalController,
	systemController,
	taskController,
} from '../../apiServices'
import { Box, Button, Container, Label, Table } from '../../components'
import { isValidResponse } from '../../helpers'

const CancelInsurance = () => {
	const [dataList, setDataList] = useState([])
	const dispatch = useDispatch()

	const fetchData = useCallback(async () => {
		const API = systemController()
		const res = await API.getWaitCancelInsuranceAdminVif()
		if (isValidResponse(res)) {
			const { result } = res
			const dataList = result.map((e, i) => {
				return {
					key: i,
					no: i + 1,
					cuscode: e.id_cus,
					name: e.name,
					quo_num: e.quo_num,
					filePRB: e.bill_copyprb,
					fileInsure: e.bill_copyinsurance,
					fileBill: e.bill_slip,
					reason: e.status_detail,
					statusPay: e.status_pay,
					company: e.company,
					company_prb: e.company_prb,
					datestart: e.datestart,
				}
			})
			setDataList(dataList)
		}
	}, [])

	useEffect(() => {
		fetchData()
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
			title: 'รหัสนายหน้า',
			dataIndex: 'cuscode',
			key: 'cuscode',
			align: 'center',
			width: 200,
		},
		{
			title: 'ชื่อตรอ.',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'รหัสรายการ',
			dataIndex: 'quo_num',
			key: 'quo_num',
			align: 'center',
			width: 200,
		},
		{
			title: 'เหตุผล',
			dataIndex: 'reason',
			key: 'reason',
			align: 'center',
			width: 200,
		},
		{
			title: 'วันที่ทำรายการ',
			dataIndex: 'datestart',
			key: 'datestart',
			align: 'center',
			width: 200,
		},
		{
			title: 'บริษัทพรบ.',
			dataIndex: 'company_prb',
			key: 'company_prb',
			align: 'center',
			width: 200,
		},
		{
			title: 'ไฟล์ พ.ร.บ.',
			dataIndex: 'filePRB',
			key: 'filePRB',
			align: 'center',
			width: 150,
			render: (text) => {
				return text ? (
					<Label
						className='status'
						status='active'
						onClick={() => window.open(text, '__blank')}
					>
						เปิด
					</Label>
				) : (
					'-'
				)
			},
		},
		{
			title: 'บริษัทประกัน',
			dataIndex: 'company',
			key: 'company',
			align: 'center',
			width: 200,
		},
		{
			title: 'ไฟล์กรมธรรม์',
			dataIndex: 'fileInsure',
			key: 'fileInsure',
			align: 'center',
			width: 150,
			render: (text) => {
				return text ? (
					<Label
						className='status'
						status='active'
						onClick={() => window.open(text, '__blank')}
					>
						เปิด
					</Label>
				) : (
					'-'
				)
			},
		},
		{
			title: 'สลิปค่ายกเลิก',
			dataIndex: 'fileBill',
			key: 'fileBill',
			align: 'center',
			width: 150,
			render: (text) => {
				return text ? (
					<Label
						className='status'
						status='active'
						onClick={() => window.open(text, '__blank')}
					>
						เปิด
					</Label>
				) : (
					'-'
				)
			},
		},
		{
			title: 'สถานะการชำระ',
			dataIndex: 'statusPay',
			key: 'statusPay',
			align: 'center',
			width: 150,
		},
		{
			title: 'ทำรายการ',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				const handleClickCancel = () => {
					Modal.confirm({
						title: 'ยกเลิกหรือไม่',
						onOk: async () => {
							const params = {
								quo_num: record.quo_num,
								reason: record.reason,
								id_cus: record.cuscode,
								send_from: 'ตรอ',
							}
							console.log(params)
							const API = externalController()
							const taskAPI = taskController()
							if (record.company_prb === 'แอกซ่าประกันภัย') {
								const res = await API.axaCanceldd(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company_prb === 'เมืองไทยประกันภัย') {
								const res = await API.mtiCancel(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.message,
									})
								}
							} else if (record.company_prb === 'อินทรประกันภัย(สาขาสีลม)') {
								const res = await API.intraPrbCancel(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company_prb === 'ไทยเศรษฐกิจประกันภัย') {
								const res = await API.thaiSetakijPrbCancel(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company_prb === 'เคดับบลิวไอประกันภัย') {
								const res = await API.kwiCancel(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company_prb === 'ไทยศรีประกันภัย') {
								const res = await API.thaisriCancelPrb(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company_prb === 'ฟอลคอนประกันภัย') {
								const res = await API.fciCancelPrb(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							}

							if (record.company === 'ไทยศรีประกันภัย') {
								const res = await API.thaisriCancelInsure(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company === 'เคดับบลิวไอประกันภัย') {
								const res = await API.kwiCancelInsure(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company === 'เมืองไทยประกันภัย') {
								const res = await API.mtiCancelInsure(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							} else if (record.company === 'แอกซ่าประกันภัย') {
								const res = await API.axaCancelInsure(params)
								if (isValidResponse(res)) {
									console.log(res)
									Modal.success({
										title: res.data.message,
									})
								}
							}

							const taskRes = await taskAPI.saveCancelTask(params)
							if (isValidResponse(taskRes)) {
								if (taskRes.substr(-7) === 'SUCCESS') {
									Modal.success({
										title: 'ยกเลิกสำเร็จ',
									})
									await fetchData()
								}
							} else {
								Modal.error({
									title: 'ยกเลิกไม่สำเร็จ',
								})
							}
						},
					})
				}
				return (
					<Button className='select-btn' onClick={handleClickCancel}>
						ยกเลิก
					</Button>
				)
			},
		},
		{
			title: 'ยกเลิกรายการ',
			dataIndex: 'cancelWait',
			key: 'cancelWait',
			align: 'center',
			render: (text, record) => {
				const handelClickCancelWait = () => {
					Modal.confirm({
						title: 'คุณต้องการดึงรายการคืนนี้หรือไม่',
						onOk: async () => {
							dispatch(loadingAction(true))
							const API = systemController()
							const res = await API.cancelWaitInsuranceVif(record.quo_num)
							if (isValidResponse(res)) {
								Modal.success({
									title: 'ดึงรายการคืนสำเร็จ',
								})
								await fetchData()
								dispatch(loadingAction(false))
							} else {
								Modal.error({
									title: 'ดึงรายการคืนไม่สำเร็จ',
								})
								dispatch(loadingAction(false))
							}
						},
						okText: 'ใช่',
						cancelText: 'ไม่',
					})
				}
				return (
					<Button
						className='remove-btn'
						width='150'
						onClick={handelClickCancelWait}
					>
						ดึงรายการคืน
					</Button>
				)
			},
		},
	]

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>ยกเลิกกรมธรรม์</Label>
				<Box className='report-wrapper'>
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

export default CancelInsurance
