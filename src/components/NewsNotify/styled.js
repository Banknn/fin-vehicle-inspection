import styled, { keyframes } from 'styled-components'

const slidetext = keyframes`
  from { 
    margin-left: 100%;
    width: 300%; 
  }
  to {
    margin-left: -80%;
    width: 100%;
  }
`

export const NewsNotifyComponent = styled.div``

export const NewsNotifyComponentP = styled.p`
	margin: 0px;
  animation: ${slidetext} 20s linear infinite;
`
