import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { systemController, addressController } from '../../apiServices'
import { PlusCircleOutlined, EyeOutlined } from '@ant-design/icons'
import {
	Box,
	Container,
	Label,
	Table,
	Select,
	Button as Buttons,
	Input,
} from '../../components'
import {
	isValidResponse,
	convertStrToFormat,
	filterAddress,
} from '../../helpers'
import { loadingAction } from '../../actions'
import { Modal, Col, Row } from 'antd'
import _ from 'lodash'

const CreateUserByCuscode = () => {
	const dispatch = useDispatch()
	const [disInput, setdisInput] = useState(false)
	const [fieldError, setFieldError] = useState({})
	const [input, setInput] = useState({})
	const [select, setSelect] = useState({})
	const [valueChang, setValueChang] = useState({})
	const [dataList, setDataList] = useState([])
	const [address, setAddress] = useState({
		addressList: [],
		provinceList: [],
		amphoeList: [],
		districtList: [],
		postcodeList: [],
	})

	const fetchAddress = useCallback(async () => {
		const API = addressController()
		const res = await API.getAddress()
		if (isValidResponse(res)) {
			const addressRes = res.result
			const provinceObj = addressRes.map((e) => {
				return {
					key: e.province,
					value: e.province,
					text: e.province,
				}
			})
			const province = _.uniqBy(provinceObj, 'key')
			setAddress((e) => {
				return {
					...e,
					addressList: addressRes,
					provinceList: province,
				}
			})
		}
	}, [])

	useEffect(() => {
		fetchAddress()
		setSelect((e) => ({ ...e, vif_type: '2' }))
	}, [fetchAddress])

	const handleChangeInput = (v, name) => {
		setInput((e) => ({ ...e, [name]: v }))
		if (name !== 'cuscode') setValueChang((e) => ({ ...e, [name]: v }))
	}

	const handleChangeSelect = (v, name) => {
		setSelect((e) => ({ ...e, [name]: v }))
		setValueChang((e) => ({ ...e, [name]: v }))
	}

	const handleChangeAddress = (v, e, obj) => {
		const { name, value } = obj
		setSelect({ ...select, [name]: value })
		if (name === 'province') {
			const amphoe = filterAddress(name, value, address)
			setAddress({ ...address, amphoeList: amphoe })
			setSelect((prev) => {
				if (prev.province !== select.province) {
					return {
						...select,
						province: value,
						city: null,
						district: null,
						postcode: null,
					}
				}
			})
			setValueChang((e) => ({ ...e, province: value }))
		}
		if (name === 'city') {
			const district = filterAddress('amphoe', value, address)
			setAddress({ ...address, districtList: district })
			setSelect((prev) => {
				if (prev.amphoe !== select.city) {
					return {
						...select,
						city: value,
						district: null,
						postcode: null,
					}
				}
			})
			setValueChang((e) => ({ ...e, city: value }))
		}
		if (name === 'district') {
			const zipcode = filterAddress(name, value, address, select)
			setAddress({ ...address, postcodeList: zipcode })
			setSelect((prev) => {
				if (prev.district !== select.district) {
					return {
						...select,
						district: value,
						postcode: zipcode[0]?.value,
					}
				}
			})
			setValueChang((e) => ({
				...e,
				district: value,
				postcode: zipcode[0]?.value,
			}))
		}
	}

	const getListAddress = (list, objAddress) => {
		for (const [key, value] of Object.entries(list)) {
			if (key === 'province') {
				const amphoe = filterAddress(key, value, address)
				objAddress.amphoeList = amphoe
			}
			if (key === 'city') {
				const district = filterAddress('amphoe', value, address)
				objAddress.districtList = district
			}
		}

		return objAddress
	}

	const validateFields = (check) => {
		let errors = {}
		let formIsValid = true
		if (!input?.cuscode) {
			formIsValid = false
			errors['cuscode'] = 'กรุณากรอก cuscode'
		}
		if (!select?.rank && check) {
			formIsValid = false
			errors['rank'] = 'กรุณาเลือก rank'
		}
		if (!input?.credit_vif_total && check) {
			formIsValid = false
			errors['credit_vif_total'] = 'กรุณากรอกวงเงิน'
		}
		if (!input?.credit_vif_cur && check) {
			formIsValid = false
			errors['credit_vif_cur'] = 'กรุณากรอกวงเงินคงเหลือ'
		}
		if (!input?.credit_vif_use && check) {
			formIsValid = false
			errors['credit_vif_use'] = 'กรุณากรอกวงเงินที่ใช้งานแล้ว'
		}
		if (!input?.name && check) {
			formIsValid = false
			errors['name'] = 'กรุณากรอกชื่อ ตรอ.'
		}
		setFieldError({ errors })
		return formIsValid
	}

	const handleClick = {
		handleCheck: async () => {
			if (validateFields()) {
				dispatch(loadingAction(true))
				const API = systemController()
				const res = await API.getUserProFiles(input.cuscode)
				if (isValidResponse(res)) {
					if (res.message === 'ไม่พบผู้ใช้งาน') {
						Modal.success({
							title: res.message,
						})
						dispatch(loadingAction(false))
					}

					const { profile, listPay } = res.result

					const list = {
						province: profile?.province,
						city: profile?.city,
						district: profile?.district,
						postcode: profile?.postcode,
					}
					let objAddress = {
						amphoeList: [],
						districtList: [],
					}
					setdisInput(listPay.length > 0)
					setValueChang({})
					setInput((e) => ({
						...e,
						name: profile?.name,
						credit_vif_total: profile?.credit_vif_total,
						credit_vif_cur: profile?.credit_vif_cur,
						credit_vif_use: profile?.credit_vif_use,
						address: profile?.address,
					}))
					setSelect((e) => ({
						...e,
						level_vif: profile?.level_vif,
						rank: profile?.rank,
						vif_type: profile?.vif_type,
						name: profile?.name,
						display_channel: profile?.display_channel,
						display_permission: profile?.display_permission,
						region: profile?.region,
						group: profile?.group,
						address: profile?.address,
						city: profile?.city,
						district: profile?.district,
						province: profile?.province,
						postcode: profile?.postcode,
					}))
					const data = [
						{
							key: '1',
							cuscode: profile?.cuscode,
							name: profile?.name,
							comment_detail: profile?.comment_detail,
							rank: profile?.rank,
							credit_vif: convertStrToFormat(
								profile?.credit_vif_total,
								'money'
							),
							credit_vif_cur: profile?.credit_vif_cur,
							credit_vif_use: profile?.credit_vif_use,
							address: profile?.address,
							city: profile?.city,
							district: profile?.district,
							province: profile?.province,
							postcode: profile?.postcode,
							vif_type: profile?.vif_type,
							display_channel: profile?.display_channel,
							display_permission: profile?.display_permission,
							region: profile?.region,
							group: profile?.group,
							status_vip: profile?.status_vip,
						},
					]
					objAddress = await getListAddress(list, objAddress)
					setAddress({ ...address, ...objAddress })
					setDataList(data)
					dispatch(loadingAction(false))
				}
			}
		},
		handleCreateUser: async () => {
			if (validateFields('create')) {
				let status_vip = 'no'
				if (['สำนักงานฟิน', 'หน้าร้านฟิน'].includes(select?.display_permission))
					status_vip = 'yes'

				const params = {
					data_old: dataList[0],
					data_new: {
						...valueChang,
						cuscode: input.cuscode,
						tax_status: 'no',
						status_vip,
						vif: 'yes',
					},
				}
				const API = systemController()
				const res = await API.changPremissionVif(params)
				if (isValidResponse(res)) {
					Modal.success({
						title: res.message,
					})
					setValueChang({})
				}
			}
		},
	}

	const columns = [
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
			dataIndex: 'comment_detail',
			key: 'comment_detail',
			width: 150,
		},
		{
			title: 'rank',
			dataIndex: 'rank',
			key: 'rank',
			width: 50,
		},
		{
			title: 'ผ่อนไม่หัก',
			dataIndex: 'status_vip',
			key: 'status_vip',
			width: 100,
			render: (value) => {
				return <Label>{value === 'yes' ? 'ใช่' : 'ไม่ใช่'}</Label>
			},
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
			width: 100,
			render: (value) => {
				return <Label>{value === '2' ? 'เครดิต' : 'เติมเงิน'}</Label>
			},
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

	const form = {
		title: 'ข้อมูล',
		items: [
			{
				section: [
					{
						label: 'รหัส ตรอ.',
						col: 4,
						item: (
							<Input
								name='cuscode'
								placeholder='รหัส ตรอ.'
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value, 'cuscode')
								}}
								error={fieldError.errors?.cuscode}
							/>
						),
					},
					{
						label: '',
						col: 3,
						item: (
							<Box className='filter-input' width='150'>
								<Buttons
									className='success-btn'
									onClick={handleClick.handleCheck}
									style={{ width: '150px', marginTop: '27px' }}
								>
									<EyeOutlined style={{ marginRight: '5px' }} />
									ตรวจสอบข้อมูล
								</Buttons>
							</Box>
						),
					},
					{
						label: '',
						col: 3,
						item: (
							<Box className='filter-input' width='150'>
								<Buttons
									className='select-btn'
									onClick={handleClick.handleCreateUser}
									style={{ width: '150px', marginTop: '27px' }}
									disabled={dataList.length === 0 || _.isEmpty(valueChang)}
								>
									<PlusCircleOutlined style={{ marginRight: '5px' }} />
									เปิดสิทธิ์
								</Buttons>
							</Box>
						),
					},
				],
			},
			{
				section: [
					{
						label: 'rank',
						col: 4,
						item: (
							<Select
								name='rank'
								value={select?.rank}
								placeholder='เลือก rank'
								options={[
									{ value: '1', text: '1' },
									{ value: '2', text: '2' },
									{ value: '3', text: '3' },
									{ value: '4', text: '4' },
									{ value: '5', text: '5' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'rank')}
								error={fieldError.errors?.rank}
							/>
						),
					},
					// {
					// 	label: 'สิทธิ์สำนักงาน',
					// 	col: 3,
					// 	item: (
					// 		<Select
					// 			name='vif_store'
					// 			value={select?.vif_store}
					// 			placeholder='กรุณาเลือกสิทธิ์สำนักงาน'
					// 			options={[
					// 				{ value: 'yes', text: 'ใช่' },
					// 				{ value: 'no', text: 'ไม่ใช่' },
					// 			]}
					// 			notvalue
					// 			onChange={(v) => handleChangeSelect(v, 'vif_store')}
					// 		/>
					// 	),
					// },
					{
						label: 'วงเงินเครดิต',
						col: 3,
						item: (
							<Input
								name='credit_vif_total'
								placeholder='วงเงินเครดิต'
								value={convertStrToFormat(input?.credit_vif_total, 'money')}
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value.replace(',', ''), 'credit_vif_total')
								}}
								disabled={disInput}
								error={fieldError.errors?.credit_vif_total}
							/>
						),
					},
					{
						label: 'วงเงินคงเหลือ',
						col: 3,
						item: (
							<Input
								name='credit_vif_cur'
								placeholder='คงเหลือ'
								value={convertStrToFormat(input?.credit_vif_cur, 'money')}
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value.replace(',', ''), 'credit_vif_cur')
								}}
								disabled={disInput}
								error={fieldError.errors?.credit_vif_cur}
							/>
						),
					},
					{
						label: 'วงเงินที่ใช้งานแล้ว',
						col: 3,
						item: (
							<Input
								name='credit_vif_use'
								placeholder='วงเงินที่ใช้งานแล้ว'
								value={convertStrToFormat(input?.credit_vif_use, 'money')}
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value, 'credit_vif_use')
								}}
								disabled={disInput}
								error={fieldError.errors?.credit_vif_use}
							/>
						),
					},
					{
						label: 'ประเภทวงเงิน',
						col: 4,
						item: (
							<Select
								name='vif_type'
								value={select?.vif_type}
								placeholder='กรุณาเลือกประเภทวงเงิน'
								options={[
									{ value: '1', text: 'เติมเงิน' },
									{ value: '2', text: 'เครดิต' },
								]}
								notvalue
								disabled={disInput}
								onChange={(v) => handleChangeSelect(v, 'vif_type')}
							/>
						),
					},
					{
						label: 'level',
						col: 5,
						item: (
							<Select
								name='level_vif'
								value={select?.level_vif}
								placeholder='กรุณาเลือก Level'
								options={[
									{ value: 'silver', text: 'Silver' },
									{ value: 'gold', text: 'Gold' },
									{ value: 'platinum', text: 'Platinum' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'level_vif')}
							/>
						),
					},
					{
						label: 'แสดงผลชื่อ',
						col: 4,
						item: (
							<Select
								name='display_channel'
								value={select?.display_channel}
								placeholder='กรุณาเลือก'
								options={[
									{ value: 'สำนักงานฟิน', text: 'สำนักงานฟิน' },
									{ value: 'หน้าร้านฟิน', text: 'หน้าร้านฟิน' },
									{ value: 'ตรอ.', text: 'ตรอ.' },
									{ value: 'ควิกเซอร์วิส', text: 'ควิกเซอร์วิส' },
									{
										value: 'เค พี ออนไลน์ เซอร์วิส',
										text: 'เค พี ออนไลน์ เซอร์วิส',
									},
									{ value: 'ShipPOP', text: 'ShipPOP' },
									{ value: 'PP&P', text: 'PP&P' },
									{ value: 'ฟาสเซอร์วิส', text: 'ฟาสเซอร์วิส' },
									{ value: 'เพย์พอยท์ โซลูชั่น', text: 'เพย์พอยท์ โซลูชั่น' },
									{ value: 'Shop บางบอน', text: 'Shop บางบอน' },
									{ value: 'ขอใช้ระบบ', text: 'ขอใช้ระบบ' },
									{ value: 'Admin', text: 'Admin' },
									{ value: 'Direct ตรอ', text: 'Direct ตรอ' },
									{ value: 'Direct', text: 'Direct' },
                  { value: 'สหกรณ์', text: 'สหกรณ์' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'display_channel')}
							/>
						),
					},
					{
						label: 'สิทธิ์ใช้งานระบบ',
						col: 4,
						item: (
							<Select
								name='display_permission'
								value={select?.display_permission}
								placeholder='กรุณาเลือก'
								options={[
									{ value: 'สำนักงานฟิน', text: 'สำนักงานฟิน' },
									{ value: 'หน้าร้านฟิน', text: 'หน้าร้านฟิน' },
									{ value: 'ตรอ.', text: 'ตรอ.' },
									{ value: 'ตรอ.ฟิน', text: 'ตรอ.ฟิน' },
									{ value: 'Admin', text: 'Admin' },
                  { value: 'สหกรณ์', text: 'สหกรณ์' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'display_permission')}
							/>
						),
					},
					{
						label: 'ภูมิภาค',
						col: 4,
						item: (
							<Select
								name='region'
								value={select?.region}
								placeholder='กรุณาเลือก'
								options={[
									{ value: 'กรุงเทพ', text: 'กรุงเทพ' },
									{ value: 'ภาคกลาง', text: 'ภาคกลาง' },
									{ value: 'ภาคตะวันตก', text: 'ภาคตะวันตก' },
									{ value: 'ภาคตะวันออก', text: 'ภาคตะวันออก' },
									{
										value: 'ภาคตะวันออกเฉียงเหนือ',
										text: 'ภาคตะวันออกเฉียงเหนือ',
									},
									{ value: 'ภาคเหนือ', text: 'ภาคเหนือ' },
									{ value: 'ภาคใต้', text: 'ภาคใต้' },
									{ value: 'Admin', text: 'Admin' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'region')}
							/>
						),
					},
					{
						label: 'กลุ่มงาน',
						col: 4,
						item: (
							<Select
								name='group'
								value={select?.group}
								placeholder='กรุณาเลือก'
								options={[
									{ value: 'หน้าร้าน/สำนักงาน', text: 'หน้าร้าน/สำนักงาน' },
									{ value: 'Active', text: 'Active' },
									{ value: 'Non-Active', text: 'Non-Active' },
									{ value: 'Top30', text: 'Top30' },
									{ value: 'กลุ่มงานไปรษณีย์', text: 'กลุ่มงานไปรษณีย์' },
									{ value: 'New ตรอ.', text: 'New ตรอ.' },
									{ value: 'Admin', text: 'Admin' },
									{ value: 'สหกรณ์', text: 'สหกรณ์' },
								]}
								notvalue
								onChange={(v) => handleChangeSelect(v, 'group')}
							/>
						),
					},
					{
						label: 'ชื่อ ตรอ.',
						col: 6,
						item: (
							<Input
								name='name'
								placeholder='ชื่อ ตรอ.'
								value={input?.name}
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value, 'name')
								}}
								error={fieldError.errors?.name}
							/>
						),
					},
					{
						label: 'ที่อยู่',
						col: 6,
						item: (
							<Input
								name='address'
								placeholder='ที่อยู่'
								value={input?.address}
								notvalue
								onChange={(e) => {
									const { value } = e.currentTarget
									handleChangeInput(value, 'address')
								}}
								error={fieldError.errors?.address}
							/>
						),
					},
					{
						label: 'จังหวัด',
						col: 4,
						item: (
							<Select
								name='province'
								placeholder='จังหวัด'
								showSearch
								notvalue
								options={address?.provinceList}
								onChange={handleChangeAddress}
								value={select?.province}
								error={fieldError.errors?.province}
							/>
						),
					},
					{
						label: 'เขต/อำเภอ',
						col: 4,
						item: (
							<Select
								name='city'
								placeholder='เขต/อำเภอ'
								showSearch
								notvalue
								options={address?.amphoeList}
								onChange={handleChangeAddress}
								value={select?.city}
								error={fieldError.errors?.city}
							/>
						),
					},
					{
						label: 'แขวง/ตำบล',
						col: 4,
						item: (
							<Select
								name='district'
								placeholder='แขวง/ตำบล'
								showSearch
								notvalue
								options={address?.districtList}
								onChange={handleChangeAddress}
								value={select?.district}
								error={fieldError.errors?.district}
							/>
						),
					},
					{
						label: 'รหัสไปรษณีย์',
						row: true,
						col: 4,
						item: (
							<Select
								name='postcode'
								placeholder='รหัสไปรษณีย์'
								showSearch
								notvalue
								options={address?.postcodeList}
								onChange={handleChangeAddress}
								value={select?.postcode}
								error={fieldError.errors?.postcode}
							/>
						),
					},
				],
			},
		],
	}

	return (
		<Container className='report-container'>
			<Box>
				<Label className='title-form'>เปิดสิทธ์ระบบ ตรอ.</Label>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper'>
						<Label className='title-second-form' noLine>
							{form.title}
						</Label>
						<Box>
							{form.items.map((e, i) => {
								return (
									<Row key={i} gutter={[8, 8]} style={{ marginBottom: '20px' }}>
										{e.section.map((el, il) => {
											return (
												<Col xs={el.col} key={il}>
													<Box className='filter-input'>
														<Label>{el.label}</Label>
														{el.item}
													</Box>
												</Col>
											)
										})}
									</Row>
								)
							})}
						</Box>
					</Box>
					<Box className='report-table' style={{ marginBottom: '100px' }}>
						<Table
							columns={columns}
							dataSource={dataList}
							pagination={false}
							className='report-data-table'
							size='middle'
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default CreateUserByCuscode
