import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './stores'
import { Routes } from './Routes'
import moment from 'moment'
import { ConfigProvider } from 'antd'
import thTH from 'antd/lib/locale/th_TH'
import 'moment/locale/th'

moment.locale('th')

function App() {
	return (
		<ConfigProvider locale={thTH}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Routes />
				</PersistGate>
			</Provider>
		</ConfigProvider>
	)
}

export default App
