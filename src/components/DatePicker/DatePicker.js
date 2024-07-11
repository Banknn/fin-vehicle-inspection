import React from 'react'
import { Span, Label } from '..'
import { DatePickerComponent } from './styled'

export const DatePicker = ({
	className,
	onChange,
	name,
	value,
	format,
	placeholder,
  notvalue
}) => {
	return (
		<DatePickerComponent
			className={className}
			placeholder={placeholder}
			onChange={onChange}
      allowClear={false} 
			name={name}
			value={value}
			format={format}
      notvalue={notvalue ? 1 : 0}
		/>
	)
}

export const DatePickerWithLabel = ({
	className,
	onChange,
	name,
	value,
	format,
	placeholder,
	color,
	label,
	help,
	disabledDate,
	disabled,
  notvalue
}) => {
	return (
		<>
			{label && (
				<div style={{ marginTop: '5px' }}>
					<Label color={color}>{label}</Label>
				</div>
			)}
			<DatePickerComponent
				className={className}
				placeholder={placeholder}
				onChange={onChange}
				name={name}
				value={value}
        allowClear={false} 
				format={format}
				disabledDate={disabledDate}
				disabled={disabled}
        notvalue={notvalue ? 1 : 0}
			/>
			<div>
				<Span color='gray'>{help}</Span>
			</div>
		</>
	)
}
