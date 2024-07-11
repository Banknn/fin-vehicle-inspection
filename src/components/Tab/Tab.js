import React from 'react'
import { TabContainer } from './styled'

const { TabPane } = TabContainer

export const Tab = ({ onChange, type, data, activeKey }) => {
	return (
		<TabContainer
			onChange={onChange}
			type={type}
			activeKey={activeKey}
		>
			{data.map((e, i) => {
				return (
					<TabPane key={i} tab={e.name} disabled={e.disabled}>
						{e.content}
					</TabPane>
				)
			})}
		</TabContainer>
	)
}
