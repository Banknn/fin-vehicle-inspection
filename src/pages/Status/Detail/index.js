import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Modal, Row, message, Upload } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { DetailLayout } from '../../Layout'
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
} from '../../../helpers'
import {
	UpOutlined,
  DownOutlined,
  UserOutlined,
  CarOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
  EditOutlined,
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
} from '../../../components'
import {
	addressController,
	paymentController,
	systemController,
} from '../../../apiServices'
import { loadingAction, customerAction } from '../../../actions'
import { THEME } from '../../../themes'

const { Dragger } = Upload

const Detail = () => {

  const props = {
		name: 'file',
		maxCount: 1,
		onChange(info) {
			const { status } = info.file
			if (status === 'removed') {
				setFileInput({})
			} else if (status !== 'uploading') {
				setFileInput(info)
				message.success(`${info.file.name} อัพโหลดไฟล์สำเร็จ`)
			}
		},
	}

  const [cusInfo, setCusInfo] = useState(false)
  const [carInfo, setCarInfo] = useState(false)
  const [serviceInfo, setServiceInfo] = useState(false)
  const [statusInfo, setStatusInfo] = useState(false)
  const [probInfo, setProbInfo] = useState(false)
  const [selectedBank, setSelectedBank] = useState()
  const [fileInput, setFileInput] = useState({})

  const bankList = [
    {
      value: 'ธนาคารกสิกร',
      text: 'ธนาคารกสิกร 057-8-40722-7'
    },
  ]

  const formInfo = [
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><UserOutlined style={{ marginRight: '10px' }}/>ข้อมูลลูกค้า</Label>),
      checkOpenInfo: cusInfo,
      setCheckOpenInfo: setCusInfo,
      detail: '',
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><CarOutlined style={{ marginRight: '10px' }}/>ข้อมูลรถ</Label>),
      checkOpenInfo: carInfo,
      setCheckOpenInfo: setCarInfo,
      detail: '',
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><FileProtectOutlined style={{ marginRight: '10px' }}/>ข้อมูลบริการ</Label>),
      checkOpenInfo: serviceInfo,
      setCheckOpenInfo: setServiceInfo,
      detail: '',
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><CheckCircleOutlined style={{ marginRight: '10px' }}/>ข้อมูลสถานะ</Label>),
      checkOpenInfo: statusInfo,
      setCheckOpenInfo: setStatusInfo,
      detail: '',
      hide: true,
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><CheckCircleOutlined style={{ marginRight: '10px' }}/>รายละเอียดติดปัญหา</Label>),
      checkOpenInfo: probInfo,
      setCheckOpenInfo: setProbInfo,
      detail: (
        <>
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', padding: '10px' }}>
            <Label style={{ fontFamily: 'anakotmai-bold', color: THEME.COLORS.GRAY }}>รายละเอียด</Label>
            <Box style={{ background: THEME.COLORS.FADE_RED, width: '100%', height: '80px' }}></Box>
          </Box>
        </>
      ),
    },
  ]

  return (
    <DetailLayout
      isPreve={true}
      onClickPrevious={() => redirect(ROUTE_PATH.STATUS.LINK)}
    >
      <Row justify='end' style={{ marginRight: '10px' }}>
        <Button className='accept-btn' style={{ width: '120px' }}
          onClick={()=>redirect(ROUTE_PATH.EDIT.LINK)}
        >
          <EditOutlined/>
          แก้ไขข้อมูล
        </Button>
      </Row>
      <Label className='title-form'>รายละเอียดติดตามงาน</Label>
      <Row gutter={[8, 8]} justify='center'>
        {
          formInfo.map((item)=> {
            const { title, checkOpenInfo, setCheckOpenInfo, detail } = item
            return (
              !item.hide && (
              <Col xs={24} lg={12}>
                <Box style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.2)', margin: '10px', padding: 0 }}>
                  <Box className='detail-header-wrapper' onClick={()=> {setCheckOpenInfo(!checkOpenInfo)}}>
                    {title}
                    {
                      !checkOpenInfo ? 
                      <DownOutlined style={{ color: THEME.COLORS.RED_2, fontSize: '30px' }}/> : 
                      <UpOutlined style={{ color: THEME.COLORS.RED_2, fontSize: '30px' }}/>
                    }
                  </Box>
                  {
                    checkOpenInfo &&
                    <Box style={{ width: '100%', minHeight: '20px' }}>
                      {detail}
                    </Box>
                  }
                </Box>
              </Col>
              )
            )}
          )
        }
      </Row>
      <Label className='title-form' style={{ marginTop: '20px' }}>ชำระเงินส่วนต่าง</Label>
      <Row justify='center'>
        <Col xs={24} lg={24} style={{ margin: '5px' }}>
          <Box style={{ margin: '10px', width: '100%' }}>เลือกธนาคารที่ต้องการโอน</Box>
          <Select style={{ width: '100%' }}
            label=""
            value={selectedBank}
            onChange={(value) => {setSelectedBank(value)}}
            options={bankList}
            placeholder="กรุณาเลือกธนาคาร"
          />
        </Col>
        <Col xs={24} lg={24} style={{ margin: '5px' }}>
          <Box style={{ margin: '10px', width: '100%' }}>แนบสลิป</Box>
          <Box style={{ width: '100%', textAlign: 'center' }}>
            <Dragger {...props}>
              {console.log(fileInput)}
              {console.log(Object.keys(fileInput).length)}
              {Object.keys(fileInput).length === 0 ? 'สลิปการโอนเงิน' : fileInput?.file?.name}
            </Dragger>
          </Box>
        </Col>
      </Row>
      <Box className='accept-group-btn-wrapper'>
        <Button
          className='accept-btn'
          width='200'
          onClick={()=>{}}
        >
          ส่งข้อมูล
        </Button>
      </Box>
    </DetailLayout>
  )
}

export default Detail