import styled from 'styled-components'
import { Tabs } from 'antd'
import { THEME } from '../../themes'

export const TabContainer = styled(Tabs)`
	.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
		color: ${THEME.COLORS.TEXT_RED};
	}
	.ant-tabs-tab-btn {
		color: ${THEME.COLORS.TEXT_BLACK2};
	}
`
