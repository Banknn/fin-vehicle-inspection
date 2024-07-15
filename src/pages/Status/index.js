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
import { loadingAction, customerAction } from '../../actions'

const Status = () => {

  const [workType, setWorkType] = useState()
  const [typeInsure, setTypeInsure] = useState()
  const [search, setSearch] = useState()

  const columns = [
		{
			title: 'ดูข้อมูล',
			dataIndex: 'info',
			key: 'info',
			align: 'center',
			width: 150,
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
								<Box className='filter-input' width='100'>
									<Button className='select-btn' onClick={()=>{}}>
										<SearchOutlined style={{ marginRight: '5px' }} />
										ค้นหา
									</Button>
								</Box>
							</Box>
						</Box>
            <Box className='report-table'>
              <Table
                // rowSelection={rowSelection}
                columns={columns}
                // dataSource={data}
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