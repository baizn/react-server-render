import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import { browserHistory } from 'react-router'
import configureStore from 'store/configureStore'
import feRoutes from 'routes/index'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import _ from 'lodash'

let initialState = {}

if(window.__INITIAL_STATE__) {
    try {
        let initialDatas = JSON.parse(unEncodeURI(__INITIAL_STATE__))
        _.each(initialDatas, (val, key) => {
            initialState[key] = Immutable.fromJS(val)
        })
    } catch (error) {
        
    }
}

const store = configureStore(initialState)

ReactDom.render((
    <Provider store={store}>
        {feRoutes(browserHistory)}
    </Provider>
), document.getElementById('container'))