import React from 'react'
import { CheckboxComponent } from './styled'

export const Checkbox = ({ onChange, label }) => {
	return <CheckboxComponent onChange={onChange}>{label}</CheckboxComponent>
}
