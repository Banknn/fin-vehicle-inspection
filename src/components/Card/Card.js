import React from 'react'
import { CardComponent } from './styled'

export const Card = ({ className, onClick, style, children }) => {
	return (
		<CardComponent className={className} onClick={onClick} style={style}>
			{children}
		</CardComponent>
	)
}
