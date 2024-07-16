import React, { useState } from "react";
import { Col, message, Row } from "antd";
import { DetailLayout } from "../Layout";
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
import { THEME } from "../../themes";

const StatusRenew = () => {

  const [workStatus, setWorkStatus] = useState()
  const [pdfOver, setPdfOver] = useState(false)
  const [excelOver, setExcelOver] = useState(false)

  const workStatusList = [
    {
      text: 'ทั้งหมด',
      value: 'ทั้งหมด',
    },
    {
      text: 'กำลังดำเนินการ',
      value: 'กำลังดำเนินการ',
    },
    {
      text: 'ติดปัญหา',
      value: 'ติดปัญหา',
    },
    {
      text: 'ยกเลิก',
      value: 'ยกเลิก',
    },
    {
      text: 'เรียบร้อย',
      value: 'เรียบร้อย',
    },
    {
      text: 'รอนำส่ง',
      value: 'รอนำส่ง',
    },
  ]

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
			width: 150,
		},
    {
			title: 'เลขรายการ',
			dataIndex: 'quonum',
			key: 'quonum',
			align: 'center',
			width: 150,
		},
    {
			title: 'ชื่อ-นามสกุล',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: 150,
		},
    {
			title: 'ทะเบียนรถ',
			dataIndex: 'idcar',
			key: 'idcar',
			align: 'center',
			width: 150,
		},
    {
			title: 'เบอร์โทรศัพท์',
			dataIndex: 'tel',
			key: 'tel',
			align: 'center',
			width: 150,
		},
    {
			title: 'ราคาภาษี',
			dataIndex: 'taxprice',
			key: 'taxprice',
			align: 'center',
			width: 150,
		},
    {
			title: 'ค่าบริการ',
			dataIndex: 'service',
			key: 'service',
			align: 'center',
			width: 150,
		},
    {
			title: 'ยอดรวม',
			dataIndex: 'total',
			key: 'total',
			align: 'center',
			width: 150,
		},
    {
			title: 'วันที่',
			dataIndex: 'date',
			key: 'date',
			align: 'center',
			width: 150,
		},
    {
			title: 'ไฟล์',
			dataIndex: 'file',
			key: 'file',
			align: 'center',
			width: 150,
		},
  ]

  const handleExport = (type) => {
    switch(type) {
      case 'pdf':
        message.error('pdf')
        break
      case 'excel':
        message.error('excel')
        break
      default:
        break
    }
  }

  return (
    <>
			<Container className='report-container'>
				<Label className='title-form'>สถานะงานต่อภาษี</Label>
        <Box className='report-wrapper'>
          <Row>
            <Box className='filter-input' width='200'>
              <Label>สถานะงาน</Label>
              <Select
                name='type'
                placeholder='เลือกสถานะงาน'
                options={workStatusList}
                onChange={(e) => {setWorkStatus(e)}}
                value={workStatus}
              />
            </Box>
            <Box className='filter-input' width='200' style={{ marginTop: '1px' }}>
              <Label>Export</Label>
              <Row style={{ marginTop: '5px' }}>
                {
                  workStatus === 'รอนำส่ง' &&
                  <Col onMouseOver={()=>{setPdfOver(true)}} onMouseOut={()=>{setPdfOver(false)}}>
                    <Button 
                      style={{ 
                        width: '100px',
                        height: '30px',
                        border: 'none', 
                        background: pdfOver ? THEME.COLORS.RED_2 : THEME.COLORS.FADE_RED,
                        fontFamily: 'anakotmai-bold',
                        color: pdfOver ? THEME.COLORS.WHITE : THEME.COLORS.GRAY
                      }}
                      onClick={()=>{handleExport('pdf')}}
                    >
                      PDF
                    </Button>
                  </Col>
                }
                <Col onMouseOver={()=>{setExcelOver(true)}} onMouseOut={()=>{setExcelOver(false)}}>
                  <Button 
                    style={{ 
                      width: '100px',
                      height: '30px',
                      border: 'none', 
                      background: excelOver ? THEME.COLORS.RED_2 : THEME.COLORS.FADE_RED,
                      fontFamily: 'anakotmai-bold',
                      color: excelOver ? THEME.COLORS.WHITE : THEME.COLORS.GRAY
                    }}
                    onClick={()=>{handleExport('excel')}}
                  >
                    Excel
                  </Button>
                </Col>
              </Row>
            </Box>
          </Row>
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
      </Container>
    </>
  )
}

export default StatusRenew