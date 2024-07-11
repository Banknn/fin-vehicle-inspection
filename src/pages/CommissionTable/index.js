import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Container, Label, Image, Button } from '../../components'
import { IMAGES } from '../../themes'
import { saveAs } from 'file-saver'

const CommissionTable = () => {
	const [pathImage, setPathImage] = useState('')
	const user = useSelector((state) => state.authenReducer.dataResult)

	useEffect(() => {
		if (
			(user.user_adviser === 'FNG22-055001' &&
			user.name.trim().slice(-14) === '(ควิกเซอร์วิส)') ||
      user.name.trim().slice(-22) === '(บริษัท ชิปป๊อป จำกัด)'
		) {
			setPathImage('commission-quick.png')
		} else if (user.vif_type === '1') {
			setPathImage('commission-debit.png')
		} else {
			setPathImage('commission-standart.png')
		}
	}, [user])

	return (
		<>
			<Container className='report-container'>
				<Box className='report-wrapper'>
					<Box className='filter-box-wrapper' style={{ paddingRight: '20px' }}>
						<Label className='title-form'>ตารางค่าคอมมิชชั่น</Label>
						<Box className='box-commission'>
							<Image
								src={IMAGES[pathImage]}
								alt='commission'
								className='commission'
							/>
						</Box>
						<Box className='accept-group-btn-wrapper'>
							<Button
								className='select-btn'
								width='150'
								onClick={() => saveAs(IMAGES[pathImage], 'commission')}
							>
								ดาวโหลด
							</Button>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default CommissionTable
