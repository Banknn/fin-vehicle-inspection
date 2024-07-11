import React from 'react'
import { Label } from '../../components'
import { DetailLayout } from '../Layout/DetailLayout'
import { redirect, ROUTE_PATH } from '../../helpers'
import DataCustomer from './DataCustomer'

const InformationCustomer = () => {
	return (
		<>
			<DetailLayout
				isPreve={true}
				onClickPrevious={() => redirect(ROUTE_PATH.HOMEPAGE.LINK)}
			>
				<Label className='title-form'>แจ้งข้อมูลลูกค้า</Label>
				<DataCustomer />
			</DetailLayout>
		</>
	)
}

export default InformationCustomer
