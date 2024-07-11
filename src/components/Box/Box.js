import React from 'react'
import { BoxComponent } from './styled'

export const Box = ({ children, className, onClick, width, style }) => {
	return (
		<BoxComponent
			className={className}
			onClick={onClick}
			width={width}
			style={style}
		>
			{children}
		</BoxComponent>
	)
}
