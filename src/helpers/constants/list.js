import React from 'react'
import moment from 'moment'
import {
	HomeOutlined,
	WalletOutlined,
} from '@ant-design/icons'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { FcAutomotive } from 'react-icons/fc'
import {
	addressController,
	carController,
	companyController,
	defaultController,
	userController,
	systemController,
	productController,
	colorController,
} from '../../apiServices'
import {
	// installmentPrice,
	isValidResponse,
	numberWithCommas,
	redirect,
	checkCustomer,
} from '../functions'
import { ROUTE_PATH } from './routes'

export const LIST = {
	BANKS: async () => {
		const API = defaultController()
		const res = await API.getBank()
		if (isValidResponse(res)) {
			const banks = res.result
			const banksOption = banks.map((e, i) => {
				return {
					key: i,
					value: e.bankname,
					text: `${e.bank_no} ${e.bankname}`,
				}
			})
			return banksOption
		}
	},
	GENDER: [
		{ key: '1', value: 'M', text: 'ชาย' },
		{ key: '2', value: 'F', text: 'หญิง' },
	],
	DAY: [
		{ key: '1', value: '01', text: '1' },
		{ key: '2', value: '02', text: '2' },
		{ key: '3', value: '03', text: '3' },
		{ key: '4', value: '04', text: '4' },
		{ key: '5', value: '05', text: '5' },
		{ key: '6', value: '06', text: '6' },
		{ key: '7', value: '07', text: '7' },
		{ key: '8', value: '08', text: '8' },
		{ key: '9', value: '09', text: '9' },
		{ key: '10', value: '10', text: '10' },
		{ key: '11', value: '11', text: '11' },
		{ key: '12', value: '12', text: '12' },
		{ key: '13', value: '13', text: '13' },
		{ key: '14', value: '14', text: '14' },
		{ key: '15', value: '15', text: '15' },
		{ key: '16', value: '16', text: '16' },
		{ key: '17', value: '17', text: '17' },
		{ key: '18', value: '18', text: '18' },
		{ key: '19', value: '19', text: '19' },
		{ key: '20', value: '20', text: '20' },
		{ key: '21', value: '21', text: '21' },
		{ key: '22', value: '22', text: '22' },
		{ key: '23', value: '23', text: '23' },
		{ key: '24', value: '24', text: '24' },
		{ key: '25', value: '25', text: '25' },
		{ key: '26', value: '26', text: '26' },
		{ key: '27', value: '27', text: '27' },
		{ key: '28', value: '28', text: '28' },
		{ key: '29', value: '29', text: '29' },
		{ key: '30', value: '30', text: '30' },
		{ key: '31', value: '31', text: '31' },
	],
	MONTH: [
		{ key: '1', value: '01', text: 'มกราคม' },
		{ key: '2', value: '02', text: 'กุมภาพันธ์' },
		{ key: '3', value: '03', text: 'มีนาคม' },
		{ key: '4', value: '04', text: 'เมษายน' },
		{ key: '5', value: '05', text: 'พฤษภาคม' },
		{ key: '6', value: '06', text: 'มิถุนายน' },
		{ key: '7', value: '07', text: 'กรกฎาคม' },
		{ key: '8', value: '08', text: 'สิงหาคม' },
		{ key: '9', value: '09', text: 'กันยายน' },
		{ key: '10', value: '10', text: 'ตุลาคม' },
		{ key: '11', value: '11', text: 'พฤศจิกายน' },
		{ key: '12', value: '12', text: 'ธันวาคม' },
	],
	YEAR: () => {
		const currYear = moment().format('YYYY')
		const arr = []
		for (let i = 1; i <= 1e2; i++) {
			const year = Number(currYear) + 1 - i
			const yearStr = `${year} / ${year + 543}`
			arr.push({ key: i, value: year, text: yearStr })
		}
		return arr
	},
	MENU: (hidden, isAdmin, role, status, cuscode) => {
		// key 60
		let menuList = [
			{
				key: 1,
				text: (
					<>
						<HomeOutlined /> หน้าแรก
					</>
				),
				onClick: () => redirect(ROUTE_PATH.HOMEPAGE.LINK),
			},
			{
				key: 2,
				text: (
					<>
						<FcAutomotive /> เช็คเบี้ยออโต้
					</>
				),
				onClick: () => redirect(`${ROUTE_PATH.VEHICLE_SELECTION.LINK}`),
				hidden: isAdmin === 1 && [3, 5].includes(role),
			},
			// { key: 3, text: 'เช็คเบี้ยโอนโค้ด' },
			// {
			// 	key: 4,
			// 	text: (
			// 		<>
			// 			<CalculatorOutlined /> คำนวณภาษีรถ
			// 		</>
			// 	),
			// },
			{
				key: 5,
				text: (
					<>
						<HiOutlineDocumentReport /> ประวัติการพิมพ์กรมธรรม์
					</>
				),
				onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/insurance-history`),
				hidden: isAdmin === 1 && [3, 5].includes(role),
			},
			{
				key: 6,
				text: (
					<>
						<FaFileInvoiceDollar /> ใบแจ้งหนี้ / ใบวางบิล
					</>
				),
				onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/invoice`),
				disabled: hidden === '1' || status === 'notview',
				hidden:
					hidden === '1' ||
					status === 'notview' ||
					(isAdmin === 1 && [3, 5].includes(role)),
			},
			{
				key: 7,
				text: (
					<>
						<WalletOutlined /> เติมเครดิต
					</>
				),
				onClick: () => redirect(`${ROUTE_PATH.DEBIT.LINK}/plusmoney`),
				disabled: hidden !== '1' || status === 'notview' || role === 4,
				hidden: hidden !== '1' || status === 'notview' || role === 4,
			},
			{
				key: 43,
				text: (
					<>
						<WalletOutlined /> แนบสลิปรายการบิล
					</>
				),
				onClick: () => redirect(`${ROUTE_PATH.UPLOADSLIPBILL.LINK}`),
				disabled: role !== 4,
				hidden: role !== 4,
			},
			// {
			// 	key: 52,
			// 	text: (
			// 		<>
			// 			<FundViewOutlined /> ติดตามค่างวด
			// 		</>
			// 	),
			// 	onClick: () =>
			// 		redirect(`${ROUTE_PATH.REPORT.LINK}/follow-install-insure`),
			// 	disabled: status === 'notview',
			// 	hidden:
			// 		status === 'notview' || (isAdmin === 1 && [3, 5].includes(role)),
			// },
			// {
			// 	key: 37,
			// 	text: (
			// 		<>
			// 			<TrophyOutlined /> ตารางค่าคอมมิชชั่น
			// 		</>
			// 	),
			// 	onClick: () => redirect(`${ROUTE_PATH.COMMISSION_TABLE.LINK}`),
			// 	disabled: status === 'notview' ? true : false,
			// 	hidden: status === 'notview' ? true : false,
			// },
			{
				key: 8,
				text: (
					<>
						<HiOutlineDocumentReport /> รายงาน
					</>
				),
				submenu: [
					{
						key: 47,
						text: 'เช็คเบี้ยคุ้มภัยลูกค้าเก่า',
						onClick: () =>
							redirect(`${ROUTE_PATH.REPORT.LINK}/insure-kumpai-renew`),
						disabled: isAdmin === 1 && role === 5,
					},
					{
						key: 45,
						text: 'รายงานเปิดบิล',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/history-bill`),
						disabled:
							!checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 54,
						text: 'รายงานยกเลิกบิล',
						onClick: () =>
							redirect(`${ROUTE_PATH.REPORT.LINK}/cancel-history-bill`),
						disabled:
							!checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 46,
						text: 'รายงานประจำวัน',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sale-shop`),
						disabled:
							!checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 9,
						text: 'รายงานประจำวัน',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sales`),
						disabled:
							status === 'notview' ||
							checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 53,
						text: 'รายงานประจำวัน',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sales-admin`),
						disabled: status !== 'notview' || checkCustomer(cuscode),
					},
					{
						key: 36,
						text: 'รายงานประจำปี',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sales_year`),
						disabled:
							status === 'notview' ||
							checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 10,
						text: 'รายงานยกเลิกกรมธรรม์',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/cancel`),
						disabled: isAdmin === 1 && [3, 5].includes(role),
					},
					{
						key: 32,
						text: 'ยอดขายลูกทีม',
						onClick: () =>
							redirect(`${ROUTE_PATH.REPORT.LINK}/downline-salereport`),
						disabled:
							status === 'notview' ||
							checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 59,
						text: 'รายงานใบกำกับรายวัน',
						onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/tax-daily`),
						disabled:
							status === 'notview' ||
							!checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					{
						key: 52,
						text: 'รายงานค่าคอมช๊อปตรอ.',
						onClick: () =>
							redirect(`${ROUTE_PATH.REPORT.LINK}/com-incentive-shoptro`),
						disabled:
							status === 'notview' ||
							!checkCustomer(cuscode) ||
							(isAdmin === 1 && [3, 5].includes(role)),
					},
					// { key: 9, text: 'รายงานค่าคอม' },
					// { key: 10, text: 'รายงานต่ออายุ' },
					// { key: 11, text: 'รายงานออกกรมแยก บ.กลาง' },
					// { key: 12, text: 'รายงานออกกรมแยก ประกัน' },
					// { key: 13, text: 'รายงานแจ้งเบิกกระดาษ' },
					// { key: 15, text: 'รายงานกรม error' },
					// { key: 16, text: 'รายงานวงเงินเครดิต' },
				],
			},
			// {
			// 	key: 17,
			// 	text: 'ตารางค่าคอมมิชชั่น',
			// 	onClick: () => redirect(`${ROUTE_PATH.COMMISSION_TABLE.LINK}`),
			// },
			// { key: 17, text: 'ติดตามสถานะงาน' },
			// { key: 18, text: 'สถานะการผ่อน' },
			// { key: 19, text: 'เติมเงิน / ชำระยอด QR' },
			// { key: 20, text: 'ฐานข้อมูลลูกค้า' },
		]
		if (isAdmin === 1 && ![3, 5].includes(role)) {
			menuList.push(
				{
					key: 18,
					text: 'รายงานแอดมิน',
					submenu: [
						{
							key: 19,
							text: 'รายการทั้งหมด',
							onClick: () => redirect(`${ROUTE_PATH.ALL_INSURANCE_ADMIN.LINK}`),
						},
						{
							key: 20,
							text: 'ยอดขายกรมธรรม์',
							onClick: () =>
								redirect(`${ROUTE_PATH.SYSTEM_PAY_INSURANCE.LINK}`),
						},
						{
							key: 21,
							text: 'ใบแจ้งหนี้',
							onClick: () => redirect(`${ROUTE_PATH.INVOICE_ADMIN.LINK}`),
						},
						{
							key: 42,
							text: 'ใบแจ้งหนี้สำหรับผ่อน',
							onClick: () => redirect(`${ROUTE_PATH.PAY_INSTALLMENT.LINK}`),
						},
						{
							key: 22,
							text: 'ออกกรมธรรม์',
							onClick: () => redirect(`${ROUTE_PATH.INSURANCE_QUANTITY.LINK}`),
						},
						{
							key: 23,
							text: 'ยกเลิกกรมธรรม์',
							onClick: () =>
								redirect(`${ROUTE_PATH.CANCEL_INSURANCE_ADMIN.LINK}`),
						},
						{
							key: 33,
							text: 'Non-Active',
							onClick: () => redirect(`${ROUTE_PATH.NON_ACTIVE_ADMIN.LINK}`),
						},
						{
							key: 58,
							text: 'ยอดขายทีม',
							onClick: () => redirect(`${ROUTE_PATH.DOWNLINE_SALE.LINK}`),
						},
					],
				},
				{
					key: 40,
					text: 'แอดมิน',
					submenu: [
						{
							key: 50,
							text: 'บริษัทประกันขึ้นระบบ',
							onClick: () => redirect(`${ROUTE_PATH.COMPANYONVIF_ADMIN.LINK}`),
						},
						{
							key: 34,
							text: 'ล็อก User',
							onClick: () => redirect(`${ROUTE_PATH.LOCKUSER_ADMIN.LINK}`),
						},
						{
							key: 49,
							text: 'ค้นหากรมธรรม์เดิม',
							onClick: () =>
								redirect(`${ROUTE_PATH.INSURANCE_OIDS_ADMIN.LINK}`),
						},
						{
							key: 51,
							text: 'ตรวจสอบ Log Api',
							onClick: () => redirect(`${ROUTE_PATH.CHECK_LOG_API.LINK}`),
						},
						{
							key: 35,
							text: 'เพิ่มผู้ใช้งานแอดมิน',
							onClick: () => redirect(`${ROUTE_PATH.CREATE_USER_ADMIN.LINK}`),
						},
						{
							key: 38,
							text: 'เปิดสิทธ์ระบบ ตรอ.',
							onClick: () =>
								redirect(`${ROUTE_PATH.CREATE_USER_BY_CUSCODE.LINK}`),
						},
						{
							key: 39,
							text: 'genQrcode',
							onClick: () => redirect(`${ROUTE_PATH.GEN_QRCODE_ADMIN.LINK}`),
						},
						// {
						// 	key: 39,
						// 	text: 'Import User',
						// 	onClick: () => redirect(`${ROUTE_PATH.CREATE_USER.LINK}`),
						// },
					],
				},
				{
					key: 24,
					text: 'รายงานบัญชี',
					submenu: [
						{
							key: 25,
							text: 'รายงานการรับชำระ',
							onClick: () =>
								redirect(`${ROUTE_PATH.PAYMENT_ACCOUNTREPORT.LINK}`),
						},
						{
							key: 26,
							text: 'รายงานสรุปยอดค้างชำระ',
							onClick: () => redirect(`${ROUTE_PATH.OUTSTANDING_BALANCE.LINK}`),
						},
						{
							key: 27,
							text: 'รายงานลูกหนี้รายตัว',
							onClick: () => redirect(`${ROUTE_PATH.RECEIVABLES.LINK}`),
						},
						{
							key: 28,
							text: 'รายงานรอบวางบิล',
							onClick: () => redirect(`${ROUTE_PATH.BILLING.LINK}`),
						},
						{
							key: 29,
							text: 'Aging',
							onClick: () => redirect(`${ROUTE_PATH.AGING.LINK}`),
						},
						{
							key: 41,
							text: 'รายงานการเติมเงิน',
							onClick: () => redirect(`${ROUTE_PATH.REPORTDEBIT.LINK}`),
						},
						{
							key: 57,
							text: 'รายงานชำระล่าช้า',
							onClick: () => redirect(`${ROUTE_PATH.OVERDUE.LINK}`),
						},
						{
							key: 30,
							text: 'รายการยอดขาย',
							onClick: () => redirect(`${ROUTE_PATH.SELLLIST.LINK}`),
						},
						{
							key: 31,
							text: 'รายการยกเลิกกรมธรรม์',
							onClick: () => redirect(`${ROUTE_PATH.REPORTCANCEL.LINK}`),
						},
            {
							key: 60,
							text: 'รายการ Log Error',
							onClick: () => redirect(`${ROUTE_PATH.REPORTLOGERROR.LINK}`),
						},
					],
				},
				{
					key: 48,
					text: 'รายงานบัญชี (ช๊อป ตรอ)',
					submenu: [
						{
							key: 46,
							text: 'รายงานประจำวัน (ช็อปตรอ)',
							onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sale-account`),
						},
						{
							key: 55,
							text: 'รายงานยกเลิกบิล',
							onClick: () =>
								redirect(`${ROUTE_PATH.REPORT.LINK}/cancel-bill-account`),
						},
						{
							key: 44,
							text: 'ตรวจสอบแนบสลิปบิล',
							onClick: () => redirect(`${ROUTE_PATH.REPORTCHECKSLIPBILL.LINK}`),
						},
					],
				}
			)
		} else if (isAdmin === 1 && role === 3) {
			menuList.push(
				{
					key: 18,
					text: 'แอดมิน',
					submenu: [
						{
							key: 20,
							text: 'ใบแจ้งหนี้',
							onClick: () => redirect(`${ROUTE_PATH.INVOICE_ADMIN.LINK}`),
						},
						{
							key: 42,
							text: 'ใบแจ้งหนี้สำหรับผ่อน',
							onClick: () => redirect(`${ROUTE_PATH.PAY_INSTALLMENT.LINK}`),
						},
						{
							key: 33,
							text: 'ล็อก User',
							onClick: () => redirect(`${ROUTE_PATH.LOCKUSER_ADMIN.LINK}`),
						},
						{
							key: 49,
							text: 'ค้นหากรมธรรม์เดิม',
							onClick: () =>
								redirect(`${ROUTE_PATH.INSURANCE_OIDS_ADMIN.LINK}`),
						},
					],
				},
				{
					key: 24,
					text: 'รายงานบัญชี',
					submenu: [
						{
							key: 25,
							text: 'รายงานการรับชำระ',
							onClick: () =>
								redirect(`${ROUTE_PATH.PAYMENT_ACCOUNTREPORT.LINK}`),
						},
						{
							key: 26,
							text: 'รายงานสรุปยอดค้างชำระ',
							onClick: () => redirect(`${ROUTE_PATH.OUTSTANDING_BALANCE.LINK}`),
						},
						{
							key: 27,
							text: 'รายงานลูกหนี้รายตัว',
							onClick: () => redirect(`${ROUTE_PATH.RECEIVABLES.LINK}`),
						},
						{
							key: 28,
							text: 'รายงานรอบวางบิล',
							onClick: () => redirect(`${ROUTE_PATH.BILLING.LINK}`),
						},
						{
							key: 29,
							text: 'Aging',
							onClick: () => redirect(`${ROUTE_PATH.AGING.LINK}`),
						},
						{
							key: 41,
							text: 'รายงานการเติมเงิน',
							onClick: () => redirect(`${ROUTE_PATH.REPORTDEBIT.LINK}`),
						},
						{
							key: 57,
							text: 'รายงานชำระล่าช้า',
							onClick: () => redirect(`${ROUTE_PATH.OVERDUE.LINK}`),
						},
						{
							key: 30,
							text: 'รายการยอดขาย',
							onClick: () => redirect(`${ROUTE_PATH.SELLLIST.LINK}`),
						},
						{
							key: 31,
							text: 'รายการยกเลิกกรมธรรม์',
							onClick: () => redirect(`${ROUTE_PATH.REPORTCANCEL.LINK}`),
						},
						{
							key: 60,
							text: 'รายการ Log Error',
							onClick: () => redirect(`${ROUTE_PATH.REPORTLOGERROR.LINK}`),
						},
					],
				},
				{
					key: 48,
					text: 'รายงานบัญชี (ช็อปตรอ)',
					submenu: [
						{
							key: 46,
							text: 'รายงานประจำวัน (ช็อปตรอ)',
							onClick: () => redirect(`${ROUTE_PATH.REPORT.LINK}/sale-account`),
						},
						{
							key: 55,
							text: 'รายงานยกเลิกบิล',
							onClick: () =>
								redirect(`${ROUTE_PATH.REPORT.LINK}/cancel-bill-account`),
						},
						{
							key: 44,
							text: 'ตรวจสอบแนบสลิปบิล',
							onClick: () => redirect(`${ROUTE_PATH.REPORTCHECKSLIPBILL.LINK}`),
						},
					],
				}
			)
		} else if (isAdmin === 1 && role === 5) {
			menuList.push(
				{
					key: 18,
					text: 'แอดมิน',
					submenu: [
						{
							key: 20,
							text: 'ใบแจ้งหนี้',
							onClick: () => redirect(`${ROUTE_PATH.INVOICE_ADMIN.LINK}`),
						},
					],
				},
				{
					key: 24,
					text: 'รายงานบัญชี',
					submenu: [
						{
							key: 25,
							text: 'รายงานการรับชำระ',
							onClick: () =>
								redirect(`${ROUTE_PATH.PAYMENT_ACCOUNTREPORT.LINK}`),
						},
						{
							key: 26,
							text: 'รายงานสรุปยอดค้างชำระ',
							onClick: () => redirect(`${ROUTE_PATH.OUTSTANDING_BALANCE.LINK}`),
						},
					],
				}
			)
		} else if (role === 6) {
			menuList.push({
				key: 18,
				text: 'รายงานแอดมิน',
				submenu: [
					{
						key: 58,
						text: 'ยอดขายทีม',
						onClick: () => redirect(`${ROUTE_PATH.DOWNLINE_SALE.LINK}`),
					},
				],
			})
		}
		return menuList
	},
	SEAT: [
		{
			value: '1',
			text: '1',
		},
		{
			value: '2',
			text: '2',
		},
		{
			value: '3',
			text: '3',
		},
		{
			value: '4',
			text: '4',
		},
		{
			value: '5',
			text: '5',
		},
		{
			value: '6',
			text: '6',
		},
		{
			value: '7',
			text: '7',
		},
		{
			value: '8',
			text: '8',
		},
		{
			value: '9',
			text: '9',
		},
		{
			value: '10',
			text: '10',
		},
		{
			value: '11',
			text: '11',
		},
		{
			value: '12',
			text: '12',
		},
		{
			value: '13',
			text: '13',
		},
		{
			value: '14',
			text: '14',
		},
		{
			value: '15',
			text: '15',
		},
		{
			value: '16',
			text: '16',
		},
		{
			value: '17',
			text: '17',
		},
		{
			value: '18',
			text: '18',
		},
		{
			value: '19',
			text: '19',
		},
		{
			value: '20',
			text: '20',
		},
		{
			value: '21',
			text: '21',
		},
		{
			value: '22',
			text: '22',
		},
		{
			value: '23',
			text: '23',
		},
		{
			value: '24',
			text: '24',
		},
		{
			value: '25',
			text: '25',
		},
		{
			value: '26',
			text: '26',
		},
		{
			value: '27',
			text: '27',
		},
		{
			value: '28',
			text: '28',
		},
		{
			value: '29',
			text: '29',
		},
		{
			value: '30',
			text: '30',
		},
		{
			value: '31',
			text: '31',
		},
		{
			value: '32',
			text: '32',
		},
		{
			value: '33',
			text: '33',
		},
		{
			value: '34',
			text: '34',
		},
		{
			value: '35',
			text: '35',
		},
		{
			value: '36',
			text: '36',
		},
		{
			value: '37',
			text: '37',
		},
		{
			value: '38',
			text: '38',
		},
		{
			value: '39',
			text: '39',
		},
		{
			value: '40',
			text: '40',
		},
		{
			value: '41',
			text: '41',
		},
		{
			value: '42',
			text: '42',
		},
		{
			value: '43',
			text: '43',
		},
		{
			value: '44',
			text: '44',
		},
		{
			value: '45',
			text: '45',
		},
		{
			value: '46',
			text: '46',
		},
		{
			value: '47',
			text: '47',
		},
		{
			value: '48',
			text: '48',
		},
		{
			value: '49',
			text: '49',
		},
		{
			value: '50',
			text: '50',
		},
		{
			value: 'อื่นๆ',
			text: 'อื่นๆ',
		},
	],
	BODY_TYPE: [
		{
			value: 'เก๋ง',
			text: 'เก๋ง',
		},
		{
			value: 'กระบะ',
			text: 'กระบะ',
		},
		{
			value: 'เชิงพาณิชย์',
			text: 'เชิงพาณิชย์',
		},
		{
			value: 'โดยสาร',
			text: 'โดยสาร',
		},
		{
			value: 'รับจ้าง',
			text: 'รับจ้าง',
		},
		{
			value: 'มอเตอร์ไซค์',
			text: 'มอเตอร์ไซค์',
		},
		{
			value: 'รถบรรทุก',
			text: 'รถบรรทุก',
		},
		{
			value: 'รถตู้',
			text: 'รถตู้',
		},
	],
	FORM_TYPE: [
		{
			name: 'manual',
			value: 'คีย์มือ',
		},
		{
			name: 'auto',
			value: 'ออโต้',
		},
	],
	YES_NO: [
		{
			value: 'yes',
			text: 'ใช่',
		},
		{
			value: 'no',
			text: 'ไม่ใช่',
		},
	],
	LEGAL: [
		{ value: 'นิติบุคคล', text: 'นิติบุคคล' },
		{ value: 'บุคคลทั่วไป', text: 'บุคคลทั่วไป' },
	],
	CompanyPrb: [
		{
			key: 0,
			value: 'เคดับบลิวไอประกันภัย',
			text: 'เคดับบลิวไอประกันภัย',
		},
		{
			key: 1,
			value: 'ฟอลคอนประกันภัย',
			text: 'ฟอลคอนประกันภัย',
		},
		{
			key: 2,
			value: 'ไทยศรีประกันภัย',
			text: 'ไทยศรีประกันภัย',
		},
		{
			key: 3,
			value: 'อินทรประกันภัย(สาขาสีลม)',
			text: 'อินทรประกันภัย(สาขาสีลม)',
		},
		{
			key: 4,
			value: 'คุ้มภัยโตเกียวมารีนประกันภัย',
			text: 'คุ้มภัยโตเกียวมารีนประกันภัย',
		},
		{
			key: 5,
			value: 'เจมาร์ทประกันภัย (เจพี)',
			text: 'เจมาร์ทประกันภัย (เจพี)',
		},
		{
			key: 6,
			value: 'ไทยเศรษฐกิจประกันภัย',
			text: 'ไทยเศรษฐกิจประกันภัย',
		},
		{
			key: 7,
			value: 'แอกซ่าประกันภัย',
			text: 'แอกซ่าประกันภัย',
		},
		{
			key: 8,
			value: 'วิริยะประกันภัย',
			text: 'วิริยะประกันภัย',
		},
		{
			key: 9,
			value: 'เมืองไทยประกันภัย',
			text: 'เมืองไทยประกันภัย',
		},
		{
			key: 10,
			value: 'ทิพยประกันภัย',
			text: 'ทิพยประกันภัย',
		},
		{
			key: 11,
			value: 'ชับบ์สามัคคีประกันภัย',
			text: 'ชับบ์สามัคคีประกันภัย',
		},
		{
			key: 12,
			value: 'อินทรประกันภัย',
			text: 'อินทรประกันภัย',
		},
		{
			key: 13,
			value: 'บริษัทกลาง',
			text: 'บริษัทกลาง',
		},
	],
	CompanyIns: [
		{
			key: 0,
			value: 'อินทรประกันภัย',
			text: 'อินทรประกันภัย',
		},
		{
			key: 1,
			value: 'คุ้มภัยโตเกียวมารีนประกันภัย',
			text: 'คุ้มภัยโตเกียวมารีนประกันภัย',
		},
		{
			key: 2,
			value: 'ชับบ์สามัคคีประกันภัย',
			text: 'ชับบ์สามัคคีประกันภัย',
		},
    {
			key: 3,
			value: 'เคดับบลิวไอประกันภัย',
			text: 'เคดับบลิวไอประกันภัย',
		},
    {
			key: 4,
			value: 'วิริยะประกันภัย',
			text: 'วิริยะประกันภัย',
		},
		{
			key: 5,
			value: 'เมืองไทยประกันภัย',
			text: 'เมืองไทยประกันภัย',
		},
	],
	Error_Message_Api: [
		'(kumpai api error) ContactAdmin, ContactAdmin:(SendReqP3/TimeOut) please contact Technical Support Safety Insurance PCL.',
		'This agentcode has no stock left',
		'Authentication fail.',
		'Authentication fail: User Name/ Password is incorrect.',
		'Test Error',
	],
	YEAR_OF_TAX_LACK: () => {
		const date = new Date()

		let year = moment(date).format('YYYY')
		let beforeYear = parseInt(year) - 5
		let yearArr = []
		let i = 0

		while (beforeYear < year) {
			let beYear = beforeYear + 543
			yearArr.push({
				key: i,
				value: beforeYear,
				text: `${beforeYear} / ${beYear}`,
			})
			beforeYear = beforeYear + 1
			i = i + 1
		}
		return yearArr
	},
	DAMAGE1: () => {
		let price = 0
		let priceArr = []
		let i = 0
		while (price <= 10000) {
			priceArr.push({ key: i, value: price, text: numberWithCommas(price) })
			price = price + 1000
			i = i + 1
		}
		return priceArr
	},
	DAMAGE2: () => {
		let price = 0
		let priceArr = []
		let i = 0
		while (price <= 20000000) {
			priceArr.push({ key: i, value: price, text: numberWithCommas(price) })
			price = price + 5000000
			i = i + 1
		}
		return priceArr
	},
	DAMAGE3: () => {
		let price = 0
		let priceArr = []
		let i = 0
		while (price <= 2000000) {
			priceArr.push({ key: i, value: price, text: numberWithCommas(price) })
			price = price + 100000
			i = i + 1
		}
		return priceArr
	},
	DAMAGE4: () => {
		let price = 0
		let priceArr = []
		let i = 0
		while (price <= 1000000) {
			priceArr.push({ key: i, value: price, text: numberWithCommas(price) })
			price = price + 50000
			i = i + 1
		}
		return priceArr
	},
	DAMAGE5: () => {
		let price = 0
		let priceArr = []
		let i = 0
		while (price <= 1000000) {
			priceArr.push({ key: i, value: price, text: numberWithCommas(price) })
			price = price + 100000
			i = i + 1
		}
		return priceArr
	},
	TITLE: async (type) => {
		const API = defaultController()
		const res = await API.getTitle()
		if (isValidResponse(res)) {
			const text = res.result
			const textFilter = text.filter((e) => e.type === type)
			const textOption = textFilter.map((e) => {
				return {
					value: e.title,
					text: e.title,
				}
			})
			return textOption
		}
	},
	CAR_TYPE: async () => {
		const API = carController()
		const res = await API.getCarType()
		if (isValidResponse(res)) {
			const carType = res.result
			const carTypeOption = carType.map((e) => {
				return {
					value: e.car_type,
					text: `${e.car_type} ${e.car_type_description}`,
				}
			})
			return carTypeOption
		}
	},
	CAR_TYPE_PRB: async () => {
		const API = defaultController()
		const res = await API.getCarTypePrb()
		if (isValidResponse(res)) {
			const compulsoryTypeRes = res.result
			const compulsoryTypeOption = compulsoryTypeRes.map((e) => {
				return {
					...e,
					value: e.prb_type_code,
					text: `(${e.prb_type_code}) ${e.prb_type_description}`,
				}
			})
			return compulsoryTypeOption.sort((a, b) => a.value - b.value)
		}
	},
	COMPANY_PRB_BRAND: async () => {
		const API = companyController()
		const res = await API.getCompanyBrand()
		if (isValidResponse(res)) {
			const company = res.result
			const companyList = company.filter((e) => e.prb_rank !== '99')
			const companyOption = companyList.map((e) => {
				return {
					...e,
					value: e.company_name,
					text: `${e.company_name} (ออกหน้าร้าน)`,
				}
			})
			return companyOption.sort((a, b) => a.prb_rank - b.prb_rank)
		}
	},
	COMPANY_INSURE_BRAND: async () => {
		const API = companyController()
		const res = await API.getCompanyBrand()
		if (isValidResponse(res)) {
			const company = res.result
			const companyList = company.filter(
				(e) => e.insure_rank?.substr(1, 2) === 's'
			)
			const companyOption = companyList.map((e) => {
				return {
					...e,
					value: e.company_name,
					text: `${e.company_name} (ออกหน้าร้าน)`,
				}
			})
			return companyOption.sort(
				(a, b) => a.insure_rank?.split('s')[0] - b.insure_rank.split('s')[0]
			)
		}
	},
	CAR_BRAND: async () => {
		const API = carController()
		const res = await API.getAllBrands()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					rank: e.rank,
					value: e.brand,
					text: e.brand,
					image: e.icon,
				}
			})
			brandOption.push({
				rank: null,
				value: 'none',
				text: 'เพิ่มยี่ห้อรถ',
				image: null,
			})
			return brandOption
		}
	},
	CAR_YEAR: async (brand) => {
		const API = carController()
		const res = await API.getYearsByName(brand)
		if (isValidResponse(res)) {
			const years = res.result
			const yearOption = years.map((e) => {
				return {
					value: e.year,
					text: e.year,
				}
			})
			yearOption.push({
				value: 'none',
				text: 'เพิ่มปีรถ',
			})
			return yearOption
		} else {
			return [
				{
					value: 'none',
					text: 'เพิ่มปีรถ',
				},
			]
		}
	},
	CAR_YEAR_ALL: () => {
		const currYear = moment().format('YYYY')
		const arr = []
		for (let i = 1; i <= 1e2; i++) {
			const year = Number(currYear) + 1 - i
			const yearStr = `${year}`
			arr.push({ key: i, value: year, text: yearStr })
		}
		return arr
	},
	CAR_SERIES: async (brand, year) => {
		const API = carController()
		const res = await API.getSeriesByName(brand, year)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.series,
					text: e.series,
				}
			})
			seriesOption.push({
				value: 'none',
				text: 'เพิ่มรุ่นรถ',
			})
			return seriesOption
		} else {
			return [
				{
					value: 'none',
					text: 'เพิ่มรุ่นรถ',
				},
			]
		}
	},
	CAR_SUB_SERIES: async (brand, year, series) => {
		const API = carController()
		const res = await API.getSubseriesByName(brand, year, series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const subSeriesOption = subSeries.map((e) => {
				return {
					value: e.sub_series,
					text: e.sub_series === '' ? 'ไม่มี' : e.sub_series,
				}
			})
			return subSeriesOption
		} else {
			return []
		}
	},
	CAR_BRAND_AXA_CMI: async () => {
		const API = carController()
		const res = await API.getBrandAxaCmi()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandsOption = brands.map((e) => {
				return {
					value: e.Make,
					text: e.Make,
				}
			})
			return brandsOption
		}
	},
	CAR_SERIES_AXA_CMI: async (brand) => {
		const API = carController()
		const res = await API.getSeriesAxaCmi(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.Model,
					text: e.Model,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_AXA_CMI: async (brand, series) => {
		const API = carController()
		const res = await API.getSubseriesAxaCmi(brand, series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const subSeriesOption = subSeries.map((e) => {
				return {
					value: e.SubModel,
					text: e.SubModel,
				}
			})
			return subSeriesOption
		}
	},
	CAR_BRAND_AXA_INS: async () => {
		const API = carController()
		const res = await API.getBrandAxaIns()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandsOption = brands.map((e) => {
				return {
					value: e.Make,
					text: e.Make,
				}
			})
			return brandsOption
		}
	},
	CAR_YEAR_AXA_INS: async (brand) => {
		const API = carController()
		const res = await API.getYearAxaIns(brand)
		if (isValidResponse(res)) {
			const years = res.result
			const yearOption = years.map((e) => {
				return {
					value: e.year,
					text: e.year,
				}
			})
			return yearOption
		}
	},
	CAR_SERIES_AXA_INS: async (brand, year) => {
		const API = carController()
		const res = await API.getSeriesAxaIns(brand, year)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.Model,
					text: e.Model,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_AXA_INS: async (brand, year, series) => {
		const API = carController()
		const res = await API.getSubseriesAxaIns(brand, year, series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const subSeriesOption = subSeries.map((e) => {
				return {
					value: e.SubModel,
					text: e.SubModel,
				}
			})
			return subSeriesOption
		}
	},
	CAR_BRAND_INTRA: async () => {
		const API = carController()
		const res = await API.getBrandIntra()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					no: e.no,
					value: e.brand_short,
					text: e.brand,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_INTRA: async (brand) => {
		const API = carController()
		const res = await API.getSeriesIntraByName(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.id,
					text: e.description,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_INTRA_V2: async () => {
		const API = carController()
		const res = await API.getBrandIntraV2()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_code,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_INTRA_V2: async (brand) => {
		const API = carController()
		const res = await API.getSeriesIntraByNameV2(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_code,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_Jaymart: async () => {
		const API = carController()
		const res = await API.getBrandJaymart()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					no: e.id,
					value: e.code,
					text: e.description,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_Jaymart: async (brand) => {
		const API = carController()
		const res = await API.getSeriesJaymartByName(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.code,
					text: e.description,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_THAISRI_INS: async () => {
		const API = carController()
		const res = await API.getBrandThaisriIns()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_code,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_YEAR_THAISRI_INS: async (brand) => {
		const API = carController()
		const res = await API.getYearThaisriIns(brand)
		if (isValidResponse(res)) {
			const year = res.result
			const yearOption = year.map((e) => {
				return {
					value: e.model_year,
					text: e.model_year,
				}
			})
			return yearOption
		}
	},
	CAR_SERIES_THAISRI_INS: async (brand, year) => {
		const API = carController()
		const res = await API.getSeriesThaisriByNameIns(brand, year)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_code,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_THAISRI_INS: async (brand, series, year) => {
		const API = carController()
		const res = await API.getSubSeriesThaisriByNameIns(brand, series, year)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const seriesOption = subSeries.map((e) => {
				return {
					code: e.sub_model_code,
					value: e.sub_model_name,
					text: e.sub_model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_THAISRI: async () => {
		const API = carController()
		const res = await API.getBrandThaisri()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_THAISRI: async (brand) => {
		const API = carController()
		const res = await API.getSeriesThaisriByName(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_name,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_THAISETAKIJ: async () => {
		const API = carController()
		const res = await API.getBrandThaiSetakij()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_code,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_THAISETAKIJ: async (brand) => {
		const API = carController()
		const res = await API.getSeriesThaiSetakij(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_code,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_DHIPAYA: async () => {
		const API = carController()
		const res = await API.getBrandDhipaya()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_code,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_DHIPAYA: async (brand) => {
		const API = carController()
		const res = await API.getSeriesDhipayaByName(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_code,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_DHIPAYA: async (series) => {
		const API = carController()
		const res = await API.getSubSeriesDhipayaByName(series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const seriesOption = subSeries.map((e) => {
				return {
					code: e.sub_model_code,
					value: e.sub_model_name,
					text: e.sub_model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_KWI: async () => {
		const API = carController()
		const res = await API.getBrandKwi()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_KWI: async (brand) => {
		const API = carController()
		const res = await API.getSeriesKwi(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_name,
					text: e.model_name,
					seat: e.seat,
				}
			})
			return seriesOption
		}
	},
  NATIONALKWI: async () => {
		const API = defaultController()
		const res = await API.getNationalKwi()
		if (isValidResponse(res)) {
			const list = res.result.map((e, i) => {
				return {
					key: i,
					text: `${e.nationality_th}`,
					value: e.nationality_code,
				}
			})
			return list
		}
	},
	CAR_BRAND_DD: async () => {
		const API = carController()
		const res = await API.getBrandComdd()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_DD: async (brand) => {
		const API = carController()
		const res = await API.getSeriesComdd(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_name,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_DD: async (brand, series) => {
		const API = carController()
		const res = await API.getSubseriesComdd(brand, series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const subSeriesOption = subSeries.map((e) => {
				return {
					value: e.SubModel,
					text: e.SubModel,
				}
			})
			return subSeriesOption
		}
	},
	CAR_BRAND_CHUBB: async () => {
		const API = carController()
		const res = await API.getBrandChubb()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_YEAR_CHUBB: async (brand) => {
		const API = carController()
		const res = await API.getYearsChubb(brand)
		if (isValidResponse(res)) {
			const years = res.result
			const yearOption = years.map((e) => {
				return {
					value: e.year,
					text: e.year,
				}
			})
			return yearOption
		}
	},
	CAR_SERIES_CHUBB: async (brand, year) => {
		const API = carController()
		const res = await API.getSeriesChubb(brand, year)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model_name,
					text: e.model_name,
				}
			})
			return seriesOption
		}
	},
	CAR_BRAND_RVP: async () => {
		const API = carController()
		const res = await API.getBrandRVP()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_SERIES_RVP: async (brand) => {
		const API = carController()
		const res = await API.getBrandRVP()
		if (isValidResponse(res)) {
			const brands = res.result.filter((e) => e.make_name === brand)
			const brandOption = brands.map((e) => {
				return {
					value: e.make_name,
					text: e.make_name,
				}
			})
			return brandOption
		}
	},
	CAR_BRAND_VIRIYA_INS: async () => {
		const API = carController()
		const res = await API.getBrandViriyaIns()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandsOption = brands.map((e) => {
				return {
					value: e.brand,
					text: e.brand,
				}
			})
			return brandsOption
		}
	},
	CAR_YEAR_VIRIYA_INS: async (brand) => {
		const API = carController()
		const res = await API.getYearViriyaIns(brand)
		if (isValidResponse(res)) {
			const years = res.result
			const yearOption = years.map((e) => {
				return {
					value: e.year,
					text: e.year,
				}
			})
			return yearOption
		}
	},
	CAR_SERIES_VIRIYA_INS: async (brand) => {
		const API = carController()
		const res = await API.getSeriesViriyaIns(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.model,
					text: e.model,
				}
			})
			return seriesOption
		}
	},
	CAR_SUB_SERIES_VIRIYA_INS: async (brand, series) => {
		const API = carController()
		const res = await API.getSubseriesViriyaIns(brand, series)
		if (isValidResponse(res)) {
			const subSeries = res.result
			const subSeriesOption = subSeries.map((e) => {
				return {
					value: e.submodel,
					text: e.submodel,
					code: e.submodel,
				}
			})
			return subSeriesOption
		}
	},
  CAR_BRAND_FCI: async () => {
		const API = carController()
		const res = await API.getBrandFci()
		if (isValidResponse(res)) {
			const brands = res.result
			const brandsOption = brands.map((e) => {
				return {
					value: e.Make,
					text: e.Make,
				}
			})
			return brandsOption
		}
	},
	CAR_SERIES_FCI: async (brand) => {
		const API = carController()
		const res = await API.getSeriesFci(brand)
		if (isValidResponse(res)) {
			const series = res.result
			const seriesOption = series.map((e) => {
				return {
					value: e.Model,
					text: e.Model,
				}
			})
			return seriesOption
		}
	},
	INSURE_TYPE: async () => {
		const type = [
			{
				text: 'ชั้น 2+ ซ่อมอู่',
				value: 'ชั้น 2+ ซ่อมอู่',
				type: '2+',
				repairType: 'ซ่อมอู่',
			},
			// {
			// 	text: 'ชั้น 2 ซ่อมอู่',
			// 	value: 'ชั้น 2 ซ่อมอู่',
			// 	type: '2',
			// 	repairType: 'ซ่อมอู่',
			// },
			{
				text: 'ชั้น 3+ ซ่อมอู่',
				value: 'ชั้น 3+ ซ่อมอู่',
				type: '3+',
				repairType: 'ซ่อมอู่',
			},
			{
				text: 'ชั้น 3 ซ่อมอู่',
				value: 'ชั้น 3 ซ่อมอู่',
				type: '3',
				repairType: 'ซ่อมอู่',
			},
		]
		const insureTypeObj = type.map((e, i) => {
			return {
				key: e.i,
				value: e.value,
				text: e.label,
				type: e.type,
				repairType: e.repairType,
			}
		})
		return insureTypeObj.sort((a, b) => a.value - b.value)
	},
	CAR_CODE: async () => {
		const API = defaultController()
		const res = await API.getAutoScene()
		if (isValidResponse(res)) {
			const autoScene = res.result.idcar
			const autoSceneObj = autoScene
				.filter(
					(e) =>
						![
							'320.1',
							'420',
							'520',
							'540',
							'610',
							'620',
							'630',
							'730',
						].includes(e.value) &&
						!(e.value === '210' && e.label === '(210)-รถกระบะ-ส่วนบุคคล')
				)
				.map((e, i) => {
					return {
						key: e.i,
						value: e.value,
						text: e.label,
					}
				})
			return autoSceneObj.sort((a, b) => a.value - b.value)
		}
	},
	INSTALLMENT: (amount, carCode, protectedDate) => {
		if (carCode !== '730') {
			return [
				{ key: 0, value: 'full', text: 'จ่ายเต็ม' },
				// {
				// 	key: 1,
				// 	value: '3',
				// 	text: `ผ่อน 3 งวด ${
				// 		installmentPrice('3', amount, carCode, protectedDate)?.otherMonth
				// 	}`,
				// },
				// {
				// 	key: 2,
				// 	value: '6',
				// 	text: `ผ่อน 6 งวด ${
				// 		installmentPrice('6', amount, carCode, protectedDate)?.otherMonth
				// 	}`,
				// },
				// {
				// 	key: 3,
				// 	value: '8',
				// 	text: `ผ่อน 8 งวด ${
				// 		installmentPrice('8', amount, carCode, protectedDate)?.otherMonth
				// 	}`,
				// },
				// {
				// 	key: 4,
				// 	value: '10',
				// 	text: `ผ่อน 10 งวด ${
				// 		installmentPrice('10', amount, carCode, protectedDate)?.otherMonth
				// 	}`,
				// },
			]
		}
		return [
			{ key: 0, value: 'full', text: 'จ่ายเต็ม' },
			// {
			// 	key: 1,
			// 	value: '3',
			// 	text: `ผ่อน 3 งวด ${
			// 		installmentPrice('3', amount, carCode, protectedDate)?.otherMonth
			// 	}`,
			// },
			// {
			// 	key: 2,
			// 	value: '6',
			// 	text: `ผ่อน 6 งวด ${
			// 		installmentPrice('6', amount, carCode, protectedDate)?.otherMonth
			// 	}`,
			// },
		]
	},
	VIF_ACTIVE: async () => {
		const API = userController()
		const res = await API.getVifActive()
		if (isValidResponse(res)) {
			const { result } = res
			const list = result.map((e, i) => {
				return {
					key: i + 1,
					value: e.cuscode,
					text: e.name,
				}
			})
			return list
		}
	},
	PROVINCES: async () => {
		const API = addressController()
		const res = await API.getProvinces()
		if (isValidResponse(res)) {
			const result = res.result.onlyProvinces
			const list = result.map((e) => {
				return {
					value: e.province,
					text: e.province,
				}
			})
			return list
		} else {
			return []
		}
	},
	ALL_COUNT_LOT: async () => {
		const API = systemController()
		const res = await API.getAllCountLot()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e) => {
				return {
					value: e.import_file_count,
					text: e.import_file_count,
				}
			})
			console.log(list)
			return list
		}
	},
	SERVICE_LIST: async () => {
		const API = productController()
		const res = await API.getListService()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					name: e.name,
					value: e.code_product,
					price: e.price,
				}
			})
			return list
		}
	},
	COLORCARAXA: async () => {
		const API = colorController()
		const res = await API.getColorAxa()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: e.Name_TH,
					value: e.Name_TH,
				}
			})
			return list
		}
	},
	COUNTRYAXA: async () => {
		const API = defaultController()
		const res = await API.getCountryDj()
		if (isValidResponse(res)) {
      const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: `${e.name_EN} / ${e.name_TH}`,
					value: e.code,
				}
			})
			return list
		}
	},
	NATIONALAXA: async () => {
    const API = defaultController()
		const res = await API.getNationalityDj()
		if (isValidResponse(res)) {
      const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: `${e.name_EN} / ${e.name_TH}`,
					value: e.code,
				}
			})
			return list
		}
	},
	COLORCARTHAISRI: async () => {
		const API = colorController()
		const res = await API.getColorThaisri()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: e.name_TH,
					value: e.name_TH,
				}
			})
			return list
		}
	},
	COUNTRYTHAISRI: async () => {
		const API = defaultController()
		const res = await API.getCountryThaisri()

		if (isValidResponse(res)) {
			const list = res.result.map((e, i) => {
				return {
					key: i,
					text: `${e.name_EN} / ${e.name_TH}`,
					value: e.code,
				}
			})
			return list
		}
	},
	NATIONALTHAISRI: async () => {
		const API = defaultController()
		const res = await API.getNationalThaisri()
		if (isValidResponse(res)) {
			const list = res.result.map((e, i) => {
				return {
					key: i,
					text: `${e.name_EN} / ${e.name_TH}`,
					value: e.code,
				}
			})
			return list
		}
	},
	COLORCARRVP: async () => {
		const API = colorController()
		const res = await API.getColorRvp()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: e.name_TH,
					value: e.name_TH,
				}
			})
			return list
		}
	},
	COLORCARFCI: async () => {
		const API = colorController()
		const res = await API.getColorFCI()
		if (isValidResponse(res)) {
			const data = await res.result
			const list = data.map((e, i) => {
				return {
					key: i,
					text: e.name_TH,
					value: e.name_TH,
				}
			})
			return list
		}
	},
}
