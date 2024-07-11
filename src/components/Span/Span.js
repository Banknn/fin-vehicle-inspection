import React from 'react'
import { SpanComponent } from './styled'

export const Span = ({ children, className, color, onClick, size, style }) => {
	return (
		<SpanComponent className={className} color={color} onClick={onClick} size={size} style={style}>
			{children}
		</SpanComponent>
	)
}
