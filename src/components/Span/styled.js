import styled, { css } from 'styled-components'
import { THEME } from '../../themes'

export const SpanComponent = styled.span`
	font-family: ${(props) =>
		props.size === 'bold' ? 'anakotmai-bold' : 'anakotmai'};
	${(props) => {
		switch (props.color) {
			case 'red':
				return css`
					color: ${THEME.COLORS.RED_2};
				`
			case 'white':
				return css`
					color: ${THEME.COLORS.WHITE};
				`
			case 'black':
				return css`
					color: ${THEME.COLORS.TEXT_BLACK};
				`
			case 'blue':
				return css`
					color: ${THEME.COLORS.BLUE};
				`
			case 'gray':
				return css`
					color: ${THEME.COLORS.GRAY2};
				`
			case 'error':
				return css`
					color: ${THEME.COLORS.ERROR_RED};
				`
			default:
				return css``
		}
	}}
  ${(props) => {
		switch (props.className) {
			case 'text-head-inv':
				return css`
					font-weight: bold;
				`
			default:
				return css``
		}
	}}
`
