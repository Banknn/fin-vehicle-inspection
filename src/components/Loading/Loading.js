import React from 'react'
import {
	LoadingComponent,
	WrapperComponent,
	CircleComponent,
	ShadowComponent,
  WrapperSpanComponent
} from './styled'

export const Loading = ({ children }) => {
	return (
		<LoadingComponent>
			<WrapperComponent>
				<CircleComponent />
				<CircleComponent />
				<CircleComponent />
				<ShadowComponent />
				<ShadowComponent />
				<ShadowComponent />
        <WrapperSpanComponent>กรุณารอสักครู่</WrapperSpanComponent>
			</WrapperComponent>
		</LoadingComponent>
	)
}
