import { lazy } from 'react'
import { ROUTE_PATH } from '../../helpers'

export const ProtectedPath = [
	{
		path: ROUTE_PATH.HOMEPAGE.LINK,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Homepage')),
	},
	{
		path: ROUTE_PATH.VEHICLE_SELECTION.LINK,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/VehicleSelectionPage')),
	},
	{
		path: ROUTE_PATH.WORKWAITING.LINK,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/WorkWaitingPage')),
	},
	{
		path: `${ROUTE_PATH.COMPULSORY_MOTOR.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/CompulsoryMotorForm')),
	},
	{
		path: `${ROUTE_PATH.CAR_INSURANCE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/CarInsurance')),
	},
	// {
	// 	path: `${ROUTE_PATH.TAX_CALCULATOR.LINK}`,
	// 	exact: true,
	// 	auth: true,
	// 	component: lazy(() => import('../../pages/TaxCalculator')),
	// },
	{
		path: `${ROUTE_PATH.SELECT_PLAN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/SelectPlan')),
	},
	{
		path: `${ROUTE_PATH.BILL.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Bill')),
	},
	{
		path: `${ROUTE_PATH.BILLLIST.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/BillList')),
	},
	// {
	// 	path: `${ROUTE_PATH.PROFILE.LINK}`,
	// 	exact: true,
	// 	auth: true,
	// 	component: lazy(() => import('../../pages/Profile')),
	// },
	{
		path: `${ROUTE_PATH.PREVIEW.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Preview')),
	},
	// {
	// 	path: `${ROUTE_PATH.PRINT.LINK}`,
	// 	exact: true,
	// 	auth: true,
	// 	component: lazy(() => import('../../pages/PrintPage')),
	// },
	// {
	// 	path: `${ROUTE_PATH.SUMMARY.LINK}`,
	// 	exact: true,
	// 	auth: true,
	// 	component: lazy(() => import('../../pages/Summary')),
	// },
	{
		path: `${ROUTE_PATH.CREDIT.LINK}/:type/:period`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Credit')),
	},
	{
		path: `${ROUTE_PATH.REPORT.LINK}/:report`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Report')),
	},
	{
		path: `${ROUTE_PATH.REPORT.LINK}/follow-install-insure/detail`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/Report/FollowInstallInsure/detail')
		),
	},
	{
		path: `${ROUTE_PATH.COMMISSION_TABLE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/CommissionTable')),
	},
	{
		path: `${ROUTE_PATH.DEBIT.LINK}/:type`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Debit')),
	},
	{
		path: `${ROUTE_PATH.UPLOADSLIPBILL.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/UploadSlipBill')),
	},
	{
		path: `${ROUTE_PATH.PAYMENTTRO.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/PaymentTro')),
	},
	{
		path: `${ROUTE_PATH.INVOICE_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/Invoice')),
	},
	{
		path: `${ROUTE_PATH.CANCEL_INSURANCE_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/CancelInsurance')),
	},
	{
		path: `${ROUTE_PATH.ALL_INSURANCE_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/AllInsurance')),
	},
	{
		path: `${ROUTE_PATH.INSURANCE_QUANTITY.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/InsuranceQuantity')),
	},
	{
		path: `${ROUTE_PATH.SYSTEM_PAY_INSURANCE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/SystemPayInsurance')),
	},
	{
		path: `${ROUTE_PATH.COMPANYONVIF_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/CompanyOnVif')),
	},
	{
		path: `${ROUTE_PATH.LOCKUSER_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/LockUser')),
	},
	{
		path: `${ROUTE_PATH.CREATE_USER_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/CreateUserAdmin')),
	},
	{
		path: `${ROUTE_PATH.NON_ACTIVE_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/NonActive')),
	},
	{
		path: `${ROUTE_PATH.CREATE_USER.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/CreateUser')),
	},
	{
		path: `${ROUTE_PATH.CREATE_USER_BY_CUSCODE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/CreateUserByCuscode')),
	},
	{
		path: `${ROUTE_PATH.GEN_QRCODE_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/GenQrcodeByAdmin')),
	},
	{
		path: `${ROUTE_PATH.PAY_INSTALLMENT.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/PayInstallment')),
	},
	{
		path: `${ROUTE_PATH.INSURANCE_OIDS_ADMIN.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/InsuranceOlds')),
	},
	{
		path: `${ROUTE_PATH.CHECK_LOG_API.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/LogApiCompany')),
	},
	{
		path: `${ROUTE_PATH.DOWNLINE_SALE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/Admin/DownlineSale')),
	},
	{
		path: `${ROUTE_PATH.PAYMENT_ACCOUNTREPORT.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/Payment')),
	},
	{
		path: `${ROUTE_PATH.OUTSTANDING_BALANCE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/AccountAdminReport/OutstandingBalance')
		),
	},
	{
		path: `${ROUTE_PATH.RECEIVABLES.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/Receivables')),
	},
	{
		path: `${ROUTE_PATH.BILLING.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/Billing')),
	},
	{
		path: `${ROUTE_PATH.AGING.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/Aging')),
	},
	{
		path: `${ROUTE_PATH.SELLLIST.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/SellList')),
	},
	{
		path: `${ROUTE_PATH.REPORTCANCEL.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/AccountAdminReport/ReportCancel')
		),
	},
	{
		path: `${ROUTE_PATH.REPORTDEBIT.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/ReportDebit')),
	},
	{
		path: `${ROUTE_PATH.REPORTDEBIT.LINK}/detail`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/AccountAdminReport/ReportDebit/detail')
		),
	},
	{
		path: `${ROUTE_PATH.REPORTCHECKSLIPBILL.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/AccountAdminTro/ReportCheckSlipBill')
		),
	},
	{
		path: `${ROUTE_PATH.REPORTCHECKSLIPBILL.LINK}/detail`,
		exact: true,
		auth: true,
		component: lazy(() =>
			import('../../pages/AccountAdminTro/ReportCheckSlipBill/detail')
		),
	},
	{
		path: `${ROUTE_PATH.OVERDUE.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/Overdue')),
	},
	{
		path: `${ROUTE_PATH.REPORTLOGERROR.LINK}`,
		exact: true,
		auth: true,
		component: lazy(() => import('../../pages/AccountAdminReport/ReportLogError')),
	},
]
