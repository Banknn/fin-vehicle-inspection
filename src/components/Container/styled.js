import styled, { css } from 'styled-components'

export const ContainerComponent = styled.div`
	/* Labtops Size */

	@media only screen and (min-width: 1024px) and (max-width: 1281px) {
		.section-detail-info {
			height: 50vh !important;
		}
	}

	.section {
		padding: 0 150px;
	}

	.section-detail-info {
		background-color: #f14c50;
		height: 65vh;
		width: 100%;
		text-align: center;
	}

	.section-menu-info {
		padding: 50px;
	}

	.selection-info {
		width: 94%;
		margin: 4em 3% 2% 3%;
		text-align: center;
		border-radius: 2px;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
	}

	.selection-step {
		width: 76%;
		margin: 4em 20% 2% 2%;
		text-align: center;
		border-radius: 2px;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
	}

	.step-header {
		width: 100%;
		text-align: left;
	}

	.selection-wrapper {
		padding: 2em 3em 2em 3em;
		width: 100%;
		text-align: center;
	}

	.step-wrapper {
		margin: 2.5em 0 0 3em;
		padding: 0 0 2em 0;
	}

	.quotation-wrapper {
		width: 75%;
		margin-top: 120px;
		margin-bottom: 120px;
		text-align: center;
		border-radius: 2px;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.25);
	}

  .section-new{
    position: absolute;
    width: 100%;
  }

	${(props) => {
		switch (props.className) {
			case 'header-wrapper':
				return css`
					width: 95%;
					display: flex;
					justify-content: space-between;
					align-items: center;
				`
			case 'footer-wrapper':
				return css`
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					height: 100%;
					padding: 20px 0;
				`
			case 'body':
				return css`
					width: 900px;
					margin: 20px 0;
				`
			case 'brand-wrapper':
				return css`
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: center;
				`
			case 'container':
				return css`
					width: 80%;
					margin: 50px 0;
				`
			case 'summary':
				return css`
					padding: 10px 50px;
				`
			case 'report-container':
				return css`
					margin-top: 20px;
				`
			default:
				return css``
		}
	}}
	margin-left: auto;
	margin-right: auto;
`
