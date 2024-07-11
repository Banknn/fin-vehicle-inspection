import React from 'react'
import { ButtonComponent } from './styled'

export const Button = ({
	className,
	onClick,
	children,
	style,
	selected,
	name,
	width,
	bgColor,
	type,
	disabled,
}) => {
	return (
		<ButtonComponent
			className={className}
			onClick={onClick}
			style={style}
			selected={selected}
			name={name}
			width={width}
			bgColor={bgColor}
			type={type}
			disabled={disabled}
		>
			{children}
		</ButtonComponent>
	)
}
