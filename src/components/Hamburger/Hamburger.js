import React from 'react'
import { HamburgerComponent } from './styled'

export const Hamburger = ({ onClick, hidden }) => {
	return <HamburgerComponent onClick={onClick} hidden={hidden} />
}
