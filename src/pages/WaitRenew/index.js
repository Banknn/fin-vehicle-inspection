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
			title: 'ลำดับ',
			dataIndex: 'no',
			key: 'no',
			align: 'center',
			width: 100,
		},
		{
			title: 'รับงาน',
			dataIndex: 'accept',
			key: 'accept',
			align: 'center',
			width: 200 ,   
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
			title: 'เวลาแจ้งงาน',
			dataIndex: 'time',
			key: 'time',
			align: 'center',
			width: 200,
		},
  ]

  return (
    <>
			<Container className='report-container'>
        <Box>
					<Label className='title-form'>รอรับงานต่อภาษี</Label>
					<Box className='report-wrapper'>
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