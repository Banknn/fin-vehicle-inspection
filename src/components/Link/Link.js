import React from 'react'
import { LinkComponent } from './styed'

export const Link = ({ to, className, children, onClick }) => {
	return (
		<LinkComponent to={to} className={className} onClick={onClick}>
			{children}
		</LinkComponent>
	)
}
