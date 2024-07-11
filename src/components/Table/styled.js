import styled, { css } from 'styled-components'
import { Table } from 'antd'
import { THEME } from '../../themes'

export const TableComponent = styled(Table)`
	.ant-table-thead > tr > th {
		background-color: ${THEME.COLORS.TEXT_RED};
		color: #fff;
	}

	.ant-table-tbody > tr.ant-table-row-selected > td {
		background-color: ${THEME.COLORS.FADE_RED};
	}

	.ant-table-thead > tr > th.subservice {
		background-color: #8bac5d;
		color: #fff;
	}

	.ant-table-thead > tr > th.subcom {
		background-color: #1baaff;
		color: #fff;
	}

	.ant-table-thead > tr > th.center {
		text-align: center;
	}

	${(props) => {
		switch (props.className) {
			case 'waiting-work-wrapper':
				return css`
					margin-top: 20px;
				`
			case 'report-data-table':
				return css``
			default:
				return css``
		}
	}}
`
