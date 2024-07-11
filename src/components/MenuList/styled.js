import styled from 'styled-components'
import { Menu as AntdMenu } from 'antd'
import { THEME } from '../../themes'

export const Menu = styled(AntdMenu)`
	.ant-menu-item:hover,
	.ant-menu-item-active,
	.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
	.ant-menu-submenu-active,
	.ant-menu-submenu-title:hover {
		color: ${THEME.COLORS.RED};
	}
	.ant-menu-submenu:hover
		> .ant-menu-submenu-title
		> .ant-menu-submenu-expand-icon,
	.ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
		color: black;
	}
`

export const MenuItem = styled(AntdMenu.Item)`
	cursor: pointer;
	margin: 0;
	color: #a8a6be;
	&:hover {
		border-right: 4px solid ${THEME.COLORS.RED};
    background: #FFF0F5;
	}
	&:active {
		color: ${THEME.COLORS.RED};
    background: #FFF5EE;
	}
`

export const SubMenu = styled(AntdMenu.SubMenu)`
	.ant-menu-item:hover,
	.ant-menu-item-active,
	.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
	.ant-menu-submenu-active,
	.ant-menu-submenu-title:hover {
		color: ${THEME.COLORS.RED};
	}
	.ant-menu-item:active,
	.ant-menu-submenu-title:active {
		background: #FFF5EE;
	}
	.ant-menu-submenu:hover
		> .ant-menu-submenu-title
		> .ant-menu-submenu-expand-icon,
	.ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
		color: ${THEME.COLORS.RED};
	}

	color: #a8a6be;
	&:hover {
		.ant-menu-submenu:hover
			> .ant-menu-submenu-title
			> .ant-menu-submenu-expand-icon,
		.ant-menu-submenu:hover
			> .ant-menu-submenu-title
			> .ant-menu-submenu-arrow {
			color: ${THEME.COLORS.RED};
		}
	}
`
