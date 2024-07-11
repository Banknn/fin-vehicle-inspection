import styled from 'styled-components'
import { THEME } from '../../themes'

export const PaymentSelectComponent = styled.div`
	@media (max-width: 768px) {
		width: 45%;
		margin: 10px 5px;
	}
	@media (min-width: 768px) {
		width: 200px;
		margin: 20px 5px;
	}
	height: auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-evenly;
	border: 2px solid ${(props) => props.borderColor || '#e6e6e6'};
	background-color: ${(props) => props.bgColor || '#fafafa'};
	border-radius: 5px;
	padding: 10px;
	&:hover {
		border-color: ${THEME.COLORS.RED};
		background-color: ${THEME.COLORS.FADE_RED};
	}
`
