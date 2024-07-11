import React, { useEffect } from 'react'
import { Form as AntdForm } from 'antd'

export const Form = (props) => {
	const [form] = AntdForm.useForm()

	useEffect(() => {
		form.setFieldsValue({ ...props.fieldsValue })
	}, [form, props])

	return (
		<AntdForm form={props.form} fields={props.fields}>
			{props.map((e, i) => {
				return (
					<AntdForm.Item
						key={i}
						name={e.name}
						label={e.label}
						rules={e.rules}
						help={e.help}
						required={e.required}
					>
						{e.children}
					</AntdForm.Item>
				)
			})}
		</AntdForm>
	)
}
