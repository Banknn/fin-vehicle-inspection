import styled, { css } from 'styled-components'
import { THEME } from '../../themes'

export const BoxComponent = styled.div`
	${(props) => {
		switch (props.className) {
			case 'd-flex':
				return css`
					display: flex;
					align-items: center;
				`
			case 'accept-group-btn-wrapper':
				return css`
					text-align: center;
					margin-top: 30px;
				`
			case 'profile-header':
				return css`
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				`
			case 'form-wrapper':
				return css`
					width: 80%;
					box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
					border-radius: 2px;
					margin: 30px auto 50px auto;
				`
			case 'form-wrapper-payment':
				return css`
					width: 80%;
					border-radius: 2px;
					margin: 30px auto 50px auto;
				`
			case 'form-header-wrapper':
				return css`
					width: 100%;
					padding: 10px 20px;
					background-color: ${THEME.COLORS.TEXT_RED};
				`
			case 'form-body-wrapper':
				return css`
					padding: 20px 50px;
					background-color: #ffffff;
				`
			case 'link-header-wrapper':
				return css`
					display: flex;
					margin-top: 5px;
				`
			case 'social-media-logo-footer-wrapper':
				return css`
					width: 150px;
					display: flex;
					justify-content: space-around;
				`
			case 'left-menu':
				return css`
					display: flex;
					align-items: center;
					width: 160px;
					justify-content: space-between;
				`
			case 'main-menu':
				return css`
					margin-top: -100px;
					display: flex;
					justify-content: space-around;
					width: 90%;
					margin-left: auto;
					margin-right: auto;
				`
			case 'modal-customer':
				return css`
					width: 724px;
					height: auto;
					padding: 10px 20px 50px 20px;
					background-color: #ffffff;
					border-bottom-left-radius: 5px;
					border-bottom-right-radius: 5px;
					display: flex;
					flex-direction: row;
				`
			case 'modal-customer-renew':
				return css`
					width: 500px;
					height: auto;
					padding: 10px 20px 50px 20px;
					background-color: #ffffff;
					border-bottom-left-radius: 5px;
					border-bottom-right-radius: 5px;
					display: flex;
					flex-direction: row;
				`
			case 'modal-customer-old-new':
				return css`
					width: 100%;
					text-align: center;
				`
			case 'modal-broadcast':
				return css`
					width: 724px;
					height: auto;
					padding: 10px 20px 30px 20px;
					background-color: #ffffff;
					font-size: 16px;
					white-space: pre;
				`
			case 'modal-customer-tro':
				return css`
					width: 840px;
					height: auto;
					padding: 10px 20px 20px 20px;
					background-color: #ffffff;
					border-bottom-left-radius: 5px;
					border-bottom-right-radius: 5px;
				`
			case 'car-detail-wrapper':
				return css`
					width: 70%;
					border-radius: 2px;
					margin: 50px auto;
					box-shadow: 0px 4px 4px rgba(119, 119, 119, 0.25);
				`
			case 'car-detail-header-wrapper':
				return css`
					display: flex;
					justify-content: space-between;
					background-color: #f14d51;
					padding: 10px 35px;
				`
			case 'car-detail-body-wrapper':
				return css`
					display: flex;
					flex-direction: row;
					background-color: #ffffff;
					padding: 10px 20px;
				`
			case 'car-detail-logo':
				return css`
					width: 60%;
					text-align: center;
				`
			case 'car-detail-info':
				return css`
					width: 100%;
					padding: 10px 0;
				`
			case 'car-detail-row':
				return css`
					border-bottom: 1px solid #848484;
					padding-bottom: 10px;
					margin-bottom: 10px;
				`
			case 'car-model-row':
				return css`
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				`
			case 'logo-card':
				return css`
					border-bottom: 1px solid #e2e2e2;
				`
			case 'form-card-wrapper':
				return css`
					display: flex;
					flex-wrap: wrap;
				`
			case 'next-wrapper':
				return css`
					width: 100%;
					display: flex;
					justify-content: flex-end;
				`
			case 'prev-wrapper':
				return css`
					width: 100%;
					display: flex;
					justify-content: flex-start;
				`
			case 'row-input-wrapper':
				return css`
					display: flex;
					flex-direction: row;
					width: 100%;
				`
			case 'tax-input-wrapper':
				return css`
					width: 300px;
					padding-left: 20px;
					padding-right: 20px;
				`
			case 'selection-header':
				return css`
					display: flex;
					align-items: center;
					width: 500px;
					justify-content: space-between;
				`
			case 'step-header':
				return css`
					text-align: center;
					display: flex;
					align-items: center;
					width: 300px;
					justify-content: space-between;
				`
			case 'car-logo':
				return css`
					display: flex;
					text-align: center;
					align-items: center;
					width: 80%;
					height: 7em;
					justify-content: center;
					border-radius: 2px;
					flex-direction: column;
					margin: 0px;
					box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
				`
			case 'input-wrapper':
				return css`
					display: flex;
					flex-direction: row;
					width: 100%;
					margin: 0 auto 10px auto;
					justify-content: space-between;
				`
			case 'no-package-wrapper':
				return css`
					text-align: center;
					margin: 100px 0;
					color: '#848484';
				`
			case 'horizontal':
				return css`
					display: flex;
					flex-direction: row;
					margin-top: 10px;
					justify-content: center;
				`
			case 'price-form-wrapper':
				return css`
					margin-top: 20px;
					border-top: 1px solid #848484;
					padding-top: 10px;
				`
			case 'protection-form-wrapper':
				return css`
					margin-top: 20px;
					margin-bottom: 30px;
				`
			case 'protection':
				return css`
					width: 300px;
					margin-left: auto;
					margin-right: auto;
				`
			case 'price-row':
				return css`
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					width: 100%;
					border-top: 1px solid #e2e2e2;
					padding-top: 5px;
				`
			case 'new-work-btn-group':
				return css`
					margin-top: 20px;
					display: flex;
					justify-content: flex-end;
				`
			case 'search-box':
				return css`
					width: 320px;
				`
			case 'tax-card-wrapper':
				return css`
					display: flex;
					justify-content: center;
					margin-top: 60px;
					margin-bottom: 20px;
				`
			case 'row-center-wrapper':
				return css`
					display: flex;
					justify-content: center;
					flex-direction: column;
					align-items: center;
				`
			case 'col-center-wrapper':
				return css`
					display: flex;
					justify-content: center;
					flex-direction: row;
					align-items: center;
				`
			case 'additional-info-box':
				return css`
					margin: 1em;
					padding: 0 0 2em 0;
				`
			case 'card-list-wrapper':
				return css`
					display: flex;
					justify-content: space-between;
					box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
					border-radius: 3px;
					width: 70%;
					margin: 10px auto;
					padding: 10px 50px;
				`
			case 'company-card-wrapper':
				return css`
					display: flex;
					align-items: center;
					flex-direction: column;
				`
			case 'company-detail-card-wrapper':
				return css`
					display: flex;
					align-items: center;
				`
			case 'price-detail':
				return css`
					display: flex;
					width: 200px;
					justify-content: space-between;
				`
			case 'bill-price-detail':
				return css`
					display: flex;
					width: 90%;
					justify-content: space-between;
					margin: 5px auto;
				`
			case 'bill-price-method-wrapper':
				return css`
					display: flex;
				`
			case 'sum-price-detail':
				return css`
					display: flex;
					width: 400px;
					justify-content: space-between;
				`
			case 'discount-price-detail':
				return css`
					display: flex;
					width: 350px;
					justify-content: space-between;
					margin-left: auto;
				`
			case 'summary-wrapper':
				return css`
					margin: 10px 0px;
					padding: 15px;
					box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
					border-radius: 2px;
				`
			case 'col-between-wrapper':
				return css`
					margin: 30px 0px;
					display: flex;
					justify-content: space-between;
					flex-direction: row;
					align-items: center;
				`
			case 'insure-print':
				return css`
					text-align: center;
					margin-top: 20px;
				`
			case 'credit-commission':
				return css`
					display: flex;
					width: 85%;
					margin-right: auto;
					margin-left: auto;
				`
			case 'credit-balance':
				return css`
					text-align: center;
				`
			case 'credit-show-wrapper':
				return css`
					width: 70%;
					padding: 20px 50px;
					margin-left: auto;
					margin-right: auto;
					box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
					border-radius: 4px;
				`
			case 'credit-balance-wrapper':
				return css``
			case 'credit-addition':
				return css`
					border-top: 1px solid #dcdcdc;
					width: 500px;
					margin: 20px auto;
					padding: 15px 0;
				`
			case 'report-wrapper':
				return css`
					width: 80%;
					margin: 20px auto;
				`
			case 'report-table':
				return css`
					margin-top: 20px;
				`
			case 'report-table-debit':
				return css`
					width: 70%;
					margin-top: 20px;
					margin-left: auto;
					margin-right: auto;
				`
			case 'report-table-left':
				return css`
					display: flex;
					justify-content: start;
					margin-top: 20px;
				`
			case 'report-table-right':
				return css`
					display: flex;
					justify-content: end;
					margin-top: 20px;
				`
			case 'filter-box-wrapper':
				return css`
					border-radius: 4px;
					box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
					padding: 20px 0 30px 20px;
				`
			case 'filter-box':
				return css`
					display: flex;
					align-items: flex-end;
				`
			case 'filter-input':
				return css`
					margin-right: 10px;
				`
			case 'slip-print':
				return css`
					width: 500px;
					padding: 20px 15px;
					background-color: #fff;
				`
			case 'appointment-time':
				return css`
					display: flex;
					margin-bottom: 20px;
				`
			case 'modal-header':
				return css`
					display: flex;
					justify-content: space-between;
					padding: 15px;
					border-top-left-radius: 3px;
					border-top-right-radius: 3px;
					background-color: #fff;
					border-bottom: 1px solid #f0f0f0;
				`
			case 'modal-header-red':
				return css`
					display: flex;
					justify-content: space-between;
					padding: 15px;
					border-top-left-radius: 3px;
					border-top-right-radius: 3px;
					background-color: #fff;
					border-bottom: 1px solid #f0f0f0;
					background-color: ${THEME.COLORS.RED};
				`
			case 'modal-footer':
				return css`
					width: 100%;
					border-bottom-left-radius: 3px;
					border-bottom-right-radius: 3px;
					background-color: #fff;
					display: flex;
					justify-content: flex-end;
					padding: 15px 15px 15px 0;
					border-top: 1px solid #f0f0f0;
				`
			case 'amount-credit-wrapper':
				return css`
					width: 40%;
					margin: 10px auto 0 auto;
				`
			case 'amount-credit':
				return css`
					display: flex;
					justify-content: space-between;
				`
			case 'filter-table-box':
				return css`
					display: flex;
					height: 50px;
					padding-left: 15px;
					align-items: center;
				`
			case 'filter-item':
				return css`
					display: flex;
					align-items: center;
					margin-right: 10px;
				`
			case 'daily-price':
				return css`
					width: 175px;
					padding-left: 10px;
					box-shadow: 2px 2px 10px 1px rgb(0 0 0 / 10%);
					margin: 10px 20px;
					padding: 10px;
					border-radius: 3px;
					line-height: 35px;
				`
			case 'filter-box-row':
				return css`
					display: flex;
					margin-bottom: 10px;
				`
			case 'box-commission':
				return css`
					margin-top: 50px;
					display: flex;
					justify-content: center;
				`
			case 'news-box':
				return css`
					width: 100%;
					height: 40px;
					background: #ffffff;
					display: flex;
					align-items: center;
				`
			case 'box-text-news-slide':
				return css`
					overflow: hidden;
					white-space: nowrap;
					font-weight: bold;
					width: 95%;
				`
			case 'text-user-credit-debit':
				return css`
					display: flex;
					justify-content: end;
					font-weight: bold;
					margin-top: 10px;
					margin-right: 20px;
				`
			case 'filter-chart-between':
				return css`
					display: flex;
					justify-content: space-between;
					align-items: center;
				`
			case 'chart-box-center':
				return css`
					display: flex;
					justify-content: center;
				`
			case 'chart-detail':
				return css`
					width: 80%;
				`
			case 'title-modal-inv':
				return css`
					font-weight: bold;
					font-size: 18px;
				`
			case 'service-select-box':
				return css`
					width: 400px;
					height: 400px;
					/* padding: 20px 15px; */
					background-color: #fff;
				`
			case 'history-bill':
				return css`
					width: 380px;
					padding: 0 15px 10px 15px;
					background-color: #fff;
				`
			case 'history-bill-file':
				return css`
					width: 900px;
					padding: 20px 15px;
					background-color: #fff;
				`
			case 'detail-payment-tro':
				return css`
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					margin-left: 20px;
					font-weight: 800;
				`
			case 'line-payment-tro':
				return css`
					background: ${THEME.COLORS.RED};
					width: 100%;
					height: 0.8px;
					margin-bottom: 10px;
				`
			case 'bg-white-payment':
				return css`
					background: #ffffff;
				`
			case 'image-card-wrapper':
				return css`
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
				`
			case 'image-qrcode':
				return css`
					margin: 20px 0 0 0;
				`
      case 'detail-header-wrapper':
        return css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid ${THEME.COLORS.RED_2};
          padding: 10px 35px;
        `
			default:
				css``
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
`
