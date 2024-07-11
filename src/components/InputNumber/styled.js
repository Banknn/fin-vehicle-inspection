import styled from 'styled-components'
import { InputNumber } from 'antd'

export const InputNumberComponent = styled(InputNumber)`
	background-color: ${(props) => props.value && '#1890ff33'};
	width: 100%;
`