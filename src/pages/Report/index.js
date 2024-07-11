import React from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '../../components'
import InsuranceHistory from './InsuranceHistory'
import Invoice from './Invoice'
import DailyReport from './DailyReport'
import DailyReportAdmin from './DailyReportAdmin'
import CancelReport from './CancelReport'
import DownLineSaleReport from './DownLineSaleReport'
import SalesYearReport from './SalesYearReport'
import HistoryBill from './HistoryBill'
import CancelHistoryBill from './CancelHistoryBill'
import DailyShopReport from './DailyShopReport'
import KumpaiRenew from './KumpaiRenew'
import IncentiveShoptro from './IncentiveShoptro'
import FollowInstallInsure from './FollowInstallInsure'
import TaxDailyReport from './TaxDailyReport'
import CancelBillAccount from '../AccountAdminTro/CancelBillAccount'
import DailyBillAccount from '../AccountAdminTro/DailyBillAccount'

const Report = () => {
	const params = useParams()
	const reportName = params.report

	switch (reportName) {
		case 'invoice':
			return (
				<Box>
					<Invoice />
				</Box>
			)
		case 'insurance-history':
			return (
				<Box>
					<InsuranceHistory />
				</Box>
			)
		case 'sales':
			return (
				<Box>
					<DailyReport />
				</Box>
			)
		case 'sales-admin':
			return (
				<Box>
					<DailyReportAdmin />
				</Box>
			)
		case 'sales_year':
			return (
				<Box>
					<SalesYearReport />
				</Box>
			)
		case 'cancel':
			return (
				<Box>
					<CancelReport />
				</Box>
			)
		case 'downline-salereport':
			return (
				<Box>
					<DownLineSaleReport />
				</Box>
			)
		case 'history-bill':
			return (
				<Box>
					<HistoryBill />
				</Box>
			)
		case 'cancel-history-bill':
			return (
				<Box>
					<CancelHistoryBill />
				</Box>
			)
		case 'sale-shop':
			return (
				<Box>
					<DailyShopReport />
				</Box>
			)
		case 'insure-kumpai-renew':
			return (
				<Box>
					<KumpaiRenew />
				</Box>
			)
		case 'com-incentive-shoptro':
			return (
				<Box>
					<IncentiveShoptro />
				</Box>
			)
		case 'follow-install-insure':
			return (
				<Box>
					<FollowInstallInsure />
				</Box>
			)
		case 'cancel-bill-account':
			return (
				<Box>
					<CancelBillAccount />
				</Box>
			)
		case 'sale-account':
			return (
				<Box>
					<DailyBillAccount />
				</Box>
			)
		case 'tax-daily':
			return (
				<Box>
					<TaxDailyReport />
				</Box>
			)
		default:
			return
	}
}
export default Report
