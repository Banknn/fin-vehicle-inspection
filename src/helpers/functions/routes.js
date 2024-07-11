import { store } from '../../stores'

export const redirect = (path) => {
	const { routeHistoryRedux } = store.getState()
	routeHistoryRedux.push(path)
}
