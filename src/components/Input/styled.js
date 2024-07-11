import styled, { css } from 'styled-components'
import { Input } from 'antd'
import { THEME } from '../../themes'

export const InputComponent = styled(Input)`
	border-color: ${(props) => props.required && THEME.COLORS.RED};
  background-color: ${(props) => props.value && !props.notvalue && '#1890ff33'};
  width: 100%;
	${(props) => {
		switch (props.className) {
			case 'input-group':
				return css`
					width: calc(100% - 58px) !important;
				`
			case 'bill-price-input':
				return css`
          width: 200px;
					text-align: right;
				`
			default:
				return css`
					margin-top: 5px;
				`
		}
	}}
`

const { Search } = Input
export const SearchComponent = styled(Search)`
	.ant-btn-primary {
		background: ${THEME.COLORS.RED};
		border-color: ${THEME.COLORS.RED};
	}
`
