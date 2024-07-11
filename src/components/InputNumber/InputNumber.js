import React from 'react'
import { Span, Box, Label } from '..'
import { InputNumberComponent  } from './styled'

const InputNumber = ({
	label,
	color,
	required,
	error,
	placeholder,
	name,
	className,
	onChange,
	value,
	onStep,
	step,
	min,
	max,
	onPressEnter,
	style,
	disabled,
	defaultValue,
	formatter,
	parser,
	controls
}) => {
	return (
		<>
			<div style={{ marginTop: '5px' }}>
				<Label color={color}>
					{label} {required && <Span color='red'>*</Span>}
				</Label>
			</div>
			<InputNumberComponent
				placeholder={placeholder}
				name={name}
				className={className}
				onChange={onChange}
				value={value}
				onStep={onStep}
				step={step}
				min={min}
				max={max}
				onPressEnter={onPressEnter}
				style={style}
				disabled={disabled}
				defaultValue={defaultValue}
				formatter={formatter}
				parser={parser}
				controls={controls}
			/>
			{!value && error && (
				<Box>
					<Span color='red'>{error}</Span>
				</Box>
			)}
		</>
	)
}

export { InputNumber }
