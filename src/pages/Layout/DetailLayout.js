import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { Box, Button, Label, Step } from '../../components'
import { redirect, ROUTE_PATH } from '../../helpers'

export const DetailLayout = ({
	children,
	onClickPrevious,
	onClickForward,
	isStep,
	label,
	style,
}) => {
	const [stepCurrent, setStepCurrent] = useState(0)
	const location = useLocation()

	useEffect(() => {
		if (location.pathname === ROUTE_PATH.COMPULSORY_MOTOR.LINK) {
			setStepCurrent(0)
		}
		if (location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK) {
			setStepCurrent(1)
		}
		if (location.pathname === ROUTE_PATH.TAX_CALCULATOR.LINK) {
			setStepCurrent(2)
		}
		if (location.pathname === ROUTE_PATH.BILL.LINK) {
			setStepCurrent(3)
		}
	}, [location])

	const handleChangeStep = (e) => {
		setStepCurrent(e)
		if (e === 0) {
			redirect(ROUTE_PATH.COMPULSORY_MOTOR.LINK)
		}
		if (e === 1) {
			redirect(ROUTE_PATH.CAR_INSURANCE.LINK)
		}
		if (e === 2) {
			redirect(ROUTE_PATH.TAX_CALCULATOR.LINK)
		}
		if (e === 3) {
			redirect(ROUTE_PATH.BILL.LINK)
		}
	}

	return (
		<>
			{isStep && (
				<Step
					className='step-horizon'
					current={stepCurrent}
					onChange={handleChangeStep}
					steps={[
						{ title: 'พ.ร.บ.', decription: '' },
						{ title: 'ประกัน', decription: '' },
						{ title: 'คำนวณภาษี', decription: '', disabled: true },
						{ title: 'บิล', decription: '' },
					]}
				/>
			)}
			<Box className='form-wrapper' style={style}>
				{label ? (
					<Box className='form-header-wrapper'>
						<Label className='form-header'>{label}</Label>
					</Box>
				) : (
					<></>
				)}
				<Box className='form-body-wrapper'>
					{onClickPrevious && (
						<Box className='prev-wrapper'>
							<Button className='next-back-btn' onClick={onClickPrevious}>
								<LeftOutlined
									style={{
										color: 'red',
										fontSize: '26px',
										marginRight: '10px',
									}}
								/>
								ย้อนกลับ
							</Button>
						</Box>
					)}
					<Box>{children}</Box>
				</Box>
				{onClickForward && (
					<Box className='next-wrapper'>
						<Button className='next-back-btn' onClick={onClickForward}>
							ถัดไป{' '}
							<RightOutlined
								style={{ color: 'red', fontSize: '26px', marginLeft: '10px' }}
							/>
						</Button>
					</Box>
				)}
			</Box>
		</>
	)
}

export const DetailLayoutPayment = ({
	children,
	onClickPrevious,
	onClickForward,
	isStep,
	label,
	style,
}) => {
	const [stepCurrent, setStepCurrent] = useState(1)
	const location = useLocation()

	useEffect(() => {
		if (location.pathname === ROUTE_PATH.BILL.LINK) {
			setStepCurrent(0)
		}
		if (location.pathname === ROUTE_PATH.CAR_INSURANCE.LINK) {
			setStepCurrent(1)
		}
	}, [location])

	const handleChangeStep = (e) => {
		setStepCurrent(e)
		if (e === 0) {
			redirect(ROUTE_PATH.BILL.LINK)
		}
		if (e === 1) {
			redirect(ROUTE_PATH.CAR_INSURANCE.LINK)
		}
	}

	return (
		<>
			{isStep && (
				<Box style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
					<Step
						className='step-horizon'
						current={stepCurrent}
						onChange={handleChangeStep}
						steps={[
							{ title: 'บิล', decription: '' },
							{ title: 'ชำระเงิน', decription: '' },
						]}
					/>
				</Box>
			)}
			<Box className='form-wrapper-payment' style={style}>
				{label && (
					<Box className='form-header-wrapper'>
						<Label className='form-header'>{label}</Label>
					</Box>
				)}
				<Box className='form-body-wrapper'>
					{onClickPrevious && (
						<Box className='prev-wrapper'>
							<Button className='next-back-btn' onClick={onClickPrevious}>
								<LeftOutlined
									style={{
										color: 'red',
										fontSize: '26px',
										marginRight: '10px',
									}}
								/>
								ย้อนกลับ
							</Button>
						</Box>
					)}
					<Box>{children}</Box>
				</Box>
				{onClickForward && (
					<Box className='next-wrapper'>
						<Button className='next-back-btn' onClick={onClickForward}>
							ถัดไป{' '}
							<RightOutlined
								style={{ color: 'red', fontSize: '26px', marginLeft: '10px' }}
							/>
						</Button>
					</Box>
				)}
			</Box>
		</>
	)
}
