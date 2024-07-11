import React from 'react'
import { Span, Box, Label } from '..'
import { InputComponent, SearchComponent } from './styled'

const { Group } = InputComponent

const Input = ({
	className,
	onChange,
	name,
	value,
	valueCheckErr,
	label,
	color,
	style,
	placeholder,
	required,
	maxLength,
	type,
	error,
	addonAfter,
	disabled,
  notvalue,
  addonBefore,
}) => {
	return (
		<>
			{label && (
				<div style={{ marginTop: '5px' }}>
					<Label color={color}>
						{label} {required && <Span color='red'>*</Span>}
					</Label>
				</div>
			)}
			<InputComponent
				className={className}
				onChange={onChange}
				name={name}
				value={value}
				style={style}
				placeholder={placeholder}
				maxLength={maxLength}
				type={type}
				addonBefore={addonBefore}
				addonAfter={addonAfter}
				disabled={disabled}
        notvalue={notvalue ? 1 : 0}
			/>
			{((!value && error) || (valueCheckErr)) && (
				<Box>
					<Span color='red'>{error}</Span>
				</Box>
			)}
		</>
	)
}

const InputGroup = ({ compact, size, children }) => {
	return (
		<Group compact={compact} size={size}>
			{children}
		</Group>
	)
}

const InputSearch = ({
	onChange,
	placeholder,
	className,
	value,
	onPressEnter,
	onSearch,
	enterButton,
	name,
	style,
	loading,
}) => {
	return (
		<SearchComponent
			placeholder={placeholder}
			name={name}
			className={className}
			onChange={onChange}
			value={value}
			onPressEnter={onPressEnter}
			onSearch={onSearch}
			enterButton={enterButton}
			style={style}
			loading={loading}
			autoComplete='off'
		/>
	)
}

Input.Group = InputGroup
Input.Search = InputSearch

export { Input }
