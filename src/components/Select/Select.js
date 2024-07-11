import React from 'react'
import { Span, Box, Label } from '..'
import { SelectComponent } from './styled'

const { Option } = SelectComponent

export const Select = ({
	className,
	onChange,
	name,
	value,
	bordered,
	disabled,
	showArrow,
	showSearch,
	defaultValue,
	options = [],
	style,
	size,
	label,
	placeholder,
	color,
	required,
	error,
	notvalue,
	tokenSeparators,
	mode,
	allowClear,
}) => {
	return (
		<>
			<div style={{ marginTop: '5px' }}>
				<Label color={color}>
					{label} {required && <Span color='red'>*</Span>}
				</Label>
			</div>
			<SelectComponent
				className={className}
				onChange={(v, e) => {
					onChange(v, e, {
						name: name,
						value: v,
					})
				}}
				name={name}
				value={value}
				bordered={bordered}
				disabled={disabled}
				showArrow={showArrow}
				showSearch={showSearch}
				defaultValue={defaultValue}
				placeholder={placeholder}
				style={style}
				size={size}
				tokenSeparators={tokenSeparators}
				mode={mode}
				filterOption={(input, option) => {
					return (
						option.children
							?.toString()
							.toLowerCase()
							.indexOf(input?.toLowerCase()) >= 0
					)
				}}
				notvalue={notvalue ? 1 : 0}
				allowClear={allowClear}
			>
				{options.map((e, i) => {
					return (
						<Option key={i} value={e.value}>
							{e.text}
						</Option>
					)
				})}
			</SelectComponent>
			{!value && error && (
				<Box>
					<Span color='red'>{error}</Span>
				</Box>
			)}
		</>
	)
}
