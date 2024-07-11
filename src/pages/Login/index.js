import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { userController } from '../../apiServices'
import { isValidResponse, redirect, ROUTE_PATH } from '../../helpers'
import { authenAction, profileAction, permissionsAction } from '../../actions'

const Login = () => {
	const dispatch = useDispatch()
	const { encoded, type } = useParams()
	const auth = useSelector((state) => state.authenReducer)

	const userLogin = useCallback(async () => {
		const API = userController()
		const res1 = await API.checkShaCode(encoded)
		if (isValidResponse(res1)) {
			const { sha_code, cuscode, name, status_permissions } = await res1.result
			const device_id = `WEB-${sha_code}`
			const body = {
				email: sha_code,
				token_noti: '24HKFSDFSD$12sads6d',
				device_id,
			}
			const res = await API.login(body)
			if (isValidResponse(res)) {
				const { result } = res
				const profileAPI = userController({ access_token: result.access_token })
				const profileRes = await profileAPI.getProfile()
				if (isValidResponse(profileRes)) {
					const { result: profileResult } = profileRes
					const paramsPremiss = { cuscode, name, status_permissions, sha_code: encoded }
					dispatch(
						authenAction({
							dataResult: profileResult,
							access_token: result.access_token,
							status: true,
							device_id,
						})
					)
					dispatch(profileAction(profileResult))
					dispatch(permissionsAction(paramsPremiss))
					setTimeout(() => {
						if (type === 'A') {
							redirect(ROUTE_PATH.HOMEPAGE.LINK)
						} else if (type === 'B') {
							redirect(ROUTE_PATH.COMPULSORY_MOTOR.LINK)
						} else if (type === 'C') {
							redirect(ROUTE_PATH.VEHICLE_SELECTION.LINK)
						}
					}, 1000)
				}
			} else {
				window.location.href =
					'https://www.fininsurance.co.th/finlock?action=logout'
			}
		}
	}, [dispatch, encoded, type])

	useEffect(() => {
		if (!auth || !auth.status) {
			userLogin()
		}
	}, [userLogin, auth])

	return (
		<div>
			<p>Logging in</p>
		</div>
	)
}

export default Login
