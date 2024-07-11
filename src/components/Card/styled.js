import styled, { css } from 'styled-components'

export const CardComponent = styled.div`
	${(props) => {
		switch (props.className) {
			case 'menu-card-disabled':
			case 'menu-card':
				return css`
					width: 275px;
					height: 200px;
					background-color: #ffffff;
					border: 1px solid #e7e5e5;
					box-sizing: border-box;
					border-radius: 10px;
					display: flex;
					justify-content: center;
					flex-direction: column;
					align-items: center;
					box-shadow: 0px 4px 4px rgba(119, 119, 119, 0.25);
					margin: 0 10px;
					${(props) => {
						if (props.className === 'menu-card') {
							return css`
								cursor: pointer;
								&:hover {
									box-shadow: 0px 4px 4px rgba(119, 119, 119, 0.9);
								}
							`
						}
						if (props.className === 'menu-card-disabled') {
							return css`
								cursor: not-allowed;
								filter: invert(10%);
							`
						}
					}}
				`
			case 'tax-card':
				return css`
					box-shadow: 0px 4px 4px rgba(119, 119, 119, 0.25);
					border-radius: 5px;
					width: 200px;
					height: 130px;
					padding: 20px;
					margin-left: 30px;
					margin-right: 30px;
				`
			default:
				return css``
		}
	}}
`
