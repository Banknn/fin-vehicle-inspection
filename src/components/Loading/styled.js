import styled, { keyframes } from 'styled-components'

const circle = keyframes`
  0%{
    top:60px;
    height:5px;
    border-radius: 50px 50px 25px 25px;
    transform: scaleX(1.7);
  }
  40%{
    height:20px;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100%{
    top:0%;
  }
`

const shadow = keyframes`
  0%{
    transform: scaleX(1.5);
  }
  40%{
    transform: scaleX(1);
    opacity: .7;
  }
  100%{
    transform: scaleX(.2);
    opacity: .4;
  }
`

export const LoadingComponent = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.4);
	width: 100vw;
	height: 100vh;
	z-index: 1000;
`

export const WrapperComponent = styled.div`
	width: 200px;
	height: 60px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`
export const CircleComponent = styled.div`
	width: 20px;
	height: 20px;
	position: absolute;
	border-radius: 50%;
	background-color: red;
	left: 15%;
	transform-origin: 50%;
	animation: ${circle} 0.5s alternate infinite ease;
	&:nth-child(2) {
		left: 45%;
		animation-delay: 0.2s;
	}
	&:nth-child(3) {
		left: auto;
		right: 15%;
		animation-delay: 0.3s;
	}
`
export const ShadowComponent = styled.div`
	width: 20px;
	height: 4px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 62px;
	transform-origin: 50%;
	z-index: -1;
	left: 15%;
	filter: blur(1px);
	animation: ${shadow} 0.5s alternate infinite ease;
	&:nth-child(4) {
		left: 45%;
		animation-delay: 0.2s;
	}
	&:nth-child(5) {
		left: auto;
		right: 15%;
		animation-delay: 0.3s;
	}
`

export const WrapperSpanComponent = styled.div`
	position: absolute;
	top: 75px;
	font-family: 'Lato';
	font-size: 20px;
	letter-spacing: 2px;
	color: #FFFFFF;
	left: 15%;
`
