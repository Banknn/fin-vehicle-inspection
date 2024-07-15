import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Col, Radio, Row, TimePicker, message, Modal, Divider, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { customerAction, loadingAction } from '../../actions'
import {
	Box,
	Button,
	Input,
	Label,
	Select,
	InputNumber,
	DatePickerWithLabel,
	Icons,
	Span,
	Table,
  Image,
  UploadFiles
} from '../../components'
import {
	convertStrToFormat,
	isValidResponse,
	LIST,
	redirect,
	ROUTE_PATH,
	numberWithCommas,
	// carTaxCalate,
	convertCC,
	vehicleInspectionCal,
	checkCustomer,
	calInstallmentSpecial,
	removeChar,
} from '../../helpers'
import { DetailLayout } from '../Layout'
import {
	paymentController,
	receiptController,
	systemController,
} from '../../apiServices'
import _ from 'lodash'
import { IMAGES, THEME } from '../../themes'

const { Dragger } = Upload

const TaxBill = () => {

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

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tax, setTax] = useState()
  const [paymentMethod, setPaymentMethod] = useState()
  const [fieldError, setFieldError] = useState({})
  const [selectedBank, setSelectedBank] = useState('ธนาคารกสิกร')
  const [paymentPage, setPaymentPage] = useState(false)
  const [fileInput, setFileInput] = useState({})

  const bankList = [
    {
      value: 'ธนาคารกสิกร',
      text: 'ธนาคารกสิกร 057-8-40722-7'
    },
  ]

  const validateInput = (type) => {

    if(type === 'final') {
      let errors = {}
      let validInput = true
      if(Object.keys(fileInput)?.length === 0) {
        validInput = false
        errors['slipImg'] = 'กรุณาแนบสลิปโอนเงิน'
      }
      setFieldError({ errors })
      return validInput
    }

    let errors = {}
    let validInput = true
    if(!tax || tax.startsWith('0') || isNaN(tax)) {
      validInput = false
      Modal.error({ title: 'กรุณากรอกค่าภาษี' })
      return validInput
    }
    if(!paymentMethod) {
      validInput = false
      Modal.error({ title: 'กรุณาเลือกช่องทางชำระเงิน' })
      return validInput
    }
    setFieldError({ errors })
		return validInput
  }

  const handleSubmit = () => {
    if(validateInput('')) {
      setPaymentPage(true)
    }else {
      if(tax && !isNaN(tax) && paymentMethod) {
        Modal.error({ title: 'กรุณาแนบไฟล์ให้ครบ' })
      }
    }
  }

  const finalSubmit = () => {
    if(validateInput('final')) {
      Modal.success({ title: 'ทำรายการสำเร็จ' })
    }else {
      Modal.error({ title: 'กรุณาแนบสลิปโอนเงิน' })
    }
  }

  const paymentForm = [
    {
      header: 'ค่าภาษี',
      detail: convertStrToFormat(tax, 'money') || 0,
    },
    {
      header: 'ค่าบริการ',
      detail: '200',
    },
    {
      header: 'ผลตอบแทน',
      detail: '100',
    },
    {
      header: 'หักภาษี ณ ที่จ่าย 5%',
      detail: '95',
    },
    {
      header: 'ค่าจัดส่ง',
      detail: '0',
    },
    {
      header: 'ผลตอบแทนทั้งหมด',
      detail: '95',
    },
    {
      header: 'จำนวนเงินที่ต้องจ่าย',
      detail: convertStrToFormat(parseFloat(tax) + 200 , 'money') || 0,
    },
  ]

  const form = [
    {
      section: {
        title: 'ข้อมูลลูกค้า',
        detail: (
          <React.Fragment>
            <Box className='bill-price-detail'>
              <Box>
                <Label className='bill-price-description'>
                  เลขที่ใบเสนอราคา
                </Label>
              </Box>
              FQ2407-11111
            </Box>
            <Box className='bill-price-detail'>
              <Box>
                <Label className='bill-price-description'>
                  ชื่อ-นามสกุล
                </Label>
              </Box>
              ทดสอบ ทดสอบ
            </Box>
          </React.Fragment>
        ),
      },
    },
    {
      section: {
        title: 'ข้อมูลรถ',
        detail: (
          <React.Fragment>
            <Row justify='center'>
              <Col xs={24} lg={11} style={{ background: THEME.COLORS.FADE_RED, margin: '0 10px 0 10px', height: '100px' }}></Col>
              <Col xs={24} lg={11} style={{ background: THEME.COLORS.FADE_RED, margin: '0 10px 0 10px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box className='bill-price-detail'>
                  <Box>
                    <Label className='bill-price-description'>
                      ค่าภาษี
                    </Label>
                  </Box>
                  <Input
                    onChange={(e)=>{
                      setTax(e.target.value)
                      setPaymentPage(false)
                      setFileInput({})
                    }}
                    value={tax}
                    placeholder='กรอกค่าภาษี'
                    style={{ background: THEME.COLORS.FADE_RED, border: '1px solid black' }}
                  />
                </Box>
                <Box className='bill-price-detail'>
                  <Box>
                    <Label className='bill-price-description'>
                      ค่าบริการ
                    </Label>
                  </Box>
                  200 บาท
                </Box>
              </Col>
            </Row>
            <Box className='accept-group-btn-wrapper'>
              <Button
                className='accept-btn'
                width='140'
                onClick={()=>{setIsModalVisible(true)}}
              >
                เช็คค่าภาษี
              </Button>
            </Box>
            <Modal
              title="เช็คค่าภาษี"
              visible={isModalVisible}
              onCancel={()=>{setIsModalVisible(false)}}
              okButtonProps={{ style: { display: 'none' } }}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <Row justify='center'>
                <Button style={{ width: '180px', height: '80px', margin: '0 10px 0 10px', border: 'none', borderRadius: '5px', background: THEME.COLORS.RED_2, color: THEME.COLORS.WHITE, fontFamily: 'anakotmai-bold', fontSize: '18px' }}
                  onClick={()=>{window.open('https://eservice.dlt.go.th/esvapp/esv/ebk/esv02q002/')}}
                >
                  กรมขนส่ง
                </Button>
                <Button style={{ width: '180px', height: '80px', margin: '0 10px 0 10px', border: 'none', borderRadius: '5px', background: THEME.COLORS.RED_2, color: THEME.COLORS.WHITE, fontFamily: 'anakotmai-bold', fontSize: '18px' }}
                  onClick={()=>{message.info('Not available now')}}
                >
                  เจ้าหน้าที่ฟิน
                </Button>
              </Row>
            </Modal>
          </React.Fragment>
        )
      },
    },
    {
      section: {
        title: 'เลือกช่องทางชำระเงิน',
        detail: (
          <React.Fragment>
            <Select 
              options={[
                {
                  text: 'จ่ายเต็ม (โอนเงิน/QRCode)',
                  value: 'จ่ายเต็ม (โอนเงิน/QRCode)',
                }
              ]}
              placeholder='กรุณาเลือกช่องทางชำระเงิน'
              style={{ width: '250px' }}
              onChange={(e)=>{
                setPaymentMethod(e)
                setPaymentPage(false)
                setFileInput({ ...fileInput, slipImg: {} })
              }}
              value={paymentMethod}
            />
          </React.Fragment>
        )
      },
    },
    {
      section: {
        title: 'สรุปรายการชำระเงิน',
        detail: (
          <React.Fragment>
            {
              paymentForm.map((item, i)=>(
                <>
                  {
                    item.header === 'จำนวนเงินที่ต้องจ่าย' && 
                    <Divider style={{ margin: '5px' }}/>
                  }
                  <Box className='bill-price-detail' key={i}>
                    <Box>
                      <Label className='bill-price-description' style={{ color: item.header === 'จำนวนเงินที่ต้องจ่าย' ? THEME.COLORS.RED_2 : '' }}>
                        {item.header}
                      </Label>
                    </Box>
                    {item.detail} บาท
                  </Box>
                </>
              ))
            }
          </React.Fragment>
        )
      },
    },
  ]

  return (
    <>
      <DetailLayout 
        isPreve={true} 
        onClickPrevious={()=> redirect(ROUTE_PATH.TAXRENEW.LINK)}
        label='สรุปข้อมูล' 
      >
        {form.map((e, i) => {
          const { section } = e
          return (
            <React.Fragment key={i}>
              {!section.hide && (
                <Box>
                  <Label className='title-second-form'>{section.title}</Label>
                  {section.detail}
                </Box>
              )}
            </React.Fragment>
          )
        })}
        <Box className='accept-group-btn-wrapper'>
          <Button
            className='accept-btn'
            width='140'
            onClick={()=>{handleSubmit()}}
            disabled={paymentPage}
          >
            ทำรายการต่อ
          </Button>
        </Box>
      </DetailLayout>
      {
        paymentPage &&
        <DetailLayout label='ชำระเงิน (โอนเงิน/QRCode)'>
          <Row justify='center'>
            <Col xs={24} lg={24} style={{ margin: '5px' }}>
              <Box className='bill-price-detail'>
                <Box>
                  <Label className='bill-price-description'>
                    เลขที่ใบเสนอราคา
                  </Label>
                </Box>
                FQ2407-11111
              </Box>
              <Box className='bill-price-detail'>
                <Box>
                  <Label className='bill-price-description'>
                    เลขทะเบียน
                  </Label>
                </Box>
                กก 1234 กรุงเทพมหานคร
              </Box>
              <Box className='bill-price-detail'>
                <Box>
                  <Label className='bill-price-description'>
                    ค่าภาษี
                  </Label>
                </Box>
                {convertStrToFormat(tax, 'money')} บาท
              </Box>
              <Box className='bill-price-detail'>
                <Box>
                  <Label className='bill-price-description'>
                    ค่าบริการ
                  </Label>
                </Box>
                200 บาท
              </Box>
              <Box className='bill-price-detail'>
                <Box>
                  <Label className='bill-price-description' style={{ color: THEME.COLORS.RED_2 }}>
                    จำนวนเงินที่ต้องจ่าย
                  </Label>
                </Box>
                {convertStrToFormat(parseFloat(tax) + 200, 'money')} บาท
              </Box>
            </Col>
            <Divider style={{ margin: '1px' }}/>
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
              onClick={()=>{finalSubmit()}}
            >
              ยืนยันการทำรายการ
            </Button>
          </Box>
        </DetailLayout>
      }
    </>
  )
}

export default TaxBill