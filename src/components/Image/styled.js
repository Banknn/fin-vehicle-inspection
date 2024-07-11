import styled, { css } from 'styled-components'

export const ImageComponent = styled.img`
	${(props) => {
		switch (props.className) {
			case 'logo-header':
				return css`
					width: 100px;
					cursor: pointer;
				`
			case 'social-media-logo-footer':
				return css`
					width: 40px;
          margin-left: 20px;
          margin-right: 20px;
				`
			case 'info-homepage-img':
				return css`
					width: 100%;
          border-top: 2px solid #FFFFFF;
				`
			case 'brand-img':
				return css`
					width: 100px;
					border-radius: 5px;
				`
			case 'menu-img':
				return css`
					margin-top: -140px;
					width: 150px;
				`
			case 'cus-old-new-icon-pointer':
				return css`
					width: 120px;
					margin: 50px 0 20px 0;
					cursor: pointer;
				`
			case 'cus-old-new-icon':
				return css`
					width: 120px;
					margin: 50px 0 20px 0;
				`
			case 'logo-card-img':
				return css`
					width: 150px;
				`
			case 'brand-logo':
				return css`
					margin-right: 20px;
					width: 30%;
					max-width: 70px;
					cursor: pointer;
				`
			case 'table-logo-img':
				return css`
					width: 75px;
				`
			case 'quotation-img':
				return css`
					width: 70%;
					margin: 50px 0 10px;
				`
			case 'payment-selected-img':
				return css`
					width: 65%;
					cursor: pointer;
				`
			case 'commission':
				return css`
          width: 100%;
					max-width: 980px;
					cursor: pointer;
				`
			case 'installPay':
				return css`
          width: 80px;
          height: 60px;
				`
			default:
				css``
		}
	}}
`
