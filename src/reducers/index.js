import { combineReducers } from 'redux'
import { routeHistoryRedux } from './routeReducer'
import { authenReducer } from './authenReducer'
import { customerReducer } from './customerReducer'
import { loadingReducer } from './loadingReducer'
import { quotationReducer } from './quotationReducer'
import { pdfReducer } from './pdfReducer'
import { creditPayReducer } from './creditPayReducer'
import { creditReducer } from './creditReducer'
import { invoicePaymentReducer } from './invoicePaymentReducer'
import { profileReducer } from './profileReducer'
import { premissionsReducer } from './premissionsReducer'
import { notiOverdueReducer } from './notiOverdueReducer'
import { filesSuccessReducer } from './filesSuccessReducer'
import { creditListReducer } from './creditListReducer'
import { detailSlipBillReducer } from './detailSlipBillReducer'
import { installmentReducer } from './installmentReducer'
import { popupReducer } from './popupReducer'
import { orderReducer } from './orderReducer'

export const rootReducer = combineReducers({
	routeHistoryRedux,
	authenReducer,
	customerReducer,
	loadingReducer,
	quotationReducer,
	pdfReducer,
	creditPayReducer,
	creditReducer,
	invoicePaymentReducer,
	profileReducer,
	premissionsReducer,
	notiOverdueReducer,
	filesSuccessReducer,
	creditListReducer,
	detailSlipBillReducer,
	installmentReducer,
	popupReducer,
  orderReducer
})
