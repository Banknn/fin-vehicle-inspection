import styled, { css } from 'styled-components'
import { Steps } from 'antd'
import { THEME } from '../../themes'

const { Step } = Steps

export const StepsComponent = styled(Steps)`
	.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
		background: ${THEME.COLORS.TEXT_RED};
	}
	.ant-steps-item-finish .ant-steps-item-icon,
	.ant-steps-item-process .ant-steps-item-icon {
		border-color: ${THEME.COLORS.TEXT_RED};
	}
	.ant-steps-item-finish
		> .ant-steps-item-container
		> .ant-steps-item-content
		> .ant-steps-item-title::after,
	.ant-steps-item-finish
		> .ant-steps-item-container
		> .ant-steps-item-tail::after {
		background-color: ${THEME.COLORS.TEXT_RED};
	}
	.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
		color: ${THEME.COLORS.TEXT_RED};
	}

	${(props) => {
		switch (props.className) {
			case 'vehicle-selection-steps':
				return css`
					margin: 0;
				`
			case 'step-horizon':
				return css`
					width: 50%;
					margin: 50px auto 30px auto;
				`
			default:
				return css`
					width: 50%;
					margin: 0 auto 30px auto;
				`
		}
	}}
`

export const StepComponent = styled(Step)``
