import styled, { css } from 'styled-components'
import { THEME } from '../../themes'

export const LabelComponent = styled.div`
	${(props) => {
		switch (props.className) {
			case 'd-flex':
				return css`
					display: flex;
				`
			case 'profile-header-text':
				return css`
					cursor: pointer;
					color: ${THEME.COLORS.WHITE};
					font-size: 18px;
				`
			case 'name':
				return css`
					color: ${THEME.COLORS.WHITE};
					font-size: 16px;
				`
			case 'credit':
				return css`
					color: ${THEME.COLORS.WHITE};
					font-size: 14px;
				`
			case 'link-header':
				return css`
					cursor: pointer;
					color: ${THEME.COLORS.WHITE};
				`
			case 'form-header':
				return css`
					color: ${THEME.COLORS.WHITE};
					font-family: anakotmai-bold;
					font-size: 24px;
				`
			case 'menu-lb':
				return css`
					width: 200px;
					text-align: center;
					position: absolute;
					margin-top: 90px;
					font-size: 26px;
					font-weight: bold;
					color: #666666;
				`
			case 'topic-cus-old-new':
				return css`
					font-size: 32px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.RED};
				`
			case 'topic-head':
				return css`
					font-weight: bold;
					color: #ffffff;
					font-size: 18px;
				`
			case 'title-form':
				return css`
					width: fit-content;
					font-size: 26px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.TEXT_RED};
					border-bottom: 1px solid;
					margin: 0 auto 10px auto;
				`
			case 'title-chart':
				return css`
					width: fit-content;
					font-size: 18px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.TEXT_RED};
					margin: 0 auto 10px auto;
				`
			case 'title-car-detail':
				return css`
					font-size: 16px;
					color: ${THEME.COLORS.TEXT_RED};
					font-weight: bold;
				`
			case 'desc-car-detail':
				return css`
					font-size: 14px;
					color: #4e4b4b;
					font-weight: bold;
				`
			case 'title-second-form':
				return css`
					font-size: 18px;
					font-weight: bold;
					color: ${THEME.COLORS.TEXT_RED};
					border-bottom: ${props.noLine ? 'none' : '3px solid #ff6c75'};
					padding-bottom: 5px;
					margin-bottom: 10px;
					margin-top: 10px;
				`
			case 'title-second-form-preview':
				return css`
					font-size: 18px;
					font-weight: bold;
					color: ${THEME.COLORS.TEXT_BLACK2};
					border-bottom: 3px solid ${THEME.COLORS.TEXT_BLACK2};
					padding-bottom: 5px;
					margin-bottom: 10px;
				`
			case 'create-data':
				return css`
					font-size: 20px;
					font-weight: bold;
					cursor: pointer;
					&:hover {
						font-size: 22px;
					}
				`
			case 'step-header':
				return css`
					text-align: left;
					color: ${THEME.COLORS.WHITE};
					font-family: anakotmai-bold;
					font-size: 26px;
				`
			case 'selection-title':
				return css`
					font-size: 32px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.RED};
					text-decoration: underline;
				`
			case 'selection-footer':
				return css`
					font-size: 16px;
					color: black;
				`
			case 'back-btn-label':
				return css`
					font-size: 18px;
					color: black;
				`
			case 'car-brand':
				return css`
					font-size: 16px;
					font-weight: bold;
					color: black;
				`
			case 'selection-option':
				return css`
					font-size: 16px;
					font-weight: bold;
					color: black;
				`
			case 'step-state':
				return css`
					font-size: 20px;
					font-family: anakotmai-bold;
					color: rgba(0, 0, 0);
				`
			case 'step-state-waiting':
				return css`
					font-size: 20px;
					font-family: anakotmai-bold;
					color: rgba(0, 0, 0, 0.45);
				`
			case 'step-description':
				return css`
					font-size: 21px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.RED};
				`
			case 'step-description-waiting':
				return css`
					font-size: 21px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.RED + '80'};
				`
			case 'save-label':
				return css`
					font-weight: bold;
					font-size: 20px;
					color: white;
				`
			case 'row-price':
				return css`
					width: 100px;
				`
			case 'price-title-card':
				return css`
					color: #878787;
					font-size: 16px;
				`
			case 'price-card':
				return css`
					color: ${THEME.COLORS.TEXT_RED};
					font-size: 28px;
					font-weight: bold;
					text-align: center;
					margin-top: 5px;
				`
			case 'additional-info':
				return css`
					margin-bottom: 5px;
					font-size: 18px;
					font-family: anakotmai;
					text-align: left;
				`
			case 'menu-title':
				return css`
					font-size: 22px;
					font-family: anakotmai-bold;
				`
			case 'menu-item':
				return css`
					font-size: 16px;
					font-family: anakotmai;
				`
			case 'price-description':
				return css`
					font-weight: bold;
				`
			case 'plan-description':
				return css`
					text-align: center;
					color: #4baee0;
					cursor: pointer;
				`
			case 'bill-price-description':
				return css`
					font-size: 18px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.TEXT_BLACK};
					width: 250px;
				`
			case 'bill-method-description':
				return css`
					font-size: 18px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.TEXT_BLACK};
					width: 150px;
				`
			case 'bill-price':
				return css`
					font-size: 18px;
					color: ${THEME.COLORS.TEXT_RED};
				`
			case 'bill-net':
				return css`
					font-size: 22px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.TEXT_RED};
				`
			case 'title-preview':
				return css`
					font-size: 16px;
					color: ${THEME.COLORS.TEXT_RED};
					line-height: 2;
				`
			case 'title-info-preview':
				return css`
					font-size: 16px;
					line-height: 2;
				`
			case 'summary-header':
				return css`
					font-size: 26px;
					font-family: anakotmai-bold;
					border-bottom: 3px solid ${THEME.COLORS.RED};
				`
			case 'balance-text':
				return css`
					font-size: 22px;
				`
			case 'balance-credit':
				return css`
					font-size: 22px;
				`
			case 'modal-header-text':
				return css`
					font-size: 20px;
					font-family: anakotmai-bold;
					color: ${THEME.COLORS.WHITE};
				`
			case 'download':
				return css`
					color: ${THEME.COLORS.BLUE};
					cursor: pointer;
				`
			case 'filter-label':
				return css`
					width: 100px;
				`
			case 'title-daily-price':
				return css`
					color: ${THEME.COLORS.GRAY2};
				`
			case 'show-daily-price':
				return css`
					color: ${THEME.COLORS.TEXT_RED};
					font-size: 20px;
				`
			case 'status':
				return css`
					color: ${props.status === 'active'
						? THEME.COLORS.GREEN
						: props.status === 'wait-cancel'
						? THEME.COLORS.TEXT_YELLOW
						: THEME.COLORS.TEXT_RED};
					cursor: default;
				`
      case 'title-second-form-divider':
				return css`
					font-size: 18px;
					font-weight: bold;
					color: ${THEME.COLORS.TEXT_RED};
				`
      case 'title-payment-tro':
				return css`
					font-weight: bold;
					color: ${THEME.COLORS.TEXT_RED};
				`
			default:
				return css``
		}
	}}
	${(props) => {
		switch (props.color) {
			case 'blue':
				return css`
					color: ${THEME.COLORS.BLUE};
				`
			case 'red':
				return css`
					color: ${THEME.COLORS.RED};
				`
			default:
				return css``
		}
	}}
	${(props) => {
		switch (props.cursor) {
			case `${props.cursor}`:
				return css`
					cursor: ${props.cursor};
				`
			default:
				return css``
		}
	}}
`
