import React from 'react'
import { LabelComponent } from './styled'

export const Label = ({
	onClick,
	className,
	children,
	color,
	style,
	noLine,
	status,
	cursor,
}) => {
	return (
		<LabelComponent
			onClick={onClick}
			className={className}
			color={color}
			style={style}
			noLine={noLine}
			status={status}
			cursor={cursor}
		>
			{children}
		</LabelComponent>
	)
}
