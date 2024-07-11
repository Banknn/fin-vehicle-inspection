import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { THEME } from '../../themes'
import { TableComponent } from './styled'

export const Table = ({
	columns,
	dataSource,
	size,
	bordered,
	pagination,
	scroll,
	onRow,
	className,
	rowClassName,
	rowSelection,
	style,
	loading,
	footer,
	summary,
	onChange,
}) => {
	return (
		<TableComponent
			columns={columns}
			dataSource={dataSource}
			className={className}
			size={size}
			bordered={bordered}
			pagination={pagination}
			scroll={scroll}
			onRow={onRow}
			onChange={onChange}
			rowClassName={rowClassName}
			style={style}
			rowSelection={rowSelection}
			footer={footer}
			summary={summary}
			loading={
				loading && {
					indicator: (
						<LoadingOutlined
							style={{ color: THEME.COLORS.RED, fontSize: '35px' }}
							spin
						/>
					),
				}
			}
		/>
	)
}
