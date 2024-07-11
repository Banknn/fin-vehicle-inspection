import styled, { css } from 'styled-components'
import { DatePicker } from 'antd'

export const DatePickerComponent = styled(DatePicker)`
  background-color: ${(props) => props.value && !props.notvalue && '#1890ff33'};
  width: 100%;

	@media only screen and (min-width: 320px) {
		${(props) => {
			switch (props.className) {
				case '':
					return css``
				default:
					return css`
						width: 100%;
						margin-top: 5px;
					`
			}
		}}
	}

	@media only screen and (min-width: 375px) {
	}

	@media only screen and (min-width: 414px) {
	}

	@media only screen and (min-width: 481px) {
	}

	/* Tablet Size */

	@media only screen and (min-width: 641px) {
		${(props) => {
			switch (props.className) {
				case 'protect-date':
					return css`
						width: 40%;
					`
				default:
					return css`
						width: 100%;
					`
			}
		}}
	}

	@media only screen and (min-width: 961px) {
	}

	/* Labtops Size */

	@media only screen and (min-width: 1024px) {
	}

	@media only screen and (min-width: 1281px) {
	}
`
