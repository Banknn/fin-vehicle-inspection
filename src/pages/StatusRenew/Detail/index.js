import React, { useState } from "react";
import { DetailLayout } from "../../Layout";
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
import { EyeOutlined } from '@ant-design/icons'
import { THEME } from "../../../themes";
import { Modal, Col, Row, Input as InputAntd } from "antd";

const { TextArea } = InputAntd

const Detail = () => {

  const [remark, setRemark] = useState()

  const seeInfo = (type) => {
    switch(type) {
      case 'book':
        Modal.info({ title: 'สำเนาสมุดรถ' })
        break
      case 'prb':
        Modal.info({ title: 'สำเนาพรบ' })
        break
      case 'inspection':
        Modal.info({ title: 'ใบตรวจสภาพรถ' })
        break
      default:
        break
    }
  }

  const paymentForm = [
    {
      header: 'เลขรายการ',
      detail: 'FQ2407-11111',
    },
    {
      header: 'วันที่แจ้งงาน',
      detail: '16/7/2567',
    },
    {
      header: 'ชื่อ-นามสกุล',
      detail: 'ทดสอบ-ทดสอบ',
    },
    {
      header: 'รหัสนายหน้า',
      detail: 'FINTEST-01',
    },
    {
      header: 'ทะเบียนรถ',
      detail: 'กก 1234',
    },
    {
      header: 'จังหวัดทะเบียนรถ',
      detail: 'กรุงเทพมหานคร',
    },
    {
      header: 'เบอร์ติดต่อ',
      detail: '000-000-0000',
    },
  ]

  const taxForm = [
    {
      header: 'ราคาภาษี',
      detail: '1,200 บาท',
    },
    {
      header: 'ค่าบริการ',
      detail: '200 บาท',
    },
    {
      header: 'สำเนาสมุดรถ',
      detail: (
        <Button width={150} 
          style={{ 
            border: `1px solid ${THEME.COLORS.GREEN}`, 
            borderRadius: '5px', 
            color: THEME.COLORS.GREEN, 
            background: 'none' 
          }}
          onClick={()=>{seeInfo('book')}}
        >
          <EyeOutlined style={{ margin: '0 5px 0 0' }}/>
          ดูสำเนาสมุดรถ
        </Button>
      )
    },
    {
      header: 'สำเนาพรบ',
      detail: (
        <Button width={150} 
          style={{ 
            border: `1px solid ${THEME.COLORS.GREEN}`, 
            borderRadius: '5px', 
            color: THEME.COLORS.GREEN, 
            background: 'none' 
          }}
          onClick={()=>{seeInfo('prb')}}
        >
          <EyeOutlined style={{ margin: '0 5px 0 0' }}/>
          ดูสำเนาพรบ
        </Button>
      )
    },
    {
      header: 'ใบตรวจสภาพรถ',
      detail: (
        <Button width={150} 
          style={{ 
            border: `1px solid ${THEME.COLORS.GREEN}`, 
            borderRadius: '5px', 
            color: THEME.COLORS.GREEN, 
            background: 'none' 
          }}
          onClick={()=>{seeInfo('inspection')}}
        >
          <EyeOutlined style={{ margin: '0 5px 0 0' }}/>
          ดูใบตรวจสภาพรถ
        </Button>
      )
    },
  ]

  return (
    <>
			<Container className='report-container'>
        <Box>
          <DetailLayout>
    				<Label className='title-form'>งานต่อภาษี</Label>
            <Label className='title-second-form'>ข้อมูลลูกค้า</Label>
            <Row>
            {
              paymentForm.map((item, i)=>(
                <Col xs={24} lg={12}>
                  <Box className='bill-price-detail' key={i}>
                    <Box>
                      <Label className='bill-price-description'>
                        {item.header}
                      </Label>
                    </Box>
                    {item.detail}
                  </Box>
                </Col>
              ))
            }
            </Row>
            <Label className='title-second-form'>ข้อมูลภาษี</Label>
            <Row>
            {
              taxForm.map((item, i)=>(
                <Col xs={24} lg={12}>
                  <Box className='bill-price-detail' key={i}>
                    <Box>
                      <Label className='bill-price-description'>
                        {item.header}
                      </Label>
                    </Box>
                    {item.detail}
                  </Box>
                </Col>
              ))
            }
            </Row>
            <Label className='title-second-form'>Remark</Label>
            <Row justify='center'>
              <Col xs={24} lg={12} style={{ margin: '0px' }}>
                <Box>
                  <Select
                    value={remark}
                    onChange={(e)=>{setRemark(e)}}
                    options={[
                      {
                        text: 'ข้อมูลไม่ถูกต้อง',
                        value: 'ข้อมูลไม่ถูกต้อง',
                      },
                      {
                        text: 'ไม่สามารถต่อภาษีได้',
                        value: 'ไม่สามารถต่อภาษีได้',
                      },
                    ]}
                  />
                </Box>
              </Col>
              <Col xs={24} lg={11} style={{ margin: '0 0 0 10px' }}>
                <Box>
                  <Row justify='space-between' style={{ marginTop: '6px' }}>
                    <Button 
                      style={{ 
                        width: '47%',
                        height: '30px',
                        border: 'none', 
                        background: THEME.COLORS.RED_2,
                        fontFamily: 'anakotmai-bold',
                        color: THEME.COLORS.WHITE,
                        margin: '0 5px 0 5px',
                      }}
                    >
                      แจ้งติดปัญหา
                    </Button>
                    <Button 
                      style={{ 
                        width: '47%',
                        height: '30px',
                        border: 'none', 
                        background: THEME.COLORS.RED_2,
                        fontFamily: 'anakotmai-bold',
                        color: THEME.COLORS.WHITE,
                        margin: '0 5px 0 5px',
                      }}
                    >
                      ยืนยันรับงาน
                    </Button>
                  </Row>
                </Box>
              </Col>
            </Row>
          </DetailLayout>
        </Box>
      </Container>
    </>
  )
}

export default Detail