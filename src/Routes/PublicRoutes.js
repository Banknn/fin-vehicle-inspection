import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import { Loading } from '../components'

export const PublicRoutes = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return (
					<Suspense fallback={<Loading />}>
						<Component {...props} />
					</Suspense>
				)
			}}
		/>
	)
}
