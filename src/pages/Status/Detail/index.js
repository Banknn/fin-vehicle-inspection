import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Modal, Row, message, Upload, Divider, Timeline } from 'antd'
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
  QuestionCircleOutlined,
  LoginOutlined,
  FileTextOutlined,
  CopyOutlined,
  InboxOutlined,
  DeliveredProcedureOutlined,
  SafetyCertificateOutlined,
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

  const dispatch = useDispatch()
  const result = useSelector((state) => state.orderReducer)

  const [result2, setResult2] = useState({})
  const [result3, setResult3] = useState({})
  const [timeline, setTimeline] = useState({})
  const [timelineArr, setTimelineArr] = useState([])
  const [cusInfo, setCusInfo] = useState(false)
  const [carInfo, setCarInfo] = useState(false)
  const [serviceInfo, setServiceInfo] = useState(false)
  const [statusInfo, setStatusInfo] = useState(true)
  const [probInfo, setProbInfo] = useState(false)
  const [selectedBank, setSelectedBank] = useState()
  const [fileInput, setFileInput] = useState({})

  const fetchPlan = async() => {
    dispatch(loadingAction(true))
    const API = systemController()
    const res = await API.getDetailPlanByQuo(result.quo_num)
    if(isValidResponse(res)) {
      setResult2(res.result)
    }
    const res2 = await API.getDetailFollow(result.quo_num)
    if(isValidResponse(res2)) {
      setResult3(res2.result)
      if(!res2.result.timeline) {
        setTimeline([])
      }else {
        setTimeline(res2.result.timeline)
      }
    }
  }

  console.log('1', result);
  console.log('2', result2);
  console.log('3', result3);
  console.log('timelineArr', timelineArr);

  const timelineIcon = (type, title) => {
    switch(title) {
      case 'รับงานเข้าระบบ':
        return <LoginOutlined style={{ fontSize: '25px', color: type === 'none' ? '#BDBDBD' : 'red' }}/>
      case 'แจ้งเปิดพรบ':
      case 'แจ้งเปิดกรมธรรม์':
        return <FileTextOutlined style={{ fontSize: '25px', color: type === 'none' ? THEME.COLORS.GRAY4 : 'red' }}/>
      case 'ส่งสำเนาพรบ':
      case 'ส่งสำเนากรมธรรม์':
        return <CopyOutlined style={{ fontSize: '25px', color: type === 'none' ? THEME.COLORS.GRAY4 : 'red' }}/>
      case 'ส่ง EMS พัสดุ':
      case 'ส่ง EMS กรมธรรม์':
        return <InboxOutlined style={{ fontSize: '25px', color: type === 'none' ? THEME.COLORS.GRAY4 : 'red' }}/>
      case 'ส่งเลขติดตาม กรมธรรม์':
        return <DeliveredProcedureOutlined style={{ fontSize: '25px', color: type === 'none' ? THEME.COLORS.GRAY4 : 'red' }}/>
      case 'ทำรายการเสร็จสิ้น':
        return <SafetyCertificateOutlined style={{ fontSize: '25px', color: type === 'none' ? THEME.COLORS.GRAY4 : 'red' }}/>
    }
  }

  const genTimeline = () => {
    if(Object.keys(timeline).length !== 0) {
      const timelineItem = result3.timeline.map((item)=>{
        return {
          color: 'red',
          dot: timelineIcon('', item.title),
          status: item.status,
          description: item.description,
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: 'red' }}>{item.title}</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        }
      })
      setTimelineArr(timelineItem)
    }else {
      setTimelineArr([
        {
          color: THEME.COLORS.GRAY4,
          dot: timelineIcon('none', 'รับงานเข้าระบบ'),
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: THEME.COLORS.GRAY4 }}>รับงานเข้าระบบ</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        },
        {
          color: THEME.COLORS.GRAY4,
          dot: timelineIcon('none', 'แจ้งเปิดกรมธรรม์'),
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: THEME.COLORS.GRAY4 }}>แจ้งเปิดกรมธรรม์</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        },
        {
          color: THEME.COLORS.GRAY4,
          dot: timelineIcon('none', 'ส่งสำเนากรมธรรม์'),
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: THEME.COLORS.GRAY4 }}>ส่งสำเนากรมธรรม์</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        },
        {
          color: THEME.COLORS.GRAY4,
          dot: timelineIcon('none', 'ส่งเลขติดตาม กรมธรรม์'),
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: THEME.COLORS.GRAY4 }}>ส่งเลขติดตาม กรมธรรม์</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        },
        {
          color: THEME.COLORS.GRAY4,
          dot: timelineIcon('none', 'ทำรายการเสร็จสิ้น'),
          children: (
            <Box>
              <Label style={{ fontSize: '17px', color: THEME.COLORS.GRAY4 }}>ทำรายการเสร็จสิ้น</Label>
              <Divider style={{ margin: '5px' }}/>
            </Box>
          ),
        },
      ])
    }
    dispatch(loadingAction(false))
  }

  useEffect(()=>{
    genTimeline()
  },[timeline])

  useEffect(()=>{
    fetchPlan()
  },[result])

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

  const bankList = [
    {
      value: 'ธนาคารกสิกร',
      text: 'ธนาคารกสิกร 057-8-40722-7'
    },
  ]

  const cusForm = [
    {
      header: 'เลขรายการ',
      detail: result.quo_num,
    },
    {
      header: 'คำนำหน้า',
      detail: result.title,
    },
    {
      header: 'ชื่อ',
      detail: result.name.split(' ')[0],
    },
    {
      header: 'นามสกุล',
      detail: result.lastname,
    },
    {
      header: 'เบอร์โทรศัพท์',
      detail: convertStrToFormat(result.tel, 'phone_number'),
    },
    {
      header: 'ที่อยู่หน้ากรมธรรม์',
      detail: result.address,
    },
    {
      header: 'ที่อยู่จัดส่ง',
      detail: result.addressnew,
    },
  ]

  const carForm = [
    {
      header: 'ยี่ห้อรถยนต์',
      detail: result2.brandplan + ' ' + result2.seriesplan,
    },
    {
      header: 'รายละเอียดรุ่นรถ',
      detail: result2.yearplan + ' ' + result2.sub_seriesplan,
    },
    {
      header: 'เลขเครื่องยนต์',
      detail: result2.id_motor1 ? result2.id_motor1 : '-',
    },
    {
      header: 'เลขตัวถัง',
      detail: result2.id_motor2 ? result2.id_motor2 : '-',
    },
    {
      header: 'เลขทะเบียน',
      detail: result2.idcar,
    },
    {
      header: 'กล้องหน้ารถ',
      detail: true ? 'มี' : 'ไม่มี',
    },
  ]

  const serviceForm = [
    {
      header: 'ราคาภาษี',
      detail: convertStrToFormat(result2.amount_inc, 'money'),
    },
    {
      header: 'ราคาเบี้ยสุทธิ',
      detail: convertStrToFormat(result2.amount_inc, 'money'),
    },
    {
      header: 'วิธีจ่ายเงิน',
      detail: `${result.chanel_main} / เข้าฟิน`,
    },
    {
      header: 'ค่าจัดส่ง',
      detail: '0',
    },
  ]

  const formInfo = [
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><UserOutlined style={{ marginRight: '10px' }}/>ข้อมูลลูกค้า</Label>),
      checkOpenInfo: cusInfo,
      setCheckOpenInfo: setCusInfo,
      detail: (
        <React.Fragment>
        {
          cusForm.map((item)=>(
            <Box className='bill-price-detail'>
              <Box>
                <Label className='bill-price-description'>
                  {item.header}
                </Label>
              </Box>
              <Label style={{ textAlign: 'end' }}>{item.detail}</Label>
            </Box>
          ))
        }
        </React.Fragment>
      ),
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><CarOutlined style={{ marginRight: '10px' }}/>ข้อมูลรถ</Label>),
      checkOpenInfo: carInfo,
      setCheckOpenInfo: setCarInfo,
      detail: (
        <React.Fragment>
        {
          carForm.map((item)=>(
            <Box className='bill-price-detail'>
              <Box>
                <Label className='bill-price-description'>
                  {item.header}
                </Label>
              </Box>
              <Label style={{ textAlign: 'end' }}>{item.detail}</Label>
            </Box>
          ))
        }
        </React.Fragment>
      ),
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><FileProtectOutlined style={{ marginRight: '10px' }}/>ข้อมูลบริการ</Label>),
      checkOpenInfo: serviceInfo,
      setCheckOpenInfo: setServiceInfo,
      detail: (
        <React.Fragment>
        {
          serviceForm.map((item)=>(
            <Box className='bill-price-detail'>
              <Box>
                <Label className='bill-price-description'>
                  {item.header}
                </Label>
              </Box>
              <Label style={{ textAlign: 'end' }}>{item.detail}</Label>
            </Box>
          ))
        }
        </React.Fragment>
      ),
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><CheckCircleOutlined style={{ marginRight: '10px' }}/>ข้อมูลสถานะ</Label>),
      checkOpenInfo: statusInfo,
      setCheckOpenInfo: setStatusInfo,
      detail: (
        <Box style={{ padding: '20px' }}>
          <Timeline>
            {
              timelineArr.map((tl)=>(
                <Timeline.Item color={tl.color} dot={tl.dot}>
                  {tl.children}
                </Timeline.Item> 
              ))
            }
          </Timeline>
        </Box>
      ),
    },
    {
      title: (<Label style={{ fontSize: '20px', color: THEME.COLORS.RED_2, fontFamily: 'anakotmai-bold' }}><QuestionCircleOutlined style={{ marginRight: '10px' }}/>รายละเอียดติดปัญหา</Label>),
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
      hide: true,
    },
  ]

  const handleSubmit = () => {
    if(!selectedBank) {
      Modal.error({ title: 'กรุณาเลือกธนาคารที่ต้องการโอน' })
      return
    }
    if(Object.keys(fileInput).length === 0) {
      Modal.error({ title: 'กรุณาแนบสลิปโอนเงิน' })
      return
    }
    Modal.success({ title: 'ส่งข้อมูลสำเร็จ' })
  }

  return (
    <>
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
      </DetailLayout>
      {
        true &&
        <DetailLayout>
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
                  {Object.keys(fileInput).length === 0 ? 'สลิปการโอนเงิน' : fileInput?.file?.name}
                </Dragger>
              </Box>
            </Col>
          </Row>
          <Box className='accept-group-btn-wrapper'>
            <Button
              className='accept-btn'
              width='200'
              onClick={()=>{handleSubmit()}}
            >
              ส่งข้อมูล
            </Button>
          </Box>
        </DetailLayout>
      }
    </>
  )
}

export default Detail