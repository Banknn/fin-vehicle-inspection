import React from 'react'
import { ContainerComponent } from './styled'

export const Container = ({ children, className }) => {
	return (
		<ContainerComponent className={className}>{children}</ContainerComponent>
	)
}
