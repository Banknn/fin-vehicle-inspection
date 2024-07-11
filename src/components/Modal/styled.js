import styled from 'styled-components'

export const ModalComponent = styled.div`
	position: fixed;
	overflow: hidden;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.65);
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5em 1em;
	z-index: 999;
	box-sizing: border-box;
`
