import { lazy } from 'react'

export const PublicPath = [
	{
		path: '/login/:encoded/:type',
		exact: true,
		auth: false,
		component: lazy(() => import('../../pages/Login')),
	},
	// {
	// 	path: '/404',
	// 	exact: true,
	// 	auth: false,
	// 	component: lazy(
	// 		() =>
	// 			(window.location.href = 'https://www.fininsurance.co.th/system/login')
	// 	),
	// },
]
