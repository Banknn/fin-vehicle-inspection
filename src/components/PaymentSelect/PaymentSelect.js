import React from 'react'
import { PaymentSelectComponent } from './styled'

export const PaymentSelect = ({
	onClick,
	children,
	value,
	defaultValue,
	name,
	borderColor,
	bgColor,
}) => {
	return (
		<PaymentSelectComponent
			onClick={onClick}
			value={value}
			defaultValue={defaultValue}
			name={name}
			borderColor={borderColor}
			bgColor={bgColor}
		>
			{children}
		</PaymentSelectComponent>
	)
}
