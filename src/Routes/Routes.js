import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Result } from 'antd'
import { ProtectedRoutes } from './ProtectedRoutes'
import { PublicRoutes } from './PublicRoutes'
import { ProtectedPath, PublicPath } from './path'
import { Layout } from '../Layout'
import { Button } from '../components'

export const Routes = () => {
	const router = [...ProtectedPath, ...PublicPath]
	return (
		<Router>
			<Layout>
				<Switch>
					{router.map((route, i) => {
						if (route.auth) {
							return <ProtectedRoutes key={i} {...route} />
						} else {
							return <PublicRoutes key={i} {...route} />
						}
					})}
					<Route path='*'>
						<Result
							status='404'
							title='404'
							subTitle='ขออภัยในความไม่สะดวก กรุณาล็อกอินเข้าระบบใหม่อีกครั้ง'
							extra={
								<Button
									className='accept-btn'
									style={{ width: '150px' }}
									onClick={() =>
										(window.location.href =
											'https://www.fininsurance.co.th/system')
									}
								>
									เข้าระบบใหม่อีกครั้ง
								</Button>
							}
						/>
					</Route>
				</Switch>
			</Layout>
		</Router>
	)
}
