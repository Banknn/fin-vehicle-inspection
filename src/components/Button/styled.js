import styled, { css } from 'styled-components'
import { THEME } from '../../themes'
import { LabelComponent } from '../Label/styled'

export const ButtonComponent = styled.button`
	cursor: pointer;
	${(props) => {
		switch (props.className) {
			case 'accept-btn':
			case 'select-btn':
			case 'success-btn':
			case 'remove-btn':
				return css`
					font-size: 16px;
					width: 100px;
					height: 30px;
					background-color: ${(props) => {
						if (props.className === 'accept-btn') {
							return THEME.COLORS.TEXT_RED
						}
						if (props.className === 'select-btn') {
							return THEME.COLORS.BLUE
						}
						if (props.className === 'remove-btn') {
							return THEME.COLORS.TEXT_RED
						}
						if (props.className === 'success-btn') {
							return THEME.COLORS.GREEN
						}
					}};
					border: none;
					color: ${THEME.COLORS.WHITE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
					margin-right: 5px;
				`
			case 'credit-save':
			case 'credit-accept':
				return css`
					width: 100%;
					border: none;
					color: ${THEME.COLORS.WHITE};
					background-color: ${props.className === 'credit-accept'
						? THEME.COLORS.BLUE
						: THEME.COLORS.TEXT_RED};
					height: 30px;
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
					margin: 10px 0;
				`
			case 'company-btn':
				return css`
					border: 0px solid #ccc;
					border-radius: 5px;
					background-color: #fff;
					box-shadow: 2px 2px 2px -2px rgb(0 0 0 / 75%);
					padding: 0 0 10px 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: fit-content;
					margin: 20px 15px;
					justify-content: center;
					flex: 1;
					box-shadow: ${(props) =>
						props.selected === props.name
							? `0px 0px 10px 2px ${THEME.COLORS.RED}`
							: null};
				`
			case 'next-back-btn':
				return css`
					border: none;
					background-color: transparent;
					display: flex;
					align-items: center;
					margin: 0 40px 20px 0;
					&:hover {
						font-size: 16px;
					}
				`
			case 'next-btn':
				return css`
					border: none;
					background-color: transparent;
					padding: 5px 0;
					&:hover {
						box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 75%);
					}
					width: 70%;
					margin: 5px;
					height: 95%;
					cursor: pointer;
					justify-content: space-between;
				`
			case 'selection-btn':
				return css`
					border: 0px solid #ccc;
					border-radius: 4px;
					background-color: #fff;
					padding: 5px 20px;
					display: flex;
					align-items: center;
					box-shadow: 0px 2px 4px 0px rgb(0 0 0/ 25%);
					border: 1px solid #ccc;
					&:hover {
						background-color: ${THEME.COLORS.RED};
						border: 1px solid white;
						color: white;
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
					&:hover ${LabelComponent} {
						color: white;
					}
					width: 100%;
					height: 60px;
					cursor: pointer;
					justify-content: flex-start;
				`
			case 'brand-btn':
				return css`
					border: 0px solid #ccc;
					border-radius: 4px;
					background-color: #fff;
					padding-left: 30px;
					display: flex;
					align-items: center;
					box-shadow: 0px 2px 4px 0px rgb(0 0 0/ 25%);
					border: 1px solid #ccc;
					&:hover {
						background-color: ${THEME.COLORS.RED};
						border: 1px solid white;
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
					&:hover ${LabelComponent} {
						color: white;
					}
					width: 100%;
					height: 60px;
					cursor: pointer;
					justify-content: flex-start;
				`
			case 'back-btn':
				return css`					
					border: 0px solid #ccc;
					border-radius: 2px;
					background-color: #fff;
					padding: 5px 0;
					display: flex;
					align-items: center;
					&:hover {
							box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
						text-decoration: underline;
					}
					width: 50%;
					cursor: pointer;
          justify-content: center;
					align-self: center;
				`
			case 'save-btn':
				return css`
					border: 1px solid #ccc;
					border-radius: 4px;
					background-color: ${THEME.COLORS.RED + 'C0'};
					padding: 5px 0;
					&:hover {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
					width: 9em;
					margin: 5px;
					height: 50px;
					cursor: pointer;
				`
			case 'new-work-btn':
				return css`
					border: none;
					background-color: ${THEME.COLORS.RED};
					color: #ffffff;
					margin: 0 5px;
					width: 140px;
					height: 30px;
					&:hover {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
					&:hover {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
					padding: 0 1em;
					margin: 5px;
					height: 50px;
					cursor: pointer;
				`
			case 'cancel-btn':
				return css`
					border-radius: 4px;
					background-color: #fff;
					padding: 5px;
					margin: 5px;
					box-shadow: 0px 2px 4px 0px rgb(0 0 0/ 25%);
					border: 1px solid white;
					&:hover {
						border: 1px solid #ccc;
						box-shadow: 0px 5px 5px 0px rgb(0 0 0 / 50%);
					}
					cursor: pointer;
					width: 6em;
				`
			case 'modal-cancel-btn':
				return css`
					font-size: 16px;
					width: 80px;
					height: 30px;
					background-color: ${THEME.COLORS.WHITE};
					border: 1px solid ${THEME.COLORS.BLUE};
					color: ${THEME.COLORS.BLUE};
					margin-right: 10px;
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
				`
			case 'modal-ok-btn':
				return css`
					font-size: 16px;
					width: 80px;
					height: 30px;
					background-color: ${THEME.COLORS.BLUE};
					border: none;
					color: ${THEME.COLORS.WHITE};
					margin-right: 10px;
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
				`
			case 'btn-transparent':
				return css`
					background-color: transparent;
					border: transparent;
				`
			case 'cancel-bill-btn':
				return css`
					font-size: 12px;
					font-weight: 300;
					width: 100px;
					height: 25px;
					margin-left: 10px;
					background-color: ${THEME.COLORS.TEXT_RED};
					border: none;
					color: ${THEME.COLORS.WHITE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
					margin-right: 5px;
				`
			case 'select-bill-btn':
				return css`
					font-size: 12px;
					font-weight: 300;
					width: 100px;
					height: 25px;
					margin-left: 10px;
					background-color: ${THEME.COLORS.TEXT_BLUE};
					border: none;
					color: ${THEME.COLORS.WHITE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
					margin-right: 5px;
				`
			case 'remove-bill-btn':
				return css`
					font-size: 12px;
					font-weight: 300;
					width: 70px;
					height: 25px;
					margin-left: 10px;
					background-color: ${THEME.COLORS.TEXT_RED};
					border: none;
					color: ${THEME.COLORS.WHITE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						color: ${THEME.COLORS.WHITE};
						border: none;
					}
					margin-right: 5px;
				`
			case 'btn-open-file':
				return css`
					width: 40px;
					height: 25px;
					background-color: ${THEME.COLORS.BLUE};
					border-radius: 4px;
					border: none;
					color: ${THEME.COLORS.WHITE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						border: none;
					}
				`
			case 'btn-search-customer-tro':
				return css`
					background-color: ${THEME.COLORS.WHITE};
					border: 1px solid ${THEME.COLORS.BLUE};
					color: ${THEME.COLORS.BLUE};
					&:hover,
					&:focus {
						box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
					}
				`
			default:
				return css``
		}
	}}
	${(props) => {
		if (props.width) {
			return props.width
				? css`
						width: ${(props) => `${props.width}px`};
				  `
				: null
		}
	}}
	${(props) => {
		if (props.bgColor) {
			return props.bgColor
				? css`
						background-color: ${(props) => `${props.bgColor}`};
						&:hover {
							box-shadow: 2px 4px 4px 0px rgb(0 0 0 / 25%);
						}
				  `
				: null
		}
	}}
	${(props) => {
		if (props.disabled) {
			return css`
				background-color: #dcdcdc;
				box-shadow: none !important;
				cursor: not-allowed;
			`
		}
	}}
`
