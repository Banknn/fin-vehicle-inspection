import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { rootReducer } from '../reducers'

const initialState = {}

const middleWare = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
	persistedReducer,
	initialState,
	composeEnhancers(applyMiddleware(...middleWare))
)

export const persistor = persistStore(store)
