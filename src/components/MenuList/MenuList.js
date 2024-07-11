import React from 'react'
import { Menu, MenuItem, SubMenu } from './styled'
import { Label } from '../index'

export const MenuList = ({ dataList }) => {
	const handleClick = (e) => {
		let item = dataList.find((el) => {
			if (el.key === parseInt(e.keyPath[e.keyPath.length - 1])) return true
			else return false
		})
		if (e.keyPath.length > 1) {
			item = item.submenu.find((el) => {
				if (el.key === parseInt(e.keyPath[0])) return true
				else return false
			})
		}
		const handler = item.onClick
		handler && handler()
	}

	return (
		<Menu onClick={handleClick} selectable={false} mode='inline'>
			{dataList.map((e) => {
				if (e.submenu) {
					return (
						<SubMenu
							key={e.key}
							title={<Label className='menu-item'>{e.text}</Label>}
						>
							{e.submenu.map((el) => {
								return (
									!el.disabled && (
										<MenuItem key={el.key}>
											<Label className='menu-item'>{el.text}</Label>
										</MenuItem>
									)
								)
							})}
						</SubMenu>
					)
				} else {
					return (
						!e.hidden && (
							<MenuItem key={e.key} disabled={e.disabled}>
								<Label className='menu-item'>{e.text}</Label>
							</MenuItem>
						)
					)
				}
			})}
		</Menu>
	)
}
