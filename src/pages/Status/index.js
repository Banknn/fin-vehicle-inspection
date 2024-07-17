import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Modal, Row, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { DetailLayout } from '../Layout'
import {
	calCompulsoryTaxDay,
	calProtectDate,
	convertStrToFormat,
	convertCC,
	filterAddress,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	checkIdCard,
	getYearPrb,
	getSeriesPrb,
	getSubSeriesPrb,
	setFilesSuccess,
	removeStoreCustomer,
	checkRemoveOnSuccess,
} from '../../helpers'
import {
	SearchOutlined,
	WalletOutlined,
} from '@ant-design/icons'
import {
	Box,
	Button,
	DatePickerWithLabel,
	Input,
	Label,
	Select,
	Span,
	Radio,
  Container,
  Table,
} from '../../components'
import {
	addressController,
	paymentController,
	systemController,
} from '../../apiServices'
import { loadingAction, customerAction, orderAction } from '../../actions'
import { THEME } from '../../themes'
import { orderReducer } from '../../reducers/orderReducer'

const Status = () => {

  const dispatch = useDispatch()

  const [workType, setWorkType] = useState()
  const [typeInsure, setTypeInsure] = useState()
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])

  const fetchVehicle = async()=>{
    dispatch(loadingAction(true))
    const params = {
      "filter": "ประกันรถ",
      "keyword": '',
      "offset": ""
    }
    const API = systemController()
    const res = await API.getFollowAll(params)
    if(isValidResponse(res)) {
      let arr = res.result
      arr = arr.map((e,i)=>{
        return {
          key: i,
          no: i+1,
          info: (
            <Button
              style={{
                border: 'none',
                padding: '5px 20px 5px 20px',
                borderRadius: '5px',
                background: THEME.COLORS.RED_2,
                color: THEME.COLORS.WHITE
              }}
              onClick={()=>{
                dispatch(orderAction(e))
                redirect(`${ROUTE_PATH.STATUS.LINK}/detail`)
              }}
            >
              ดูข้อมูล
            </Button>
          ),
          quonum: e.quo_num,
          name: e.name,
          idcar: `${e.idcar} ${e.carprovince}`,
          tel: convertStrToFormat(e.tel, 'phone_number'),
          status: 
            e.status === 'success' ? 'ชำระเงินเรียบร้อย' : 
            e.status === 'success-waitinstall' ? 'รอชำระเงิน' : 
            '-',
        }
      })
      setResult(arr)
      dispatch(loadingAction(false))
    }
    dispatch(loadingAction(false))
  }

  useEffect(()=>{
    fetchVehicle()
  },[])

  const searchFilter = (arr) => {
    return arr.filter((item)=>
      item.quonum.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.idcar.toLowerCase().includes(search.toLowerCase())
    )
  }

  const columns = [
		{
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 100,
		},
		{
			title: 'ดูข้อมูล',
			dataIndex: 'info',
			key: 'info',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขรายการ',
			dataIndex: 'quonum',
			key: 'quonum',
			align: 'center',
			width: 200 ,   
		},
		{
			title: 'ชื่อ - นามสกุล',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 200,
		},
		{
			title: 'เลขทะเบียน',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 200,
		},
		{
			title: 'เบอร์โทรศัพท์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
			width: 200,
		},
		{
			title: 'สถานะ',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: 200,
		},
  ]

  const workTypeList = [
    {
      text: 'งาน Active',
      value: 'งาน Active',
    },
    {
      text: 'ติดปัญหา',
      value: 'ติดปัญหา',
    },
    {
      text: 'ยกเลิกแล้ว',
      value: 'ยกเลิกแล้ว',
    },
  ]

  const typeInsureList = [
    {
      text: 'ต่อภาษี',
      value: 'ต่อภาษี',
    },
  ]

  return (
    <>
			<Container className='report-container'>
        <Box>
					<Label className='title-form'>ติดตามสถานะ</Label>
					<Box className='report-wrapper'>
						<Box className='filter-box-wrapper'>
							<Label className='title-second-form' noLine>
								กรองข้อมูล
							</Label>
							<Box className='filter-box'>
                <Box className='filter-input' width='200'>
									<Label>ประเภทประกัน</Label>
									<Select
										name='type'
										placeholder='เลือกประเภทประกัน'
										options={typeInsureList}
										onChange={(e) => {setTypeInsure(e)}}
                    value={(typeInsure)}
                    disabled
                  />
								</Box>
                <Box className='filter-input' width='200'>
									<Label>ประเภทงาน</Label>
									<Select
										name='type'
										placeholder='เลือกประเภทงาน'
										options={workTypeList}
										onChange={(e) => {setWorkType(e)}}
                    value={(workType)}
                    disabled
                  />
								</Box>
								<Box className='filter-input' width='200'>
									<Label>ค้นหา</Label>
									<Input
                    value={search}
										placeholder='ค้นหาเลขรายการ ทะเบียน ชื่อ'
										onChange={(e) => {setSearch(e.target.value)}}
									/>
								</Box>
								{/* <Box className='filter-input' width='100'>
									<Button className='select-btn' onClick={()=>{}}>
										<SearchOutlined style={{ marginRight: '5px' }} />
										ค้นหา
									</Button>
								</Box> */}
							</Box>
						</Box>
            <Box className='report-table'>
              <Table
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={searchFilter(result)}
                className='report-data-table'
                size='middle'
              />
            </Box>
					</Box>
				</Box>
			</Container>
		</>
  )
}

export default Status