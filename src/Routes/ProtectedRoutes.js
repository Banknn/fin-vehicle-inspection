import React, { Suspense } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loading } from '../components'

export const ProtectedRoutes = ({ component: Component, ...rest }) => {
	const auth = useSelector((state) => state.authenReducer)
	return (
		<Route
			{...rest}
			render={(props) => {
				return (
					<Suspense fallback={<Loading />}>
						{auth.status ? (
							<Component {...props} />
						) : (
							<Redirect
								to={{
									pathname: '/404',
									state: { from: props.location },
								}}
							/>
						)}
					</Suspense>
				)
			}}
		/>
	)
}
