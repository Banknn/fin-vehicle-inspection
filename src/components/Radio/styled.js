import styled, { css } from 'styled-components'
import { Radio } from 'antd'
import { THEME } from '../../themes'

const { Group } = Radio

export const RadioBox = styled.div`
	display: flex;
	flex-direction: column;
`

export const RadioGroupComponent = styled(Group)`
	${(props) => {
		switch (props.className) {
			case 'travel-wrapper':
				return css`
					.ant-radio-wrapper {
						width: 110px;
					}
					.ant-radio-checked .ant-radio-inner {
						border-color: ${THEME.COLORS.RED_2};
					}
					.ant-radio-input:focus + .ant-radio-inner {
						box-shadow: 0 0 0 3px #ffe6e6;
					}
					.ant-radio-inner::after {
						background-color: ${THEME.COLORS.RED_2};
					}
				`
			case 'group-radio':
				return css`
					/* .ant-radio-button-wrapper-checked {
						color: ${THEME.COLORS.RED_2};
					}
					.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
						border-color: ${THEME.COLORS.RED_2};
					} */
				`
			default:
				return css``
		}
	}}
`
