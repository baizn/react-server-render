import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
//import createLogger from 'redux-logger'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
  let store = null

  if(process.env.NODE_ENV === 'production') {
    store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunkMiddleware, apiMiddleware)
    )
  } else {
    let createLogger = require('redux-logger')
    const logger = createLogger({
      level: 'info',
      collapsed: false,
      logger: console,
      predicate: (getState, action) => true
    })

    store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunkMiddleware, apiMiddleware, logger)
    )
  }

  if (module.hot && process.env.NODE_ENV !== 'production') {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
